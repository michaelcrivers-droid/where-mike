/**
 * geoUtils — spherical geometry plus the sector logic that keeps the marker
 * on dry land.
 *
 * The sector helpers are checked against the documented mask semantics
 * (bit N covers the 22.5-degree sector starting at N * 22.5 degrees) rather
 * than against the implementation, so a change of convention shows up here
 * rather than in the ocean.
 */

import { describe, expect, it } from 'vitest'
import {
  bearingBetween,
  clampToRoamArea,
  easeInOut,
  haversineKm,
  isBearingOnLand,
  lerpCoord,
  longestLandRun,
  normaliseBearing,
  pointInRoamArea,
  project,
  roamArea,
  type Coord,
} from '@/lib/geoUtils'
import { createRng } from '@/lib/seededRandom'
import type { Destination } from '@/types'

const SECTOR_DEG = 22.5

const at = (latitude: number, longitude: number): Coord => ({ latitude, longitude })

const fakeDestination = (over: Partial<Destination> = {}): Destination => ({
  id: 'xx-test',
  city: 'Test',
  region: '',
  country: 'Testland',
  countryCode: 'XX',
  continent: 'Europe',
  latitude: 48.8566,
  longitude: 2.3522,
  timezone: 'Europe/Paris',
  safeRoamingRadiusKm: 6,
  category: 'major-city',
  landSectors: 0xffff,
  ...over,
})

describe('haversineKm', () => {
  it('is zero for a point against itself', () => {
    expect(haversineKm(at(48.8566, 2.3522), at(48.8566, 2.3522))).toBe(0)
  })

  it('matches known great-circle distances', () => {
    // London (51.5074, -0.1278) to Paris (48.8566, 2.3522) is ~343.5 km.
    expect(haversineKm(at(51.5074, -0.1278), at(48.8566, 2.3522))).toBeCloseTo(343.6, 0)
    // New York to London, ~5570 km.
    expect(haversineKm(at(40.7128, -74.006), at(51.5074, -0.1278))).toBeCloseTo(5570, -2)
    // One degree of latitude at the equator, ~111.19 km.
    expect(haversineKm(at(0, 0), at(1, 0))).toBeCloseTo(111.19, 1)
    // One degree of longitude at 60N is half a degree at the equator.
    expect(haversineKm(at(60, 0), at(60, 1))).toBeCloseTo(haversineKm(at(0, 0), at(0, 1)) / 2, 0)
  })

  it('is symmetric', () => {
    const a = at(-33.8688, 151.2093)
    const b = at(35.6762, 139.6503)
    expect(haversineKm(a, b)).toBeCloseTo(haversineKm(b, a), 9)
  })

  it('handles antipodes and the antimeridian without blowing up', () => {
    expect(haversineKm(at(0, 0), at(0, 180))).toBeCloseTo(20015, -1)
    expect(haversineKm(at(90, 0), at(-90, 0))).toBeCloseTo(20015, -1)
    // 179.9E to 179.9W is 0.2 degrees apart, not 359.8.
    expect(haversineKm(at(0, 179.9), at(0, -179.9))).toBeCloseTo(22.24, 1)
  })
})

describe('normaliseBearing', () => {
  it('folds any angle into [0, 360)', () => {
    const cases: Array<[number, number]> = [
      [0, 0], [359.9, 359.9], [360, 0], [370, 10], [-10, 350], [-360, 0], [-370, 350],
      [720, 0], [-721, 359],
    ]
    for (const [input, expected] of cases) {
      expect(normaliseBearing(input), `normaliseBearing(${input})`).toBeCloseTo(expected, 9)
    }
  })

  it('never returns 360', () => {
    for (let i = -2000; i <= 2000; i += 7) {
      const v = normaliseBearing(i)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(360)
    }
  })
})

describe('bearingBetween', () => {
  it('reads the cardinal directions correctly', () => {
    const origin = at(0, 0)
    expect(bearingBetween(origin, at(1, 0))).toBeCloseTo(0, 6)
    expect(bearingBetween(origin, at(0, 1))).toBeCloseTo(90, 6)
    expect(bearingBetween(origin, at(-1, 0))).toBeCloseTo(180, 6)
    expect(bearingBetween(origin, at(0, -1))).toBeCloseTo(270, 6)
  })

  it('always returns a normalised bearing', () => {
    const rng = createRng('bearings')
    let bad = 0
    for (let i = 0; i < 2000; i++) {
      const a = at(rng.range(-85, 85), rng.range(-180, 180))
      const b = at(rng.range(-85, 85), rng.range(-180, 180))
      const v = bearingBetween(a, b)
      if (!Number.isFinite(v) || v < 0 || v >= 360) bad++
    }
    expect(bad).toBe(0)
  })
})

