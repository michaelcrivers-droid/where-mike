/**
 * The daily destination draw.
 *
 * Two properties matter to the joke: everyone on earth sees the same city on
 * a given day (determinism), and the itinerary reads like a globe-trotter's
 * rather than a random walk around one region (variety). Everything here
 * asserts against the real config constants, so tightening a rule in
 * `@/config` tightens these tests with it.
 *
 * Structure worth knowing: the itinerary is a permutation of the whole
 * dataset per "epoch" of DESTINATION_COUNT slots, repaired afterwards so
 * neighbouring days are far apart. Epoch boundaries are therefore the
 * interesting seam, and they are tested explicitly.
 */

import { describe, expect, it } from 'vitest'
import {
  bucketForDateKey, clearItineraryCache, destinationForBucket, destinationForDate, itineraryFrom,
} from '@/lib/dailyDestination'
import { getDestinations } from '@/data/destinations'
import { haversineKm } from '@/lib/geoUtils'
import { addDays, dateKeyToDayNumber, dayNumberToDateKey } from '@/lib/timeUtils'
import {
  DAYS_PER_DESTINATION, MIN_HOP_DISTANCE_KM, NO_REPEAT_CITY_DAYS, NO_REPEAT_CONTINENT_DAYS,
  NO_REPEAT_COUNTRY_DAYS, SECRET_SEED,
} from '@/config'
import type { Destination } from '@/types'

const SIZE = getDestinations().length

/** A window of consecutive days, well clear of an epoch seam. */
const HEALTHY_START = '2026-01-01'
const HEALTHY_DAYS = 450

const runOfDays = (start: string, count: number, seed?: string): Destination[] => {
  const out: Destination[] = []
  let key = start
  for (let i = 0; i < count; i++) {
    out.push(destinationForDate(key, seed ? { seed } : undefined))
    key = addDays(key, 1)
  }
  return out
}

describe('determinism', () => {
  it('gives the same city for the same date every time it is asked', () => {
    for (const key of ['2026-09-18', '2026-09-19', '2030-01-01', '1999-12-31', '1970-01-01']) {
      const first = destinationForDate(key)
      expect(destinationForDate(key).id, key).toBe(first.id)
      expect(destinationForDate(key), key).toBe(first)
    }
  })

  it('survives a cache clear', () => {
    const before = runOfDays('2026-09-18', 40).map((d) => d.id)
    clearItineraryCache()
    expect(runOfDays('2026-09-18', 40).map((d) => d.id)).toEqual(before)
  })

  it('does not depend on the order the dates are asked for', () => {
    clearItineraryCache()
    const forwards = runOfDays('2026-05-01', 30).map((d) => d.id)
    clearItineraryCache()
    const keys = Array.from({ length: 30 }, (_, i) => addDays('2026-05-01', i))
    const backwards = keys.slice().reverse().map((k) => destinationForDate(k).id).reverse()
    expect(backwards).toEqual(forwards)
  })

  it('agrees between destinationForDate and destinationForBucket', () => {
    for (let i = 0; i < 60; i++) {
      const key = addDays('2026-09-18', i * 13)
      expect(destinationForDate(key).id, key).toBe(destinationForBucket(bucketForDateKey(key)).id)
    }
  })

  it('treats an empty or whitespace seed as the build-time seed', () => {
    const key = '2026-09-18'
    const baseline = destinationForDate(key).id
    expect(destinationForDate(key, { seed: '' }).id).toBe(baseline)
    expect(destinationForDate(key, { seed: '   ' }).id).toBe(baseline)
    expect(destinationForDate(key, { seed: SECRET_SEED }).id).toBe(baseline)
    // A seed is trimmed, so padding must not change the answer.
    expect(destinationForDate(key, { seed: `  ${SECRET_SEED}  ` }).id).toBe(baseline)
  })

  it('returns a fully-formed destination for far-flung dates', () => {
    for (const key of ['1900-01-01', '1970-01-01', '2099-12-31', '9999-12-31']) {
      const d = destinationForDate(key)
      expect(d, key).toBeDefined()
      expect(d.id, key).toBeTruthy()
      expect(Number.isFinite(d.latitude), key).toBe(true)
    }
  })
})

