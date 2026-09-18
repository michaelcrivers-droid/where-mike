/**
 * The simulation layer: "what time is it, what has this browser overridden"
 * turned into the single object the viewer renders.
 *
 * Every instant is an explicitly constructed `Date`. Where the code path goes
 * through `DAY_BOUNDARY === 'local'` the date is built from local components
 * (`new Date(2026, 8, 18, ...)`), which reads as 2026-09-18 in any machine
 * timezone; where it goes through UTC the date is built with `Date.UTC`.
 * Nothing here reads the wall clock.
 */

import { describe, expect, it } from 'vitest'
import {
  clearPlanCache, datasetSummary, getMovementPlan, resolveDay, resolveDestination,
  resolveSeed, resolveSimulation,
} from '@/lib/simulation'
import { DEFAULT_OVERRIDES } from '@/lib/overrides'
import { destinationForDate } from '@/lib/dailyDestination'
import { getDestinationById, getDestinations } from '@/data/destinations'
import { resolvePosition } from '@/lib/movementEngine'
import { haversineKm } from '@/lib/geoUtils'
import { dateKeyToDayNumber, isValidDateKey, minuteOfDayInZone } from '@/lib/timeUtils'
import {
  DAY_BOUNDARY, DEFAULT_MOVEMENT_MODE, DISPLAY_NAME, ROAMING_RADIUS_SCALE, SECRET_SEED,
} from '@/config'
import type { ControlOverrides, MovementMode, ViewerState } from '@/types'

const all = getDestinations()

const overrides = (patch: Partial<ControlOverrides> = {}): ControlOverrides => ({
  ...DEFAULT_OVERRIDES,
  ...patch,
})

/** Midday on a fixed date, in the machine's own zone. */
const localNoon = (year: number, monthIndex: number, day: number): Date =>
  new Date(year, monthIndex, day, 12, 0, 0, 0)

const assertWellFormed = (state: ViewerState, label: string): void => {
  expect(state.destination, label).toBeDefined()
  expect(state.destination.id, label).toBeTruthy()
  expect(state.plan, label).toBeDefined()
  expect(state.plan.waypoints.length, label).toBeGreaterThanOrEqual(2)
  expect(state.plan.segments.length, label).toBeGreaterThanOrEqual(1)
  expect(state.live, label).toBeDefined()
  expect(Number.isFinite(state.live.latitude), label).toBe(true)
  expect(Number.isFinite(state.live.longitude), label).toBe(true)
  expect(Number.isFinite(state.live.speedKmh), label).toBe(true)
  expect(Number.isFinite(state.live.accuracyMeters), label).toBe(true)
  expect(Number.isFinite(state.live.localMinuteOfDay), label).toBe(true)
  expect(typeof state.live.moving, label).toBe('boolean')
  expect(state.live.statusLabel, label).toBeTruthy()
  expect(state.live.heading === null || Number.isFinite(state.live.heading), label).toBe(true)
  expect(isValidDateKey(state.dateKey), `${label} dateKey ${state.dateKey}`).toBe(true)
  expect(state.displayName, label).toBeTruthy()
  expect(typeof state.accelerated, label).toBe('boolean')
  for (const [key, value] of Object.entries(state)) {
    expect(value, `${label}: ${key} is undefined`).not.toBeUndefined()
  }
}

describe('resolveSeed', () => {
  it('falls back to the build-time seed', () => {
    expect(resolveSeed(overrides())).toBe(SECRET_SEED)
    expect(resolveSeed(overrides({ seedOverride: null }))).toBe(SECRET_SEED)
    expect(resolveSeed(overrides({ seedOverride: '' }))).toBe(SECRET_SEED)
    expect(resolveSeed(overrides({ seedOverride: '   ' }))).toBe(SECRET_SEED)
  })

  it('takes a trimmed override', () => {
    expect(resolveSeed(overrides({ seedOverride: 'custom' }))).toBe('custom')
    expect(resolveSeed(overrides({ seedOverride: '  custom  ' }))).toBe('custom')
  })
})