describe('project', () => {
  it('round-trips against haversineKm and bearingBetween', () => {
    const rng = createRng('project')
    let worstKm = 0
    let worstDeg = 0
    for (let i = 0; i < 2000; i++) {
      const origin = at(rng.range(-80, 80), rng.range(-180, 180))
      const km = rng.range(0.01, 40)
      const bearing = rng.range(0, 360)
      const p = project(origin, km, bearing)
      worstKm = Math.max(worstKm, Math.abs(haversineKm(origin, p) - km))
      const back = bearingBetween(origin, p)
      const delta = Math.abs(((back - bearing + 540) % 360) - 180)
      worstDeg = Math.max(worstDeg, delta)
    }
    expect(worstKm).toBeLessThan(1e-6)
    expect(worstDeg).toBeLessThan(1e-6)
  }, 60_000)

  it('moves in the direction asked for', () => {
    const origin = at(10, 20)
    expect(project(origin, 100, 0).latitude).toBeGreaterThan(origin.latitude)
    expect(project(origin, 100, 180).latitude).toBeLessThan(origin.latitude)
    expect(project(origin, 100, 90).longitude).toBeGreaterThan(origin.longitude)
    expect(project(origin, 100, 270).longitude).toBeLessThan(origin.longitude)
    expect(project(origin, 0, 123)).toEqual({ latitude: 10, longitude: 20 })
  })

  it('keeps longitude inside [-180, 180) across the antimeridian', () => {
    const p = project(at(0, 179.95), 20, 90)
    expect(p.longitude).toBeGreaterThanOrEqual(-180)
    expect(p.longitude).toBeLessThan(180)
    expect(p.longitude).toBeLessThan(0)
    const rng = createRng('wrap')
    let bad = 0
    for (let i = 0; i < 1000; i++) {
      const q = project(at(rng.range(-80, 80), rng.range(-180, 180)), rng.range(0, 500), rng.range(0, 360))
      if (q.longitude < -180 || q.longitude >= 180 || Math.abs(q.latitude) > 90) bad++
    }
    expect(bad).toBe(0)
  })
})

describe('lerpCoord', () => {
  it('hits the endpoints exactly', () => {
    const a = at(10, 20)
    const b = at(11, 21)
    expect(lerpCoord(a, b, 0)).toEqual(a)
    expect(lerpCoord(a, b, 1).latitude).toBeCloseTo(b.latitude, 12)
    expect(lerpCoord(a, b, 1).longitude).toBeCloseTo(b.longitude, 12)
  })

  it('finds the midpoint', () => {
    const p = lerpCoord(at(0, 0), at(2, 4), 0.5)
    expect(p.latitude).toBeCloseTo(1, 12)
    expect(p.longitude).toBeCloseTo(2, 12)
  })

  it('takes the short way round the antimeridian', () => {
    // 179E to 179W is 2 degrees apart the short way, not 358 the long way.
    const p = lerpCoord(at(0, 179), at(0, -179), 0.5)
    expect(Math.abs(p.longitude)).toBeCloseTo(180, 9)
    expect(haversineKm(at(0, 179), p)).toBeLessThan(120)
    const q = lerpCoord(at(0, -179), at(0, 179), 0.5)
    expect(Math.abs(q.longitude)).toBeCloseTo(180, 9)
  })

  it('stays inside the longitude range for every t', () => {
    for (let t = 0; t <= 1; t += 0.01) {
      const p = lerpCoord(at(5, 178), at(6, -176), t)
      expect(p.longitude).toBeGreaterThanOrEqual(-180)
      expect(p.longitude).toBeLessThan(180)
    }
  })
})