describe('bucketing', () => {
  it('is the day number divided by the configured rate', () => {
    expect(DAYS_PER_DESTINATION).toBeGreaterThanOrEqual(1)
    let previous = bucketForDateKey('2026-01-01')
    for (let i = 0; i < 40; i++) {
      const key = addDays('2026-01-01', i)
      const bucket = bucketForDateKey(key)
      expect(bucket, key).toBe(Math.floor(dateKeyToDayNumber(key) / DAYS_PER_DESTINATION))
      expect(bucket, key).toBeGreaterThanOrEqual(previous)
      previous = bucket
    }
  })

  it('holds a bucket for exactly daysPerDestination days', () => {
    for (const days of [1, 2, 3, 7, 30]) {
      const buckets = Array.from({ length: days * 3 }, (_, i) =>
        bucketForDateKey(addDays('2026-01-01', i), { daysPerDestination: days }))
      const counts = new Map<number, number>()
      for (const b of buckets) counts.set(b, (counts.get(b) ?? 0) + 1)
      // Only the first and last buckets in the window may be partial.
      const full = [...counts.values()].filter((n) => n === days)
      expect(full.length, `days=${days}`).toBeGreaterThanOrEqual(2)
      for (const n of counts.values()) expect(n, `days=${days}`).toBeLessThanOrEqual(days)
    }
  })

  it('keeps the destination fixed while the bucket is', () => {
    const ids = Array.from({ length: 7 }, (_, i) =>
      destinationForDate(addDays('2026-01-08', i), { daysPerDestination: 7 }).id)
    // 2026-01-08 starts a fresh 7-day bucket (day number 20461, 20461 / 7 = 2923).
    expect(dateKeyToDayNumber('2026-01-08') % 7).toBe(0)
    expect(new Set(ids).size).toBe(1)
    expect(destinationForDate('2026-01-15', { daysPerDestination: 7 }).id).not.toBe(ids[0])
  })

  it('coerces a nonsense daysPerDestination to at least one', () => {
    const key = '2026-09-18'
    const baseline = destinationForDate(key).id
    for (const days of [0, -5, 0.4]) {
      expect(bucketForDateKey(key, { daysPerDestination: days }), `days=${days}`)
        .toBe(bucketForDateKey(key, { daysPerDestination: 1 }))
    }
    expect(destinationForDate(key, { daysPerDestination: 1 }).id).toBe(baseline)
    expect(destinationForDate(key, { daysPerDestination: undefined }).id).toBe(baseline)
    // Rounding, not truncation.
    expect(bucketForDateKey(key, { daysPerDestination: 2.6 }))
      .toBe(bucketForDateKey(key, { daysPerDestination: 3 }))
    expect(bucketForDateKey(key, { daysPerDestination: 2.4 }))
      .toBe(bucketForDateKey(key, { daysPerDestination: 2 }))
  })

  it('handles pre-epoch dates with floor division, not truncation', () => {
    // Truncating towards zero would make two different days share a bucket
    // either side of 1970.
    const buckets = Array.from({ length: 12 }, (_, i) =>
      bucketForDateKey(addDays('1969-12-26', i), { daysPerDestination: 3 }))
    for (let i = 1; i < buckets.length; i++) {
      expect(buckets[i] - buckets[i - 1], `i=${i}`).toBeGreaterThanOrEqual(0)
      expect(buckets[i] - buckets[i - 1], `i=${i}`).toBeLessThanOrEqual(1)
    }
    expect(new Set(buckets).size).toBe(4)
  })
})

describe('the epoch is a permutation', () => {
  it('visits every destination exactly once before repeating any', () => {
    const epoch = Math.floor(bucketForDateKey('2026-09-18') / SIZE)
    const ids = Array.from({ length: SIZE }, (_, p) => destinationForBucket(epoch * SIZE + p).id)
    expect(new Set(ids).size).toBe(SIZE)
    expect([...new Set(ids)].sort()).toEqual(getDestinations().map((d) => d.id).slice().sort())
  }, 60_000)

  it('reshuffles for the next epoch', () => {
    const epoch = Math.floor(bucketForDateKey('2026-09-18') / SIZE)
    const a = Array.from({ length: 200 }, (_, p) => destinationForBucket(epoch * SIZE + p).id)
    const b = Array.from({ length: 200 }, (_, p) => destinationForBucket((epoch + 1) * SIZE + p).id)
    expect(a).not.toEqual(b)
    expect(a.filter((id, i) => id === b[i]).length).toBeLessThan(5)
  })
})

