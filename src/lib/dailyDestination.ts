/**
 * The daily destination draw.
 *
 * The itinerary is a permutation, not a series of independent rolls. Time is
 * cut into epochs of exactly one-destination-each; within an epoch the whole
 * dataset is shuffled with a seeded generator, so every city is visited once
 * before any city is visited twice. With 1,300-odd destinations that is more
 * than three years before the first repeat, which makes "never the same city
 * two days running" structural rather than something we have to police.
 *
 * A repair pass then walks the shuffled order and pushes entries back when
 * they would put two neighbouring days in the same country, on the same
 * continent, or within a short hop of each other.
 *
 * Everything is a pure function of (date, seed), so two viewers anywhere in
 * the world resolve the same city for the same date with no server involved.
 */

import { getDestinations } from '@/data/destinations'
import type { Destination } from '@/types'
import { createRng, shuffle } from './seededRandom'
import { haversineKm } from './geoUtils'
import { dateKeyToDayNumber } from './timeUtils'
import {
  DAYS_PER_DESTINATION,
  MIN_HOP_DISTANCE_KM,
  NO_REPEAT_CONTINENT_DAYS,
  NO_REPEAT_COUNTRY_DAYS,
  SECRET_SEED,
} from '@/config'

export interface ItineraryOptions {
  seed?: string
  daysPerDestination?: number
}

interface ResolvedOptions {
  seed: string
  daysPerDestination: number
}

function resolveOptions(options?: ItineraryOptions): ResolvedOptions {
  return {
    seed: options?.seed?.trim() || SECRET_SEED,
    daysPerDestination: Math.max(1, Math.round(options?.daysPerDestination ?? DAYS_PER_DESTINATION)),
  }
}

/** Floor division that behaves for dates before 1970. */
function floorDiv(a: number, b: number): number {
  return Math.floor(a / b)
}

function positiveMod(a: number, b: number): number {
  return ((a % b) + b) % b
}

/** Which slot of the itinerary a calendar date falls in. */
export function bucketForDateKey(dateKey: string, options?: ItineraryOptions): number {
  const { daysPerDestination } = resolveOptions(options)
  return floorDiv(dateKeyToDayNumber(dateKey), daysPerDestination)
}

const rawOrderCache = new Map<string, number[]>()
const repairedOrderCache = new Map<string, number[]>()

function rawOrder(seed: string, epoch: number, size: number): number[] {
  const key = `${seed}#${epoch}`
  const cached = rawOrderCache.get(key)
  if (cached) return cached
  const indices = Array.from({ length: size }, (_, i) => i)
  const order = shuffle(indices, createRng(`${seed}|epoch|${epoch}`))
  rawOrderCache.set(key, order)
  return order
}

/** How many previous days the repair pass takes into account. */
const LOOKBACK = Math.max(NO_REPEAT_COUNTRY_DAYS, NO_REPEAT_CONTINENT_DAYS, 1)

function conflicts(
  candidate: Destination,
  recent: Destination[],
): boolean {
  for (let back = 1; back <= recent.length; back++) {
    const previous = recent[recent.length - back]
    if (previous.id === candidate.id) return true
    if (back <= NO_REPEAT_COUNTRY_DAYS && previous.countryCode === candidate.countryCode) return true
    if (back <= NO_REPEAT_CONTINENT_DAYS && previous.continent === candidate.continent) return true
    if (back === 1 && haversineKm(previous, candidate) < MIN_HOP_DISTANCE_KM) return true
  }
  return false
}

/**
 * Reorder a shuffled epoch so neighbouring days are properly far apart.
 *
 * The context is seeded from the *unrepaired* tail of the previous epoch.
 * Chaining repaired epochs would mean recursing back to the beginning of
 * time; the approximation only affects the single day where one epoch meets
 * the next, roughly once every three and a half years.
 */
function repairOrder(order: number[], context: number[], all: readonly Destination[]): number[] {
  const pool = order.slice()
  const result: number[] = new Array(order.length)
  const recent: Destination[] = context.map((i) => all[i])

  for (let i = 0; i < order.length; i++) {
    let chosen = 0
    for (let k = 0; k < pool.length; k++) {
      if (!conflicts(all[pool[k]], recent)) {
        chosen = k
        break
      }
    }
    const picked = pool[chosen]
    pool.splice(chosen, 1)
    result[i] = picked
    recent.push(all[picked])
    if (recent.length > LOOKBACK) recent.shift()
  }
  return result
}

function epochOrder(seed: string, epoch: number): number[] {
  const key = `${seed}#${epoch}`
  const cached = repairedOrderCache.get(key)
  if (cached) return cached
  const all = getDestinations()
  const previous = rawOrder(seed, epoch - 1, all.length)
  const context = previous.slice(Math.max(0, previous.length - LOOKBACK))
  const order = repairOrder(rawOrder(seed, epoch, all.length), context, all)
  repairedOrderCache.set(key, order)
  return order
}

/** The destination for one itinerary slot. */
export function destinationForBucket(bucket: number, options?: ItineraryOptions): Destination {
  const { seed } = resolveOptions(options)
  const all = getDestinations()
  const epoch = floorDiv(bucket, all.length)
  const position = positiveMod(bucket, all.length)
  return all[epochOrder(seed, epoch)[position]]
}

/** The destination for a `YYYY-MM-DD` calendar date. */
export function destinationForDate(dateKey: string, options?: ItineraryOptions): Destination {
  return destinationForBucket(bucketForDateKey(dateKey, options), options)
}

/** A run of consecutive days, for the control panel's itinerary preview. */
export function itineraryFrom(
  startDateKey: string,
  count: number,
  options?: ItineraryOptions,
): Array<{ dateKey: string; destination: Destination }> {
  const startDay = dateKeyToDayNumber(startDateKey)
  return Array.from({ length: Math.max(0, count) }, (_, offset) => {
    const dateKey = new Date((startDay + offset) * 86_400_000).toISOString().slice(0, 10)
    return { dateKey, destination: destinationForDate(dateKey, options) }
  })
}

/** Drops memoised orders. Used when the control panel changes the seed. */
export function clearItineraryCache(): void {
  rawOrderCache.clear()
  repairedOrderCache.clear()
}