describe('easeInOut', () => {
  it('is a clamped smoothstep', () => {
    expect(easeInOut(0)).toBe(0)
    expect(easeInOut(1)).toBe(1)
    expect(easeInOut(0.5)).toBeCloseTo(0.5, 12)
    expect(easeInOut(-5)).toBe(0)
    expect(easeInOut(7)).toBe(1)
  })

  it('is monotonic and symmetric about the midpoint', () => {
    let previous = -Infinity
    for (let t = 0; t <= 1.0001; t += 0.005) {
      const v = easeInOut(t)
      expect(v).toBeGreaterThanOrEqual(previous)
      previous = v
      expect(easeInOut(1 - t) + v).toBeCloseTo(1, 9)
    }
  })
})

describe('isBearingOnLand', () => {
  it('maps each bit to its own 22.5-degree sector', () => {
    for (let bit = 0; bit < 16; bit++) {
      const mask = 1 << bit
      const centre = bit * SECTOR_DEG + SECTOR_DEG / 2
      expect(isBearingOnLand(mask, centre), `bit ${bit} centre`).toBe(true)
      expect(isBearingOnLand(mask, bit * SECTOR_DEG), `bit ${bit} lower edge`).toBe(true)
      // The upper edge belongs to the next sector.
      expect(isBearingOnLand(mask, (bit + 1) * SECTOR_DEG), `bit ${bit} upper edge`).toBe(false)
    }
  })

  it('rejects everything for an empty mask and accepts everything for a full one', () => {
    for (let deg = -360; deg < 720; deg += 3.7) {
      expect(isBearingOnLand(0, deg)).toBe(false)
      expect(isBearingOnLand(0xffff, deg)).toBe(true)
    }
  })

  it('normalises the bearing before looking it up', () => {
    expect(isBearingOnLand(1, -5)).toBe(false)
    expect(isBearingOnLand(1, 365)).toBe(true)
    expect(isBearingOnLand(1 << 15, -5)).toBe(true)
    expect(isBearingOnLand(1 << 15, 355)).toBe(true)
  })
})

describe('longestLandRun', () => {
  it('handles the degenerate masks', () => {
    expect(longestLandRun(0)).toEqual({ start: 0, length: 0 })
    expect(longestLandRun(0xffff)).toEqual({ start: 0, length: 16 })
  })

  it('finds a simple run', () => {
    // Bits 2,3,4 set.
    expect(longestLandRun(0b0000000000011100)).toEqual({ start: 2, length: 3 })
    expect(longestLandRun(1)).toEqual({ start: 0, length: 1 })
  })

  it('wraps around zero', () => {
    // Bits 14,15,0,1 -> a run of 4 starting at 14.
    expect(longestLandRun(0b1100000000000011)).toEqual({ start: 14, length: 4 })
  })

  it('picks the longest of several runs', () => {
    // Bits 0,1 (length 2) and bits 5,6,7,8 (length 4).
    expect(longestLandRun(0b0000000111100011)).toEqual({ start: 5, length: 4 })
  })

  it('always reports a run that the mask really covers', () => {
    // Exhaustive over all 65,536 masks. Failures are collected rather than
    // asserted per iteration: one assertion at the end is orders of magnitude
    // faster and still names the first offending masks.
    const bad: string[] = []
    for (let mask = 1; mask <= 0xffff; mask++) {
      const run = longestLandRun(mask)
      if (run.length < 1 || run.length > 16) {
        bad.push(`mask ${mask}: run length ${run.length}`)
        continue
      }
      for (let k = 0; k < run.length; k++) {
        if ((mask & (1 << ((run.start + k) % 16))) === 0) {
          bad.push(`mask ${mask}: sector ${(run.start + k) % 16} in run is not land`)
          break
        }
      }
      if (run.length < 16 && (mask & (1 << ((run.start + 15) % 16))) !== 0) {
        bad.push(`mask ${mask}: run should have started one sector earlier`)
      }
    }
    expect(bad.slice(0, 10)).toEqual([])
  }, 60_000)

  it('is genuinely the longest run, checked by brute force', () => {
    const bad: string[] = []
    for (let mask = 1; mask <= 0xffff; mask++) {
      let best = 0
      for (let start = 0; start < 16; start++) {
        let len = 0
        while (len < 16 && (mask & (1 << ((start + len) % 16))) !== 0) len++
        if (len > best) best = len
      }
      const reported = longestLandRun(mask).length
      if (reported !== best) bad.push(`mask ${mask}: reported ${reported}, brute force says ${best}`)
    }
    expect(bad.slice(0, 10)).toEqual([])
  }, 60_000)

  it('reports every bearing in the run as land', () => {
    for (const mask of [0b1100000000000011, 0b0000000111100011, 49183, 64767, 0xffff]) {
      const run = longestLandRun(mask)
      for (let k = 0; k < run.length; k++) {
        const centre = ((run.start + k) % 16) * SECTOR_DEG + SECTOR_DEG / 2
        expect(isBearingOnLand(mask, centre), `mask ${mask} sector ${k}`).toBe(true)
      }
    }
  })
})