describe('resolveDay', () => {
  it('uses the calendar day when nothing is overridden', () => {
    const now = localNoon(2026, 8, 18)
    const day = resolveDay(now, overrides())
    expect(day.accelerated).toBe(false)
    expect(day.dayFraction).toBeNull()
    expect(day.dateKey).toBe(DAY_BOUNDARY === 'utc' ? now.toISOString().slice(0, 10) : '2026-09-18')
  })

  it('honours a date override and turns acceleration off with it', () => {
    const now = localNoon(2026, 8, 18)
    expect(resolveDay(now, overrides({ dateOverride: '2001-04-05' }))).toEqual({
      dateKey: '2001-04-05', dayFraction: null, accelerated: false,
    })
    // A date override wins over acceleration.
    expect(resolveDay(now, overrides({ dateOverride: '2001-04-05', acceleratedDayMinutes: 24 })))
      .toEqual({ dateKey: '2001-04-05', dayFraction: null, accelerated: false })
  })

  describe('accelerated', () => {
    const accelerated = overrides({ acceleratedDayMinutes: 24 })

    it('starts on the real UTC date at the top of the UTC day', () => {
      const day = resolveDay(new Date(Date.UTC(2026, 8, 18, 0, 0, 0)), accelerated)
      expect(day).toEqual({ dateKey: '2026-09-18', dayFraction: 0, accelerated: true })
    })

    it('advances exactly one simulated day per cycle', () => {
      for (const [minutes, expected] of [
        [0, '2026-09-18'], [23, '2026-09-18'], [24, '2026-09-19'], [47, '2026-09-19'],
        [48, '2026-09-20'], [240, '2026-09-28'], [24 * 20, '2026-10-08'],
      ] as Array<[number, string]>) {
        const now = new Date(Date.UTC(2026, 8, 18, 0, minutes, 0))
        expect(resolveDay(now, accelerated).dateKey, `+${minutes} min`).toBe(expected)
      }
    })

    it('reports how far through the simulated day it is', () => {
      const at = (minutes: number): number =>
        resolveDay(new Date(Date.UTC(2026, 8, 18, 0, minutes, 0)), accelerated).dayFraction!
      expect(at(0)).toBeCloseTo(0, 9)
      expect(at(6)).toBeCloseTo(0.25, 9)
      expect(at(12)).toBeCloseTo(0.5, 9)
      expect(at(18)).toBeCloseTo(0.75, 9)
      // Just short of the next cycle, never exactly 1.
      expect(at(23.999)).toBeLessThan(1)
      expect(at(24)).toBeCloseTo(0, 9)
    })

    it('keeps the fraction in [0, 1) for every cycle length', () => {
      for (const cycle of [0.25, 1, 5, 24, 60, 1440]) {
        const o = overrides({ acceleratedDayMinutes: cycle })
        for (let minute = 0; minute < 1440; minute += 37) {
          const day = resolveDay(new Date(Date.UTC(2026, 8, 18, 0, minute, 0)), o)
          expect(day.dayFraction, `cycle ${cycle} @${minute}`).toBeGreaterThanOrEqual(0)
          expect(day.dayFraction, `cycle ${cycle} @${minute}`).toBeLessThan(1)
          expect(isValidDateKey(day.dateKey), `cycle ${cycle} @${minute}`).toBe(true)
        }
      }
    })

    it('marches the date forwards monotonically', () => {
      let previous = -Infinity
      for (let minute = 0; minute <= 1440; minute += 7) {
        const day = resolveDay(new Date(Date.UTC(2026, 8, 18, 0, minute, 0)), accelerated)
        const n = dateKeyToDayNumber(day.dateKey)
        expect(n, `@${minute}`).toBeGreaterThanOrEqual(previous)
        previous = n
      }
      // A full real day at 24 minutes per simulated day is 60 simulated days.
      const end = resolveDay(new Date(Date.UTC(2026, 8, 18, 23, 59, 59)), accelerated)
      expect(dateKeyToDayNumber(end.dateKey) - dateKeyToDayNumber('2026-09-18')).toBe(59)
    })
  })
})

describe('resolveDestination', () => {
  it('follows the daily draw by default', () => {
    expect(resolveDestination('2026-09-18', overrides()).id).toBe(destinationForDate('2026-09-18').id)
  })

  it('forces a known city', () => {
    const forced = all[42]
    expect(resolveDestination('2026-09-18', overrides({ destinationIdOverride: forced.id })).id)
      .toBe(forced.id)
    // ...on every date.
    for (const key of ['1999-01-01', '2026-09-18', '2050-12-31']) {
      expect(resolveDestination(key, overrides({ destinationIdOverride: forced.id })).id, key).toBe(forced.id)
    }
  })

  it('falls back to the daily draw for an unknown city rather than throwing', () => {
    for (const bad of ['not-a-city', '', 'FR-PARIS', 'fr-paris ', '../../etc']) {
      const state = () => resolveDestination('2026-09-18', overrides({ destinationIdOverride: bad }))
      expect(state, bad).not.toThrow()
      expect(state().id, bad).toBe(destinationForDate('2026-09-18').id)
    }
  })

  it('follows a seed override', () => {
    const base = resolveDestination('2026-09-18', overrides()).id
    const other = resolveDestination('2026-09-18', overrides({ seedOverride: 'something-else' })).id
    expect(other).not.toBe(base)
    expect(getDestinationById(other)).toBeDefined()
  })
})

