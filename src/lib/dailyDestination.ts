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
import type { Continent, Destination } from '@/types'
import { createRng, shuffle, type Rng } from './seededRandom'
import { haversineKm } from './geoUtils'
import { dateKeyToDayNumber } from './timeUtils'
import {
  DAYS_PER_DESTINATION,
  MIN_HOP_DISTANCE_KM,
  NO_REPEAT_CITY_DAYS,
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
  const requested = options?.daysPerDestination ?? DAYS_PER_DESTINATION
  return {
    seed: options?.seed?.trim() || SECRET_SEED,
    // NaN or Infinity here would propagate through the bucket division and
    // index the itinerary with NaN, handing the viewer an undefined city.
    daysPerDestination: Number.isFinite(requested) ? Math.max(1, Math.round(requested)) : 1,
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

/**
 * How many previous days the ordering pass takes into account.
 *
 * Within an epoch a city cannot repeat at all — it is a permutation. The city
 * window matters only where two epochs meet: without it, a city scheduled near
 * the end of one epoch could turn up again a few weeks later at the start of
 * the next.
 */
const LOOKBACK = Math.max(
  NO_REPEAT_CITY_DAYS,
  NO_REPEAT_COUNTRY_DAYS,
  NO_REPEAT_CONTINENT_DAYS,
  1,
)

/**
 * The soft rules, checked against the tail of what has already been scheduled.
 * The continent rule is not in here — that one is guaranteed structurally by
 * the scheduler below rather than tested and hoped for.
 */
function conflicts(candidate: Destination, recent: Destination[]): boolean {
  for (let back = 1; back <= recent.length; back++) {
    const previous = recent[recent.length - back]
    if (back <= NO_REPEAT_CITY_DAYS && previous.id === candidate.id) return true
    if (back <= NO_REPEAT_COUNTRY_DAYS && previous.countryCode === candidate.countryCode) return true
    if (back === 1 && haversineKm(previous, candidate) < MIN_HOP_DISTANCE_KM) return true
  }
  return false
}

/**
 * Turn a shuffled epoch into a running order.
 *
 * The continent rule used to be enforced the obvious way — walk the shuffle
 * and skip anything that clashes with the last few days. That works fine in
 * the middle of an epoch and falls apart at the end of it: by the last dozen
 * days the remaining pool is whatever nobody wanted, frequently all from the
 * same continent, and the rule quietly breaks.
 *
 * So the continent is chosen first, and the city second.
 *
 * Always taking the continent with the most days left is the textbook greedy
 * for spacing repeated items out, and it is safe, but it is also rigid: with
 * stable proportions it settles into a visible rotation, and a viewer starts
 * to notice that Europe comes round every fifth day. So the continent is
 * drawn at random instead, weighted by how many days it has left — with one
 * hard override. Any continent holding more than half of everything still
 * unscheduled must be placed immediately, because from that point on there
 * are not enough other days left to keep it apart from itself. That single
 * rule is what makes "never the same continent twice running" a guarantee
 * rather than a hope; the randomness only ever chooses between options that
 * are all already safe.
 *
 * Country spacing and the minimum hop stay best-effort: they are checked when
 * choosing which city to take from the winning continent's queue.
 */
function scheduleEpoch(
  order: number[],
  context: number[],
  all: readonly Destination[],
  rng: Rng,
): number[] {
  const queues = new Map<Continent, number[]>()
  for (const index of order) {
    const continent = all[index].continent
    const queue = queues.get(continent)
    if (queue) queue.push(index)
    else queues.set(continent, [index])
  }

  const result: number[] = new Array(order.length)
  const recent: Destination[] = context.map((i) => all[i])
  let previousContinent: Continent | null =
    recent.length > 0 ? recent[recent.length - 1].continent : null
  let remaining = order.length

  for (let i = 0; i < order.length; i++) {
    // Sorted by name, never by Map iteration order, so the result is stable.
    const available = [...queues.entries()]
      .filter(([, queue]) => queue.length > 0)
      .sort((a, b) => a[0].localeCompare(b[0]))

    const eligible = available.filter(([continent]) => continent !== previousContinent)
    // Holding more than half the remaining days means it can no longer be
    // kept apart from itself unless it goes now.
    const forced = eligible.find(([, queue]) => queue.length * 2 > remaining)

    let chosen: [Continent, number[]]
    if (forced) {
      chosen = forced
    } else if (eligible.length > 0) {
      const total = eligible.reduce((sum, [, queue]) => sum + queue.length, 0)
      let ticket = rng.next() * total
      chosen = eligible[eligible.length - 1]
      for (const entry of eligible) {
        ticket -= entry[1].length
        if (ticket <= 0) {
          chosen = entry
          break
        }
      }
    } else {
      // Only the previous continent is left, which the forced rule above
      // makes unreachable except on the very last day of an epoch.
      chosen = available[0]
    }
    const queue = chosen[1]

    // Within that continent, take the first city that also clears the country
    // and hop rules; if none does, take the head rather than stall.
    let pick = 0
    for (let k = 0; k < queue.length; k++) {
      if (!conflicts(all[queue[k]], recent)) {
        pick = k
        break
      }
    }
    const index = queue[pick]
    queue.splice(pick, 1)

    result[i] = index
    recent.push(all[index])
    if (recent.length > LOOKBACK) recent.shift()
    previousContinent = all[index].continent
    remaining--
  }

  return result
}

/**
 * How many epochs back the seam is resolved exactly.
 *
 * Scheduling epoch N correctly needs the real last few days of epoch N-1, and
 * those need epoch N-2, and so on back to the beginning of time. Two levels
 * covers any date a person will actually look at — epochs are three and a half
 * years apart — and beyond that the unscheduled shuffle stands in, which can
 * only ever affect the single day where two epochs meet.
 */
const SEAM_DEPTH = 2

function epochOrder(seed: string, epoch: number, depth = SEAM_DEPTH): number[] {
  const key = `${seed}#${epoch}#${depth}`
  const cached = repairedOrderCache.get(key)
  if (cached) return cached

  const all = getDestinations()
  const previous =
    depth > 0
      ? epochOrder(seed, epoch - 1, depth - 1)
      : rawOrder(seed, epoch - 1, all.length)
  const context = previous.slice(Math.max(0, previous.length - LOOKBACK))
  const order = scheduleEpoch(
    rawOrder(seed, epoch, all.length),
    context,
    all,
    createRng(`${seed}|schedule|${epoch}`),
  )

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