describe('roamArea', () => {
  it('centres on the destination and scales the radius', () => {
    const d = fakeDestination({ safeRoamingRadiusKm: 6 })
    expect(roamArea(d).centre).toEqual({ latitude: d.latitude, longitude: d.longitude })
    expect(roamArea(d).radiusKm).toBeCloseTo(6, 9)
    expect(roamArea(d, 2).radiusKm).toBeCloseTo(12, 9)
    expect(roamArea(d, 0.5).radiusKm).toBeCloseTo(3, 9)
  })

  it('never lets the radius collapse below the 300 m floor', () => {
    expect(roamArea(fakeDestination({ safeRoamingRadiusKm: 6 }), 0.001).radiusKm).toBe(0.3)
    expect(roamArea(fakeDestination({ safeRoamingRadiusKm: 0 })).radiusKm).toBe(0.3)
  })

  it('derives its bearing window from the longest land run', () => {
    // Bits 4..7 -> the run starts at 90 degrees and is 90 degrees wide, less
    // whatever inset the module keeps clear of the sector edges.
    const area = roamArea(fakeDestination({ landSectors: 0b0000000011110000 }))
    expect(area.from).toBeGreaterThanOrEqual(90)
    expect(area.from).toBeLessThan(90 + SECTOR_DEG)
    expect(area.span).toBeGreaterThan(0)
    expect(area.from + area.span).toBeLessThanOrEqual(180)
  })

  it('gives a full-circle mask the whole compass', () => {
    const area = roamArea(fakeDestination({ landSectors: 0xffff }))
    expect(area.span).toBeGreaterThanOrEqual(360 - 1e-6)
  })
})

describe('pointInRoamArea', () => {
  const inWindow = (offset: number, span: number): boolean =>
    span >= 360 - 1e-6 || offset <= span + 1e-6

  it('always lands inside the radius and inside the wedge', () => {
    const masks = [0xffff, 0b1100000000000011, 0b0000000011110000, 49183, 64767, 0b0000000000000111]
    for (const landSectors of masks) {
      const d = fakeDestination({ landSectors, safeRoamingRadiusKm: 8 })
      const area = roamArea(d)
      const rng = createRng(`pira-${landSectors}`)
      const bad: string[] = []
      for (let i = 0; i < 4000; i++) {
        const p = pointInRoamArea(area, rng)
        const distance = haversineKm(area.centre, p)
        if (distance > area.radiusKm + 1e-9) {
          bad.push(`mask ${landSectors}: ${distance} km beyond ${area.radiusKm}`)
          continue
        }
        if (distance <= 1e-6) continue
        const bearing = bearingBetween(area.centre, p)
        if (!inWindow(normaliseBearing(bearing - area.from), area.span)) {
          bad.push(`mask ${landSectors}: bearing ${bearing} outside the wedge`)
        } else if (!isBearingOnLand(landSectors, bearing)) {
          bad.push(`mask ${landSectors}: bearing ${bearing} is water`)
        }
      }
      expect(bad.slice(0, 5)).toEqual([])
    }
  }, 60_000)

  it('respects maxFraction', () => {
    const area = roamArea(fakeDestination({ safeRoamingRadiusKm: 10 }))
    const rng = createRng('frac')
    let worst = 0
    for (let i = 0; i < 2000; i++) {
      worst = Math.max(worst, haversineKm(area.centre, pointInRoamArea(area, rng, 0.25)))
    }
    expect(worst).toBeLessThanOrEqual(2.5 + 1e-9)
  })

  it('pulls points inwards as centreBias rises', () => {
    const area = roamArea(fakeDestination({ safeRoamingRadiusKm: 10 }))
    const mean = (bias: number): number => {
      const rng = createRng(`bias-${bias}`)
      let total = 0
      for (let i = 0; i < 4000; i++) total += haversineKm(area.centre, pointInRoamArea(area, rng, 1, bias))
      return total / 4000
    }
    expect(mean(3)).toBeLessThan(mean(1))
  })

  it('returns the centre when the wedge has no width', () => {
    const area = { centre: at(1, 2), radiusKm: 5, from: 0, span: 0 }
    expect(pointInRoamArea(area, createRng('zero'))).toEqual(area.centre)
  })

  it('is deterministic for a given rng seed', () => {
    const area = roamArea(fakeDestination())
    const run = (): Coord[] => {
      const rng = createRng('same')
      return Array.from({ length: 32 }, () => pointInRoamArea(area, rng))
    }
    expect(run()).toEqual(run())
  })
})