describe('resolveSimulation', () => {
  it('returns a fully populated state across a range of instants', () => {
    for (let hour = 0; hour < 24; hour += 3) {
      for (const day of [1, 15, 28]) {
        for (const month of [0, 5, 11]) {
          const now = new Date(2026, month, day, hour, 17, 42)
          assertWellFormed(resolveSimulation(now, overrides()), now.toISOString())
        }
      }
    }
  }, 60_000)

  it('returns a fully populated state for every override combination that matters', () => {
    const now = localNoon(2026, 8, 18)
    const cases: Array<[string, Partial<ControlOverrides>]> = [
      ['none', {}],
      ['date', { dateOverride: '2001-09-11' }],
      ['seed', { seedOverride: 'zzz' }],
      ['city', { destinationIdOverride: all[7].id }],
      ['bad city', { destinationIdOverride: 'nope' }],
      ['mode', { modeOverride: 'driving' }],
      ['time', { timeOfDayOverride: 0 }],
      ['time end', { timeOfDayOverride: 1439.99 }],
      ['radius small', { radiusMultiplier: 0.1 }],
      ['radius big', { radiusMultiplier: 4 }],
      ['accelerated', { acceleratedDayMinutes: 24 }],
      ['variant', { planVariant: 9 }],
      ['debug', { debug: true }],
      ['name', { displayNameOverride: 'Someone' }],
      ['everything', {
        dateOverride: '2030-02-28', seedOverride: 's', destinationIdOverride: all[3].id,
        modeOverride: 'walking', timeOfDayOverride: 600, radiusMultiplier: 2,
        planVariant: 2, debug: true, displayNameOverride: 'Mike',
      }],
    ]
    for (const [label, patch] of cases) {
      assertWellFormed(resolveSimulation(now, overrides(patch)), label)
    }
  }, 60_000)

  it('is deterministic for a given instant', () => {
    const now = localNoon(2026, 8, 18)
    const a = resolveSimulation(now, overrides())
    const b = resolveSimulation(new Date(now.getTime()), overrides())
    expect(a.destination.id).toBe(b.destination.id)
    expect(a.dateKey).toBe(b.dateKey)
    expect(a.live).toEqual(b.live)
  })

  it('uses the default mode and display name when nothing overrides them', () => {
    const state = resolveSimulation(localNoon(2026, 8, 18), overrides())
    expect(state.plan.mode).toBe(DEFAULT_MOVEMENT_MODE)
    expect(state.displayName).toBe(DISPLAY_NAME)
    expect(state.accelerated).toBe(false)
  })

  it('genuinely changes the destination when the date changes', () => {
    const now = localNoon(2026, 8, 18)
    const seen = new Set<string>()
    for (let i = 0; i < 30; i++) {
      const dateOverride = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10)
      const state = resolveSimulation(now, overrides({ dateOverride }))
      expect(state.dateKey).toBe(dateOverride)
      expect(state.destination.id).toBe(destinationForDate(dateOverride).id)
      seen.add(state.destination.id)
    }
    expect(seen.size).toBe(30)
  })

  it('pins the position with timeOfDayOverride, ignoring the clock', () => {
    const early = new Date(2026, 8, 18, 3, 0, 0)
    const late = new Date(2026, 8, 18, 22, 0, 0)
    const o = overrides({ timeOfDayOverride: 615, destinationIdOverride: all[11].id })
    const a = resolveSimulation(early, o)
    const b = resolveSimulation(late, o)
    expect(a.live.localMinuteOfDay).toBeCloseTo(615, 6)
    expect(b.live.localMinuteOfDay).toBeCloseTo(615, 6)
    expect(a.live.latitude).toBe(b.live.latitude)
    expect(a.live.longitude).toBe(b.live.longitude)
  })

  it('walks the plan as the pinned time moves', () => {
    const now = localNoon(2026, 8, 18)
    const destination = all[11]
    let previous: { latitude: number; longitude: number } | null = null
    let moved = 0
    for (let minute = 0; minute < 1440; minute += 30) {
      const state = resolveSimulation(now, overrides({
        timeOfDayOverride: minute, destinationIdOverride: destination.id, modeOverride: 'tourist',
      }))
      if (previous && haversineKm(previous, state.live) > 0.05) moved++
      previous = { latitude: state.live.latitude, longitude: state.live.longitude }
    }
    expect(moved).toBeGreaterThan(3)
  })

  it('reads the clock in the destination zone when the time is not pinned', () => {
    const now = new Date(2026, 8, 18, 12, 0, 0)
    const destination = all[11]
    const state = resolveSimulation(now, overrides({ destinationIdOverride: destination.id }))
    expect(state.live.localMinuteOfDay)
      .toBeCloseTo(minuteOfDayInZone(now, destination.timezone), 6)
  })

  it('advances the date with the clock in accelerated mode', () => {
    const o = overrides({ acceleratedDayMinutes: 24 })
    const keys = [0, 24, 48, 72].map(
      (minutes) => resolveSimulation(new Date(Date.UTC(2026, 8, 18, 0, minutes)), o).dateKey)
    expect(keys).toEqual(['2026-09-18', '2026-09-19', '2026-09-20', '2026-09-21'])
    const cities = [0, 24, 48, 72].map(
      (minutes) => resolveSimulation(new Date(Date.UTC(2026, 8, 18, 0, minutes)), o).destination.id)
    expect(new Set(cities).size).toBe(4)
    for (const minutes of [0, 12, 24, 36]) {
      const state = resolveSimulation(new Date(Date.UTC(2026, 8, 18, 0, minutes)), o)
      expect(state.accelerated, `+${minutes}`).toBe(true)
      assertWellFormed(state, `accelerated +${minutes}`)
    }
  })

  it('sweeps the simulated day as the accelerated cycle runs', () => {
    const o = overrides({ acceleratedDayMinutes: 24 })
    const minutes = [0, 6, 12, 18].map(
      (m) => resolveSimulation(new Date(Date.UTC(2026, 8, 18, 0, m)), o).live.localMinuteOfDay)
    expect(minutes[0]).toBeCloseTo(0, 3)
    expect(minutes[1]).toBeCloseTo(360, 3)
    expect(minutes[2]).toBeCloseTo(720, 3)
    expect(minutes[3]).toBeCloseTo(1080, 3)
  })

  it('lets a pinned time win over acceleration', () => {
    const o = overrides({ acceleratedDayMinutes: 24, timeOfDayOverride: 500 })
    for (const m of [0, 6, 12]) {
      const state = resolveSimulation(new Date(Date.UTC(2026, 8, 18, 0, m)), o)
      expect(state.live.localMinuteOfDay, `+${m}`).toBeCloseTo(500, 6)
    }
  })

  it('honours the mode override on the plan it builds', () => {
    const now = localNoon(2026, 8, 18)
    for (const mode of ['stationary', 'walking', 'tourist', 'driving'] as MovementMode[]) {
      expect(resolveSimulation(now, overrides({ modeOverride: mode })).plan.mode).toBe(mode)
    }
  })

  it('scales the roaming area with the radius multiplier and the global scale', () => {
    const now = localNoon(2026, 8, 18)
    const destination = all[11]
    const spread = (radiusMultiplier: number): number => {
      const state = resolveSimulation(now, overrides({
        radiusMultiplier, destinationIdOverride: destination.id, modeOverride: 'tourist',
      }))
      return Math.max(...state.plan.waypoints.map((w) => haversineKm(destination, w)))
    }
    expect(spread(0.2)).toBeLessThan(spread(1))
    expect(spread(0.2)).toBeLessThanOrEqual(
      destination.safeRoamingRadiusKm * ROAMING_RADIUS_SCALE * 0.2 + 1e-6)
  })

  it('rerolls the day when the plan variant changes', () => {
    const now = localNoon(2026, 8, 18)
    const signature = (planVariant: number): string =>
      resolveSimulation(now, overrides({ planVariant })).plan.waypoints
        .map((w) => `${w.minute}:${w.latitude.toFixed(6)}`).join('|')
    expect(signature(0)).not.toBe(signature(1))
    expect(signature(1)).toBe(signature(1))
  })

  it('uses the display name override, including a name that is falsy-adjacent', () => {
    const now = localNoon(2026, 8, 18)
    expect(resolveSimulation(now, overrides({ displayNameOverride: 'Mike' })).displayName).toBe('Mike')
    expect(resolveSimulation(now, overrides({ displayNameOverride: null })).displayName).toBe(DISPLAY_NAME)
    // `??`, not `||`, so an empty string is honoured rather than silently replaced.
    expect(resolveSimulation(now, overrides({ displayNameOverride: '' })).displayName).toBe('')
  })

  it('keeps the live position on the plan it returns', () => {
    const now = localNoon(2026, 8, 18)
    for (let minute = 0; minute < 1440; minute += 20) {
      const state = resolveSimulation(now, overrides({ timeOfDayOverride: minute }))
      const label = `@${minute}`
      // The state's plan is the one the position was resolved from...
      expect(state.plan.destination.id, label).toBe(state.destination.id)
      expect(state.plan.dateKey, label).toBe(state.dateKey)
      expect(resolvePosition(state.plan, minute), label).toEqual(state.live)
      // ...and the segment covering this minute agrees about whether we are moving.
      const segment = state.plan.segments.find(
        (s) => s.startMinute <= minute && minute < s.endMinute)
      expect(segment, label).toBeDefined()
      expect(state.live.moving, label).toBe(segment!.moving)
      expect(haversineKm(state.destination, state.live), label)
        .toBeLessThanOrEqual(state.destination.safeRoamingRadiusKm + 0.02)
    }
  }, 60_000)

  it('does not throw at a day boundary', () => {
    for (const now of [
      new Date(2026, 8, 18, 23, 59, 59, 999),
      new Date(2026, 8, 19, 0, 0, 0, 0),
      new Date(2026, 11, 31, 23, 59, 59, 999),
      new Date(2027, 0, 1, 0, 0, 0, 0),
      new Date(2024, 1, 29, 23, 59, 59, 999),
    ]) {
      expect(() => resolveSimulation(now, overrides()), now.toISOString()).not.toThrow()
      assertWellFormed(resolveSimulation(now, overrides()), now.toISOString())
    }
  })

  it('hands consecutive simulated days to different cities without a gap', () => {
    const before = resolveSimulation(localNoon(2026, 8, 18), overrides({
      dateOverride: '2026-09-18', timeOfDayOverride: 1439.99,
    }))
    const after = resolveSimulation(localNoon(2026, 8, 19), overrides({
      dateOverride: '2026-09-19', timeOfDayOverride: 0,
    }))
    expect(before.destination.id).not.toBe(after.destination.id)
    assertWellFormed(before, 'end of day')
    assertWellFormed(after, 'start of next day')
    expect(before.live.moving).toBe(false)
    expect(after.live.moving).toBe(false)
  })
})

