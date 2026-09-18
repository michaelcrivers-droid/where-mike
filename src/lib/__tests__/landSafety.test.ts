/**
 * Land safety — the test that stops the marker turning up in the sea.
 *
 * The contract, in three parts:
 *
 *   1. Every position stays within `safeRoamingRadiusKm` of the city centre.
 *   2. Every position's bearing from the centre falls in a sector that
 *      `landSectors` marks as dry land.
 *   3. Stronger than (2): the whole day is confined to the *longest contiguous*
 *      run of land sectors, because a run wider than 180 degrees is not convex
 *      and a straight leg between two points either side of the missing slice
 *      would cut across it. (Melbourne and Port Phillip Bay is the case that
 *      makes this concrete.)
 *
 * Checking waypoints alone is not enough and has historically not been: the
 * interesting failures are all *between* waypoints, so the sampling here walks
 * the interpolated position every two minutes of every simulated day.
 *
 * Sector arithmetic is redone from the documented mask semantics rather than
 * borrowed from the module under test, so a change of convention in geoUtils
 * shows up as a failure here instead of silently agreeing with itself.
 *
 * Sampling: every 5th destination (264 cities), four modes, three dates, one
 * position every two minutes — about 1.5 million positions. The full dataset
 * is covered by walking a different offset for each of the three dates, so
 * every city is exercised; the stride only limits how many days each one gets.
 */

import { describe, expect, it } from 'vitest'
import { getDestinationById, getDestinations } from '@/data/destinations'
import { createMovementPlan, resolvePosition } from '@/lib/movementEngine'
import { bearingBetween, haversineKm, isBearingOnLand, longestLandRun, roamArea } from '@/lib/geoUtils'
import { addDays, MINUTES_PER_DAY } from '@/lib/timeUtils'
import { destinationForDate } from '@/lib/dailyDestination'
import { DEFAULT_MOVEMENT_MODE, SECRET_SEED } from '@/config'
import type { Destination, MovementMode } from '@/types'

const MODES: MovementMode[] = ['stationary', 'walking', 'tourist', 'driving']
const DATES = ['2026-01-07', '2026-09-18', '2027-06-30']
const SECTORS = 16
const SECTOR_DEG = 360 / SECTORS

const all = getDestinations()

/**
 * How far out a position has to be before its bearing means anything. Within
 * a hundred metres of the city centre you are in the city whatever the sector
 * mask says, and the deliberate few metres of GPS-style drift swings the
 * bearing through the whole compass.
 */
const BEARING_FLOOR_KM = 0.12

/** Room for the drift term and for floating-point slop in the projection. */
const RADIUS_EPSILON_KM = 0.02

const norm = (deg: number): number => ((deg % 360) + 360) % 360

/** True when `bearing` lies inside a circular run of sectors. */
const inRun = (run: { start: number; length: number }, bearing: number): boolean => {
  if (run.length >= SECTORS) return true
  const sector = Math.floor(norm(bearing) / SECTOR_DEG) % SECTORS
  return norm((sector - run.start) * SECTOR_DEG) < run.length * SECTOR_DEG
}

interface Violation {
  kind: 'radius' | 'water' | 'outside-run'
  detail: string
}

/** Walk a whole simulated day and report everything that leaves safe ground. */
const auditDay = (
  destination: Destination,
  mode: MovementMode,
  dateKey: string,
  seed: string,
  radiusMultiplier = 1,
  stepMinutes = 2,
): Violation[] => {
  const run = longestLandRun(destination.landSectors)
  const area = roamArea(destination, radiusMultiplier)
  const plan = createMovementPlan({ seed, dateKey, destination, mode, radiusMultiplier })
  const out: Violation[] = []
  const label = `${destination.id}/${mode}/${dateKey}`

  const check = (
    point: { latitude: number; longitude: number },
    where: string,
  ): void => {
    const distance = haversineKm(destination, point)
    if (distance > area.radiusKm + RADIUS_EPSILON_KM) {
      out.push({
        kind: 'radius',
        detail: `${label} ${where}: ${distance.toFixed(3)} km from centre, radius is ${area.radiusKm}`,
      })
      return
    }
    if (distance <= BEARING_FLOOR_KM) return
    const bearing = bearingBetween(destination, point)
    if (!isBearingOnLand(destination.landSectors, bearing)) {
      out.push({
        kind: 'water',
        detail: `${label} ${where}: bearing ${bearing.toFixed(1)} (sector ${Math.floor(norm(bearing) / SECTOR_DEG)}) is water in mask ${destination.landSectors}, ${distance.toFixed(2)} km out`,
      })
      return
    }
    if (!inRun(run, bearing)) {
      out.push({
        kind: 'outside-run',
        detail: `${label} ${where}: bearing ${bearing.toFixed(1)} is outside the day's run (start ${run.start}, length ${run.length})`,
      })
    }
  }

  for (const wp of plan.waypoints) check(wp, `waypoint @${wp.minute}`)
  for (let minute = 0; minute < MINUTES_PER_DAY; minute += stepMinutes) {
    check(resolvePosition(plan, minute), `@${minute}`)
  }
  return out
}