describe('clampToRoamArea', () => {
  it('leaves a point that is already inside alone', () => {
    const area = roamArea(fakeDestination({ landSectors: 0xffff, safeRoamingRadiusKm: 6 }))
    const inside = project(area.centre, 3, 45)
    expect(clampToRoamArea(area, inside)).toEqual(inside)
  })

  it('pulls a point outside the radius back to the boundary', () => {
    const area = roamArea(fakeDestination({ landSectors: 0xffff, safeRoamingRadiusKm: 6 }))
    const far = project(area.centre, 40, 200)
    const clamped = clampToRoamArea(area, far)
    expect(haversineKm(area.centre, clamped)).toBeCloseTo(area.radiusKm, 6)
    expect(bearingBetween(area.centre, clamped)).toBeCloseTo(200, 4)
  })

  it('folds a point outside the wedge onto the nearest edge', () => {
    const d = fakeDestination({ landSectors: 0b0000000011110000, safeRoamingRadiusKm: 6 })
    const area = roamArea(d)
    // Due north is nowhere near the 90-180 degree wedge.
    const stray = project(area.centre, 3, 0)
    const clamped = clampToRoamArea(area, stray)
    const offset = normaliseBearing(bearingBetween(area.centre, clamped) - area.from)
    expect(offset <= area.span + 1e-6 || offset >= 360 - 1e-6).toBe(true)
    expect(haversineKm(area.centre, clamped)).toBeLessThanOrEqual(area.radiusKm + 1e-6)
  })

  it('folds every in-radius stray into the wedge, whatever the mask', () => {
    // This is the guarantee resolvePosition leans on: interpolated and drifted
    // points are always within the radius already, and what needs correcting is
    // the bearing.
    const masks = [0xffff, 0b1100000000000011, 0b0000000011110000, 49183, 64767]
    for (const landSectors of masks) {
      const area = roamArea(fakeDestination({ landSectors, safeRoamingRadiusKm: 6 }))
      const rng = createRng(`clamp-${landSectors}`)
      const bad: string[] = []
      for (let i = 0; i < 2000; i++) {
        const stray = project(area.centre, rng.range(0, area.radiusKm), rng.range(0, 360))
        const clamped = clampToRoamArea(area, stray)
        const distance = haversineKm(area.centre, clamped)
        if (distance > area.radiusKm + 1e-6) {
          bad.push(`mask ${landSectors}: ${distance} km beyond ${area.radiusKm}`)
          continue
        }
        if (distance <= 1e-6 || area.span >= 360 - 1e-6) continue
        const offset = normaliseBearing(bearingBetween(area.centre, clamped) - area.from)
        if (!(offset <= area.span + 1e-6 || offset >= 360 - 1e-6)) {
          bad.push(`mask ${landSectors}: offset ${offset} outside span ${area.span}`)
        }
      }
      expect(bad.slice(0, 5)).toEqual([])
    }
  }, 60_000)

  it('only corrects the distance for a point beyond the radius', () => {
    // Documented limitation, not currently reachable from the movement engine:
    // the out-of-radius branch pulls the point back to the boundary along its
    // own bearing and never consults the wedge, so a far-away point on a water
    // bearing stays on that bearing. Every position the engine feeds in is
    // already inside the radius, so nothing relies on more than this today.
    const area = roamArea(fakeDestination({ landSectors: 0b1100000000000011, safeRoamingRadiusKm: 6 }))
    const waterBearing = 205
    expect(normaliseBearing(waterBearing - area.from)).toBeGreaterThan(area.span)
    const clamped = clampToRoamArea(area, project(area.centre, 25, waterBearing))
    expect(haversineKm(area.centre, clamped)).toBeCloseTo(area.radiusKm, 6)
    expect(bearingBetween(area.centre, clamped)).toBeCloseTo(waterBearing, 4)
  })
})