describe('variety over a long run', () => {
  const run = runOfDays(HEALTHY_START, HEALTHY_DAYS)

  it(`never repeats a city within ${NO_REPEAT_CITY_DAYS} days`, () => {
    const offenders: string[] = []
    for (let i = 0; i < run.length; i++) {
      for (let back = 1; back <= Math.min(i, NO_REPEAT_CITY_DAYS); back++) {
        if (run[i - back].id === run[i].id) {
          offenders.push(`${addDays(HEALTHY_START, i)} repeats ${run[i].id} from ${back} days earlier`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it('never puts the same city on two consecutive days', () => {
    const offenders = run
      .map((d, i) => (i > 0 && d.id === run[i - 1].id ? addDays(HEALTHY_START, i) : null))
      .filter(Boolean)
    expect(offenders).toEqual([])
  })

  it(`never repeats a continent within ${NO_REPEAT_CONTINENT_DAYS} days`, () => {
    const offenders: string[] = []
    for (let i = 0; i < run.length; i++) {
      for (let back = 1; back <= Math.min(i, NO_REPEAT_CONTINENT_DAYS); back++) {
        if (run[i - back].continent === run[i].continent) {
          offenders.push(`${addDays(HEALTHY_START, i)} ${run[i].continent} (back ${back}: ${run[i - back].id} -> ${run[i].id})`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it(`never repeats a country within ${NO_REPEAT_COUNTRY_DAYS} days`, () => {
    const offenders: string[] = []
    for (let i = 0; i < run.length; i++) {
      for (let back = 1; back <= Math.min(i, NO_REPEAT_COUNTRY_DAYS); back++) {
        if (run[i - back].countryCode === run[i].countryCode) {
          offenders.push(`${addDays(HEALTHY_START, i)} ${run[i].countryCode} (back ${back})`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it(`hops at least ${MIN_HOP_DISTANCE_KM} km every night`, () => {
    const offenders: string[] = []
    let shortest = Infinity
    for (let i = 1; i < run.length; i++) {
      const hop = haversineKm(run[i - 1], run[i])
      shortest = Math.min(shortest, hop)
      if (hop < MIN_HOP_DISTANCE_KM) {
        offenders.push(`${addDays(HEALTHY_START, i)} ${run[i - 1].id} -> ${run[i].id} = ${hop.toFixed(0)} km`)
      }
    }
    expect(offenders).toEqual([])
    expect(shortest).toBeGreaterThanOrEqual(MIN_HOP_DISTANCE_KM)
  })

  it('covers all six continents and a wide spread of countries', () => {
    expect(new Set(run.map((d) => d.continent)).size).toBe(6)
    expect(new Set(run.map((d) => d.countryCode)).size).toBeGreaterThan(100)
    expect(new Set(run.map((d) => d.id)).size).toBe(run.length)
  })

  it('does not lean on any one continent or country', () => {
    const share = (values: string[]): number => {
      const counts = new Map<string, number>()
      for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
      return Math.max(...counts.values()) / values.length
    }
    expect(share(run.map((d) => d.continent))).toBeLessThan(0.45)
    expect(share(run.map((d) => d.countryCode))).toBeLessThan(0.1)
  })

  it('visits a good mix of categories, not just capitals', () => {
    expect(new Set(run.map((d) => d.category)).size).toBeGreaterThanOrEqual(6)
  })
})

describe('seed sensitivity', () => {
  it('produces a substantially different itinerary for a different seed', () => {
    const days = 300
    const base = runOfDays('2026-01-01', days)
    const other = runOfDays('2026-01-01', days, 'a-completely-different-secret')
    const differing = base.filter((d, i) => d.id !== other[i].id).length
    // Collisions are legitimate — two independent permutations of 1,319 items
    // will agree on about one day in 1,319 — so this is a high bar, not 100%.
    expect(differing / days).toBeGreaterThan(0.97)
  })

  it('separates seeds that differ by a single character', () => {
    const days = 200
    const a = runOfDays('2026-01-01', days, 'wheremike-v1-8f3a92')
    const b = runOfDays('2026-01-01', days, 'wheremike-v1-8f3a93')
    expect(a.filter((d, i) => d.id !== b[i].id).length / days).toBeGreaterThan(0.97)
  })

  it('is stable for one seed across repeated evaluation', () => {
    const a = runOfDays('2026-01-01', 60, 'stable-seed').map((d) => d.id)
    clearItineraryCache()
    const b = runOfDays('2026-01-01', 60, 'stable-seed').map((d) => d.id)
    expect(a).toEqual(b)
  })
})

describe('daily transition', () => {
  it('changes city from D to D+1 across a long stretch', () => {
    let key = '2026-06-01'
    for (let i = 0; i < 200; i++) {
      const next = addDays(key, 1)
      expect(destinationForDate(key).id, `${key} -> ${next}`).not.toBe(destinationForDate(next).id)
      key = next
    }
  })

  it('changes city across month, year and leap boundaries', () => {
    for (const key of ['2026-01-31', '2026-12-31', '2024-02-28', '2024-02-29', '2027-02-28']) {
      expect(destinationForDate(key).id, key).not.toBe(destinationForDate(addDays(key, 1)).id)
    }
  })
})

describe('itineraryFrom', () => {
  it('returns consecutive days that match the single-date lookup', () => {
    const rows = itineraryFrom('2026-09-18', 30)
    expect(rows).toHaveLength(30)
    rows.forEach((row, i) => {
      expect(row.dateKey).toBe(addDays('2026-09-18', i))
      expect(row.destination.id).toBe(destinationForDate(row.dateKey).id)
    })
  })

  it('handles zero, negative and pre-epoch starts', () => {
    expect(itineraryFrom('2026-09-18', 0)).toEqual([])
    expect(itineraryFrom('2026-09-18', -5)).toEqual([])
    const old = itineraryFrom('1969-12-30', 5)
    expect(old.map((r) => r.dateKey)).toEqual([
      '1969-12-30', '1969-12-31', '1970-01-01', '1970-01-02', '1970-01-03',
    ])
  })

  it('honours the seed option', () => {
    const a = itineraryFrom('2026-09-18', 20, { seed: 'one' }).map((r) => r.destination.id)
    const b = itineraryFrom('2026-09-18', 20, { seed: 'two' }).map((r) => r.destination.id)
    expect(a).not.toEqual(b)
  })
})

/*
 * ---------------------------------------------------------------------------
 * KNOWN BUG — see the report. Left failing on purpose.
 *
 * `repairOrder` in src/lib/dailyDestination.ts walks the shuffled epoch
 * greedily and takes the first candidate that does not conflict, with
 * `chosen = 0` as the fallback when every remaining candidate does. By the end
 * of an epoch the pool is nearly empty, so the fallback fires repeatedly and
 * the continent-spacing rule collapses for roughly the last week of every
 * 1,319-day epoch.
 *
 * The test below is written against the behaviour the product promises, not
 * the behaviour it currently has, so it fails until the draw is fixed.
 * ---------------------------------------------------------------------------
 */
describe('KNOWN BUG: draw defects', () => {
  const epochOf = (key: string): number => Math.floor(bucketForDateKey(key) / SIZE)
  const firstDayOfEpochTail = dayNumberToDateKey(
    (epochOf('2026-09-18') + 1) * SIZE * DAYS_PER_DESTINATION - 12)

  it('[KNOWN BUG] no two consecutive days share a continent, including at an epoch seam', () => {
    const run = runOfDays(firstDayOfEpochTail, 12)
    const offenders = run
      .map((d, i) =>
        i > 0 && d.continent === run[i - 1].continent
          ? `${addDays(firstDayOfEpochTail, i)}: ${run[i - 1].id} -> ${d.id} (both ${d.continent})`
          : null)
      .filter(Boolean)
    expect(offenders, `tail starts ${firstDayOfEpochTail}`).toEqual([])
  })

  it('[KNOWN BUG] a non-finite daysPerDestination clamps to 1 instead of returning undefined', () => {
    // `Math.max(1, Math.round(options?.daysPerDestination ?? DAYS_PER_DESTINATION))`
    // in resolveOptions looks like it sanitises, but `??` does not catch NaN:
    // Math.round(NaN) is NaN, Math.max(1, NaN) is NaN, the bucket is NaN, and
    // the epoch order is indexed at NaN. The declared return type is
    // `Destination`, but what comes back is undefined, so the first property
    // access downstream throws with no useful stack.
    const result = destinationForDate('2026-09-18', { daysPerDestination: NaN })
    expect(result, 'destinationForDate must never return undefined').toBeDefined()
    expect(bucketForDateKey('2026-09-18', { daysPerDestination: NaN }))
      .toBe(bucketForDateKey('2026-09-18', { daysPerDestination: 1 }))
  })

  it('[KNOWN BUG] the continent rule holds across the whole epoch, not just the healthy middle', () => {
    const epoch = epochOf('2026-09-18')
    const sequence = Array.from({ length: SIZE }, (_, p) => destinationForBucket(epoch * SIZE + p))
    const offenders: string[] = []
    for (let i = 0; i < sequence.length; i++) {
      for (let back = 1; back <= Math.min(i, NO_REPEAT_CONTINENT_DAYS); back++) {
        if (sequence[i - back].continent === sequence[i].continent) {
          offenders.push(`slot ${i} (back ${back}): ${sequence[i - back].id} -> ${sequence[i].id} both ${sequence[i].continent}`)
        }
      }
    }
    expect(offenders).toEqual([])
  }, 60_000)
})