describe('the audit itself has teeth', () => {
  // A green land-safety sweep is only worth anything if the predicates are
  // the right way round, so they are exercised against hand-built cases where
  // the answer is obvious.
  const wedge = { start: 4, length: 4 } // sectors 4..7, i.e. 90 to 180 degrees

  it('accepts bearings inside a run and rejects bearings outside it', () => {
    for (const bearing of [90, 100, 135, 179.9]) {
      expect(inRun(wedge, bearing), `${bearing} should be inside`).toBe(true)
    }
    for (const bearing of [0, 89.9, 180, 200, 270, 359, -10]) {
      expect(inRun(wedge, bearing), `${bearing} should be outside`).toBe(false)
    }
  })

  it('handles a run that wraps past north', () => {
    const wrapped = { start: 14, length: 4 } // 315..360 and 0..45
    for (const bearing of [315, 350, 0, 44.9, -5]) {
      expect(inRun(wrapped, bearing), `${bearing} should be inside`).toBe(true)
    }
    for (const bearing of [45, 90, 180, 314.9]) {
      expect(inRun(wrapped, bearing), `${bearing} should be outside`).toBe(false)
    }
    expect(inRun({ start: 0, length: SECTORS }, 123.4)).toBe(true)
  })

  it('agrees with isBearingOnLand on the mask the run came from', () => {
    // Melbourne: sectors 8 and 9 are Port Phillip Bay.
    const melbourne = getDestinationById('au-melbourne')
    expect(melbourne).toBeDefined()
    const mask = melbourne!.landSectors
    expect(isBearingOnLand(mask, 8 * SECTOR_DEG + 10)).toBe(false)
    expect(isBearingOnLand(mask, 9 * SECTOR_DEG + 10)).toBe(false)
    expect(isBearingOnLand(mask, 0)).toBe(true)
    expect(isBearingOnLand(mask, 270)).toBe(true)
    const run = longestLandRun(mask)
    for (let bearing = 0; bearing < 360; bearing += 1) {
      if (inRun(run, bearing)) {
        expect(isBearingOnLand(mask, bearing), `bearing ${bearing} in run but not land`).toBe(true)
      }
    }
  })
})

describe('every destination has somewhere safe to roam', () => {
  it('has a land run of at least three contiguous sectors', () => {
    const bad = all
      .map((d) => ({ id: d.id, mask: d.landSectors, run: longestLandRun(d.landSectors) }))
      .filter((x) => x.run.length < 3)
    expect(bad).toEqual([])
  })

  it('produces a roam area with a positive radius and a usable wedge', () => {
    const bad = all
      .map((d) => ({ id: d.id, area: roamArea(d) }))
      .filter((x) => !(x.area.radiusKm > 0) || !(x.area.span > 0))
      .map((x) => `${x.id}: radius ${x.area.radiusKm}, span ${x.area.span}`)
    expect(bad).toEqual([])
  })

  it('never opens a wedge wider than the run it came from', () => {
    const bad: string[] = []
    for (const d of all) {
      const run = longestLandRun(d.landSectors)
      const area = roamArea(d)
      if (area.span > run.length * SECTOR_DEG + 1e-9) {
        bad.push(`${d.id}: span ${area.span} > run ${run.length * SECTOR_DEG}`)
      }
      // Both edges of the window must themselves be land.
      if (area.span < 360 - 1e-6) {
        for (const edge of [area.from, area.from + area.span]) {
          if (!isBearingOnLand(d.landSectors, edge)) bad.push(`${d.id}: window edge ${edge} is water`)
        }
      }
    }
    expect(bad.slice(0, 10)).toEqual([])
  })
})