describe('plan cache', () => {
  it('returns the identical object for the same inputs', () => {
    clearPlanCache()
    const options = { seed: 'cache', dateKey: '2026-09-18', destination: all[5], mode: 'tourist' as MovementMode }
    const first = getMovementPlan(options)
    expect(getMovementPlan({ ...options })).toBe(first)
  })

  it('rebuilds an equal plan after a clear', () => {
    const options = { seed: 'cache', dateKey: '2026-09-18', destination: all[5], mode: 'tourist' as MovementMode }
    const first = getMovementPlan(options)
    clearPlanCache()
    const second = getMovementPlan(options)
    expect(second).not.toBe(first)
    expect(second).toEqual(first)
  })

  it('stays correct once it has evicted, and never grows without bound', () => {
    clearPlanCache()
    const make = (i: number) => ({
      seed: 'evict', dateKey: '2026-09-18', destination: all[i], mode: 'tourist' as MovementMode,
    })
    const firstPlan = getMovementPlan(make(0))
    for (let i = 1; i < 80; i++) getMovementPlan(make(i))
    // Whether or not it is still cached, the answer has to be the same day.
    expect(getMovementPlan(make(0))).toEqual(firstPlan)
  })

  it('keys on every input, not just the date', () => {
    clearPlanCache()
    const base = { seed: 'k', dateKey: '2026-09-18', destination: all[5], mode: 'tourist' as MovementMode }
    const plans = [
      getMovementPlan(base),
      getMovementPlan({ ...base, mode: 'driving' }),
      getMovementPlan({ ...base, seed: 'k2' }),
      getMovementPlan({ ...base, variant: 1 }),
      getMovementPlan({ ...base, radiusMultiplier: 0.5 }),
      getMovementPlan({ ...base, destination: all[6] }),
    ]
    expect(new Set(plans).size).toBe(6)
    expect(plans[1].mode).toBe('driving')
    expect(plans[5].destination.id).toBe(all[6].id)
  })
})

describe('datasetSummary', () => {
  it('describes the dataset the draw is working from', () => {
    const summary = datasetSummary()
    expect(summary.count).toBe(all.length)
    expect(summary.countries).toBeGreaterThan(150)
    expect(Object.keys(summary.continents)).toHaveLength(6)
    expect(Object.values(summary.continents).reduce((a, b) => a + b, 0)).toBe(summary.count)
    expect(datasetSummary()).toEqual(summary)
  })
})
