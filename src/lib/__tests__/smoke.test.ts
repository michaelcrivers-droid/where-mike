import { describe, expect, it } from 'vitest'
import { getDestinations } from '@/data/destinations'
import { destinationForDate } from '@/lib/dailyDestination'
import { createMovementPlan, resolvePosition } from '@/lib/movementEngine'
import {
  bearingBetween, haversineKm, isBearingInRun, isBearingOnLand, longestLandRun, roamArea,
} from '@/lib/geoUtils'
import { MIN_HOP_DISTANCE_KM, NO_REPEAT_COUNTRY_DAYS } from '@/config'
import { addDays } from '@/lib/timeUtils'
import type { MovementMode } from '@/types'

const MODES: MovementMode[] = ['stationary', 'walking', 'tourist', 'driving']

describe('smoke: determinism', () => {
  it('same date + seed -> same destination', () => {
    for (const d of ['2026-09-18', '2026-09-19', '2030-01-01', '1999-12-31']) {
      expect(destinationForDate(d).id).toBe(destinationForDate(d).id)
    }
  })

  it('consecutive days differ, respect spacing rules', () => {
    let key = '2026-01-01'
    const seen: string[] = []
    const countries: string[] = []
    const continents: string[] = []
    let prev = null as null | ReturnType<typeof destinationForDate>
    for (let i = 0; i < 400; i++) {
      const d = destinationForDate(key)
      expect(d).toBeDefined()
      if (prev) {
        expect(d.id).not.toBe(prev.id)
        expect(d.continent).not.toBe(prev.continent)
        expect(haversineKm(prev, d)).toBeGreaterThanOrEqual(MIN_HOP_DISTANCE_KM)
        const recentCountries = countries.slice(-NO_REPEAT_COUNTRY_DAYS)
        expect(recentCountries).not.toContain(d.countryCode)
      }
      seen.push(d.id)
      countries.push(d.countryCode)
      continents.push(d.continent)
      prev = d
      key = addDays(key, 1)
    }
    expect(new Set(seen).size).toBe(400)
    expect(new Set(continents).size).toBe(6)
    expect(new Set(countries).size).toBeGreaterThan(80)
  }, 60_000)
})

describe('smoke: land safety', () => {
  it('every sampled position stays inside a verified-land wedge', () => {
    const all = getDestinations()
    let checked = 0
    for (let i = 0; i < all.length; i += 7) {
      const destination = all[i]
      const run = longestLandRun(destination.landSectors)
      expect(run.length).toBeGreaterThanOrEqual(3)
      const area = roamArea(destination)
      for (const mode of MODES) {
        const plan = createMovementPlan({
          seed: 'smoke', dateKey: '2026-09-18', destination, mode,
        })
        for (let minute = 0; minute < 1440; minute += 7) {
          const p = resolvePosition(plan, minute)
          const distance = haversineKm(destination, p)
          // Stationary drift adds up to ~10m beyond a waypoint.
          expect(distance).toBeLessThanOrEqual(area.radiusKm + 0.05)
          // Close to the centre a few metres of drift swings the bearing
          // wildly, and the centre itself is verified land, so only check the
          // bearing once the point is meaningfully away from the middle.
          if (distance > 0.15) {
            const bearing = bearingBetween(destination, p)
            const where = `${destination.id} ${mode} @${minute} bearing ${bearing.toFixed(1)}`
            expect(isBearingOnLand(destination.landSectors, bearing), where).toBe(true)
            expect(isBearingInRun(run, bearing), where).toBe(true)
          }
          checked++
        }
      }
    }
    expect(checked).toBeGreaterThan(100000)
  }, 120_000)
})

describe('smoke: plan shape', () => {
  it('waypoints are strictly increasing and span the day', () => {
    const all = getDestinations()
    for (let i = 3; i < all.length; i += 53) {
      for (const mode of MODES) {
        const plan = createMovementPlan({
          seed: 'shape', dateKey: '2026-03-14', destination: all[i], mode,
        })
        expect(plan.waypoints[0].minute).toBe(0)
        expect(plan.waypoints[plan.waypoints.length - 1].minute).toBe(1440)
        for (let w = 1; w < plan.waypoints.length; w++) {
          expect(plan.waypoints[w].minute).toBeGreaterThan(plan.waypoints[w - 1].minute)
        }
        const moving = plan.segments.filter((s) => s.moving)
        expect(moving.length).toBeGreaterThan(0)
        for (const s of moving) expect(s.speedKmh).toBeLessThan(45)
      }
    }
  }, 60_000)

  it('position is continuous across segment boundaries', () => {
    const destination = getDestinations()[100]
    const plan = createMovementPlan({
      seed: 'cont', dateKey: '2026-06-01', destination, mode: 'tourist',
    })
    for (const wp of plan.waypoints.slice(1, -1)) {
      const before = resolvePosition(plan, wp.minute - 0.02)
      const after = resolvePosition(plan, wp.minute + 0.02)
      expect(haversineKm(before, after)).toBeLessThan(0.08)
    }
  })
})