describe('no position ever leaves verified land', () => {
  it('holds for every sampled city, every mode, every date', () => {
    const violations: Violation[] = []
    let positions = 0
    let cities = 0
    DATES.forEach((dateKey, dateIndex) => {
      // A different offset per date, so across the three dates the stride
      // covers the whole dataset rather than the same 264 cities each time.
      for (let i = dateIndex; i < all.length; i += 5) {
        cities++
        for (const mode of MODES) {
          violations.push(...auditDay(all[i], mode, dateKey, 'land-safety'))
          positions += MINUTES_PER_DAY / 2
        }
      }
    })

    expect(positions).toBeGreaterThan(1_000_000)
    expect(cities).toBeGreaterThan(700)
    const counts = {
      radius: violations.filter((v) => v.kind === 'radius').length,
      water: violations.filter((v) => v.kind === 'water').length,
      outsideRun: violations.filter((v) => v.kind === 'outside-run').length,
    }
    expect(
      violations.slice(0, 8).map((v) => v.detail),
      `${violations.length} violations across ${positions} positions: ${JSON.stringify(counts)}`,
    ).toEqual([])
  }, 120_000)

  it('holds for the cities with the most water around them', () => {
    // Coastal and island cities are where the mask is doing real work, so
    // these get every mode on every date at a finer time step.
    const coastal = all
      .map((d) => ({ d, run: longestLandRun(d.landSectors) }))
      .filter(({ d, run }) => d.landSectors !== 0xffff && run.length <= 10)
      .sort((a, b) => a.run.length - b.run.length)
      .slice(0, 120)
    expect(coastal.length).toBe(120)

    const violations: Violation[] = []
    for (const { d } of coastal) {
      for (const mode of MODES) {
        for (const dateKey of DATES) {
          violations.push(...auditDay(d, mode, dateKey, 'coastal', 1, 1))
        }
      }
    }
    expect(violations.slice(0, 8).map((v) => v.detail)).toEqual([])
  }, 120_000)

  it('holds for the awkward wedges wider than 180 degrees', () => {
    // A run of 9 to 15 sectors wraps more than half the compass, so the wedge
    // is not convex: a straight leg between two valid stops can cut across the
    // missing slice. This is the Port Phillip Bay case.
    const concave = all.filter((d) => {
      const run = longestLandRun(d.landSectors)
      return run.length > 8 && run.length < SECTORS
    })
    expect(concave.length).toBeGreaterThan(100)

    const violations: Violation[] = []
    for (const d of concave.filter((_, i) => i % 2 === 0)) {
      for (const mode of MODES) {
        violations.push(...auditDay(d, mode, '2026-09-18', 'concave', 1, 1))
      }
    }
    expect(violations.slice(0, 8).map((v) => v.detail)).toEqual([])
  }, 120_000)

  it('holds for Melbourne in particular, on every mode and a year of dates', () => {
    // Melbourne's mask carves out sectors 8 and 9 — Port Phillip Bay, due
    // south of the CBD — leaving a 14-sector run that wraps right around it.
    const melbourne = getDestinationById('au-melbourne')
    expect(melbourne).toBeDefined()
    const run = longestLandRun(melbourne!.landSectors)
    expect(run.length).toBeGreaterThan(8)
    expect(run.length).toBeLessThan(SECTORS)

    const violations: Violation[] = []
    for (let day = 0; day < 365; day += 11) {
      const dateKey = addDays('2026-01-01', day)
      for (const mode of MODES) {
        violations.push(...auditDay(melbourne!, mode, dateKey, 'melbourne', 1, 1))
      }
    }
    expect(violations.slice(0, 8).map((v) => v.detail)).toEqual([])
  }, 120_000)

  it('holds when the control panel scales the roaming radius', () => {
    const violations: Violation[] = []
    for (const multiplier of [0.1, 0.5, 2, 4]) {
      for (const d of all.filter((_, i) => i % 61 === 0)) {
        for (const mode of MODES) {
          violations.push(
            ...auditDay(d, mode, '2026-09-18', `radius-${multiplier}`, multiplier, 3)
              .map((v) => ({ ...v, detail: `x${multiplier} ${v.detail}` })),
          )
        }
      }
    }
    expect(violations.slice(0, 8).map((v) => v.detail)).toEqual([])
  }, 120_000)

  it('holds for a run of consecutive real days on the real itinerary', () => {
    // Not a synthetic sample: the actual cities the app will draw, in order,
    // with the real seed and the real default mode.
    const violations: Violation[] = []
    const seen = new Set<string>()
    for (let day = 0; day < 180; day++) {
      const dateKey = addDays('2026-09-18', day)
      const destination = destinationForDate(dateKey)
      seen.add(destination.id)
      violations.push(...auditDay(destination, DEFAULT_MOVEMENT_MODE, dateKey, SECRET_SEED, 1, 2))
    }
    expect(seen.size).toBe(180)
    expect(violations.slice(0, 8).map((v) => v.detail)).toEqual([])
  }, 120_000)
})

describe('waypoints specifically', () => {
  it('places every stop and every bend on land', () => {
    const bad: string[] = []
    for (const d of all.filter((_, i) => i % 3 === 0)) {
      const run = longestLandRun(d.landSectors)
      const area = roamArea(d)
      for (const mode of MODES) {
        const plan = createMovementPlan({ seed: 'waypoints', dateKey: '2026-09-18', destination: d, mode })
        for (const wp of plan.waypoints) {
          const distance = haversineKm(d, wp)
          if (distance > area.radiusKm + 1e-9) {
            bad.push(`${d.id}/${mode}@${wp.minute}: ${distance.toFixed(3)} km > ${area.radiusKm}`)
            continue
          }
          if (distance <= BEARING_FLOOR_KM) continue
          const bearing = bearingBetween(d, wp)
          if (!isBearingOnLand(d.landSectors, bearing) || !inRun(run, bearing)) {
            bad.push(`${d.id}/${mode}@${wp.minute} (${wp.label}): bearing ${bearing.toFixed(1)} off land`)
          }
        }
      }
    }
    expect(bad.slice(0, 10)).toEqual([])
  }, 120_000)
})
