/**
 * The day's movement plan.
 *
 * A plan is generated once per (date, destination, seed, mode) and is a pure
 * function of those inputs — no timers, no server, no stored state. Given a
 * plan and a time of day it returns exactly one position, so two people
 * looking at the same second see the same dot.
 *
 * Shape of a day: wake up at the hotel, make a handful of trips with real
 * stops in between, and be home by bedtime. Legs are interpolated with
 * smoothstep easing so departures and arrivals are not abrupt, and standing
 * still gets a few metres of slow drift rather than a frozen pixel.
 *
 * Every point comes from `roamArea`, which restricts the whole day to one
 * contiguous wedge of verified-dry compass sectors around the city centre.
 */

import type {
  Destination, LiveLocation, MovementMode, MovementPlan, MovementSegment, Waypoint,
} from '@/types'
import {
  bearingBetween, clampToRoamArea, easeInOut, haversineKm, isInRoamArea, legStaysOnLand,
  lerpCoord, pointInRoamArea, project, roamArea, type Coord, type RoamArea,
} from './geoUtils'
import { createRng, hashString, type Rng } from './seededRandom'
import { MINUTES_PER_DAY } from './timeUtils'

interface Profile {
  trips: [number, number]
  /** Share of the roaming radius this profile is willing to use. */
  maxFraction: number
  /** How tightly points cluster near the centre. Higher = closer in. */
  centreBias: number
  dwellMinutes: [number, number]
  wakeMinute: [number, number]
  homeByMinute: [number, number]
  /** Walking pace, km/h. */
  walkSpeed: number
  /** Speed for legs long enough to justify a taxi, metro or car, km/h. */
  rideSpeed: number
  /** Legs longer than this switch from walking to riding, km. */
  rideThresholdKm: number
}

const PROFILES: Record<MovementMode, Profile> = {
  stationary: {
    trips: [1, 3], maxFraction: 0.45, centreBias: 2.2,
    dwellMinutes: [95, 260], wakeMinute: [520, 630], homeByMinute: [1230, 1350],
    walkSpeed: 3.8, rideSpeed: 18, rideThresholdKm: 2.5,
  },
  walking: {
    trips: [3, 6], maxFraction: 0.65, centreBias: 1.9,
    dwellMinutes: [35, 125], wakeMinute: [450, 570], homeByMinute: [1260, 1390],
    walkSpeed: 4.6, rideSpeed: 4.6, rideThresholdKm: 999,
  },
  tourist: {
    trips: [4, 8], maxFraction: 1, centreBias: 1.5,
    dwellMinutes: [40, 150], wakeMinute: [465, 585], homeByMinute: [1265, 1400],
    walkSpeed: 4.6, rideSpeed: 22, rideThresholdKm: 1.8,
  },
  driving: {
    trips: [5, 9], maxFraction: 1, centreBias: 1.25,
    dwellMinutes: [25, 95], wakeMinute: [435, 540], homeByMinute: [1270, 1400],
    walkSpeed: 4.6, rideSpeed: 30, rideThresholdKm: 0.8,
  },
}

/** Flavour text for a stop, so the timeline reads like a day rather than a log. */
const STOP_LABELS: Record<MovementMode, string[]> = {
  stationary: ['Staying put', 'At the apartment', 'Working', 'Resting', 'Reading'],
  walking: ['Wandering', 'At a café', 'In the park', 'Browsing shops', 'People-watching'],
  tourist: [
    'Sightseeing', 'At a café', 'At the museum', 'Long lunch', 'At the market',
    'Taking photos', 'By the water', 'At a viewpoint',
  ],
  driving: ['Quick stop', 'At lunch', 'Running errands', 'At a lookout', 'Filling up'],
}

const HOME_LABELS: Record<MovementMode, string> = {
  stationary: 'At the apartment',
  walking: 'At the hotel',
  tourist: 'At the hotel',
  driving: 'At the hotel',
}

export interface PlanOptions {
  seed: string
  dateKey: string
  destination: Destination
  mode: MovementMode
  /** Scales the dataset roaming radius. 1 leaves it alone. */
  radiusMultiplier?: number
  /** Bump to reroll the day without changing the date. */
  variant?: number
}

/** A stable key for everything a plan depends on. */
export function planKey(options: PlanOptions): string {
  const { seed, dateKey, destination, mode, radiusMultiplier = 1, variant = 0 } = options
  return `${seed}|${dateKey}|${destination.id}|${mode}|${radiusMultiplier}|${variant}`
}

function clampMinute(minute: number): number {
  return Math.max(0, Math.min(MINUTES_PER_DAY, minute))
}

/**
 * Bend a leg so it does not read as a ruler-straight line between two pins.
 * The waypoint is nudged sideways from the midpoint and then pulled back
 * inside the safe wedge, so the detour can never wander off the land mask.
 */
function bendPoint(from: Coord, to: Coord, area: RoamArea, rng: Rng): Coord | null {
  const distance = haversineKm(from, to)
  if (distance < 0.35) return null
  const midpoint = lerpCoord(from, to, rng.range(0.4, 0.6))
  const sidestep = distance * rng.range(0.06, 0.16) * (rng.chance(0.5) ? 1 : -1)
  const perpendicular = bearingBetween(from, to) + 90
  const bent = project(midpoint, Math.abs(sidestep), sidestep >= 0 ? perpendicular : perpendicular + 180)
  // A sidestep can push the point out of the land wedge even though both ends
  // of the leg are inside it, so the detour is dropped unless it also lands on
  // verified ground. A straight leg is always safe: the wedge is convex.
  return isInRoamArea(area, bent) ? bent : null
}

function travelMinutes(distanceKm: number, profile: Profile): { minutes: number; speed: number } {
  const speed = distanceKm >= profile.rideThresholdKm ? profile.rideSpeed : profile.walkSpeed
  const minutes = Math.max(3, Math.round((distanceKm / speed) * 60))
  return { minutes, speed }
}

/**
 * Build the day.
 *
 * Two passes. The first picks the stops and works out how long the travelling
 * between them takes; the second spreads whatever time is left across the
 * stops themselves. Doing it in that order is what keeps the legs honest —
 * laying the day out greedily from the front leaves the journey home with
 * whatever minutes happen to remain, which is how you end up with someone
 * apparently driving across town at 55 km/h.
 */
export function createMovementPlan(options: PlanOptions): MovementPlan {
  const { destination, mode, radiusMultiplier = 1 } = options
  const profile = PROFILES[mode]
  const area = roamArea(destination, radiusMultiplier)
  const rng = createRng(planKey(options))

  const home = pointInRoamArea(area, rng, 0.45, 2.1)
  const homeLabel = HOME_LABELS[mode]

  let wake = rng.int(profile.wakeMinute[0], profile.wakeMinute[1])
  let homeBy = rng.int(profile.homeByMinute[0], profile.homeByMinute[1])
  // Somewhere with a reputation gets a later night.
  if (destination.category === 'nightlife' && rng.chance(0.65)) {
    homeBy = Math.min(MINUTES_PER_DAY - 10, homeBy + rng.int(45, 95))
  }
  if (wake >= homeBy - 120) wake = Math.max(300, homeBy - 240)

  // Pass one: where we are going, and how long the moving takes.
  //
  // A stop is only accepted when the leg to it *and* the eventual leg home
  // both stay on land for their whole length — any stop may turn out to be
  // the last one of the day. Where the land wedge is convex this passes
  // first time; around a bay it quietly rejects the crossings.
  const targets: Coord[] = []
  const plannedTrips = rng.int(profile.trips[0], profile.trips[1])
  for (let i = 0; i < plannedTrips; i++) {
    const from = targets.length > 0 ? targets[targets.length - 1] : home
    let accepted: Coord | null = null
    for (let attempt = 0; attempt < 12 && !accepted; attempt++) {
      const candidate = pointInRoamArea(area, rng, profile.maxFraction, profile.centreBias)
      if (legStaysOnLand(area, from, candidate) && legStaysOnLand(area, candidate, home)) {
        accepted = candidate
      }
    }
    // Nowhere reachable without crossing water: end the day's plan here.
    if (!accepted) break
    targets.push(accepted)
  }

  const travelFor = (stops: Coord[]): number[] => {
    const route = [home, ...stops, home]
    return route.slice(0, -1).map((point, i) => travelMinutes(haversineKm(point, route[i + 1]), profile).minutes)
  }

  const MIN_DWELL = 12
  let legs = travelFor(targets)
  let travelTotal = legs.reduce((sum, m) => sum + m, 0)
  // Drop stops from the end until the day genuinely fits.
  while (targets.length > 0 && wake + travelTotal + targets.length * MIN_DWELL > homeBy) {
    targets.pop()
    legs = travelFor(targets)
    travelTotal = legs.reduce((sum, m) => sum + m, 0)
  }

  if (targets.length === 0) {
    // Nothing fitted — spend the day at home rather than emitting a stub trip.
    return finalise(options, [
      { minute: 0, ...home, dwell: true, label: homeLabel },
      { minute: MINUTES_PER_DAY, ...home, dwell: true, label: homeLabel },
    ])
  }

  // Pass two: share out the time that is not spent moving. The draws keep
  // their natural unevenness; scaling only stretches or squeezes them as a
  // group so the stops actually fill the day.
  const rawDwells = targets.map(() => rng.int(profile.dwellMinutes[0], profile.dwellMinutes[1]))
  const rawTotal = rawDwells.reduce((sum, m) => sum + m, 0)
  const available = homeBy - wake - travelTotal
  const scale = rawTotal > 0 ? Math.min(2.2, Math.max(0.35, available / rawTotal)) : 1
  const dwells = rawDwells.map((m) => Math.max(MIN_DWELL, Math.round(m * scale)))

  const waypoints: Waypoint[] = [
    { minute: 0, ...home, dwell: true, label: homeLabel },
    // Leaving is its own waypoint: same spot, but no longer parked.
    { minute: wake, ...home, dwell: false, label: 'Heading out' },
  ]

  const stopLabels = STOP_LABELS[mode]
  let cursor = wake
  let current: Coord = home

  const pushLeg = (from: Coord, to: Coord, minutes: number, label: string): void => {
    // Only bend a leg with enough minutes in it to split meaningfully, and
    // split the time where the distance actually falls rather than halfway.
    if (minutes >= 8) {
      const bend = bendPoint(from, to, area, rng)
      if (bend && legStaysOnLand(area, from, bend) && legStaysOnLand(area, bend, to)) {
        const first = haversineKm(from, bend)
        const second = haversineKm(bend, to)
        const share = first + second > 0 ? first / (first + second) : 0.5
        const at = Math.round(minutes * Math.min(0.75, Math.max(0.25, share)))
        if (at >= 1 && minutes - at >= 1) {
          waypoints.push({ minute: clampMinute(cursor + at), ...bend, dwell: false, label })
        }
      }
    }
    cursor = clampMinute(cursor + minutes)
  }

  targets.forEach((target, index) => {
    pushLeg(current, target, legs[index], 'On the move')
    const stopLabel = stopLabels[(hashString(`${options.dateKey}${index}`) + index) % stopLabels.length]
    waypoints.push({ minute: cursor, ...target, dwell: true, label: stopLabel })
    cursor = clampMinute(cursor + dwells[index])
    waypoints.push({ minute: cursor, ...target, dwell: false, label: 'On the move' })
    current = target
  })

  pushLeg(current, home, legs[legs.length - 1], 'Heading back')
  waypoints.push({ minute: cursor, ...home, dwell: true, label: homeLabel })
  waypoints.push({ minute: MINUTES_PER_DAY, ...home, dwell: true, label: homeLabel })

  return finalise(options, waypoints)
}

function finalise(options: PlanOptions, waypoints: Waypoint[]): MovementPlan {
  // Guarantee a strictly increasing timeline; downstream lookups assume it.
  const cleaned: Waypoint[] = []
  for (const wp of waypoints) {
    const previous = cleaned[cleaned.length - 1]
    if (previous && wp.minute <= previous.minute) {
      if (wp.minute < previous.minute) continue
      cleaned[cleaned.length - 1] = wp
      continue
    }
    cleaned.push(wp)
  }
  if (cleaned[cleaned.length - 1].minute < MINUTES_PER_DAY) {
    const last = cleaned[cleaned.length - 1]
    cleaned.push({ ...last, minute: MINUTES_PER_DAY, dwell: true })
  }

  const segments: MovementSegment[] = []
  for (let i = 0; i < cleaned.length - 1; i++) {
    const a = cleaned[i]
    const b = cleaned[i + 1]
    const duration = b.minute - a.minute
    const distanceKm = a.dwell ? 0 : haversineKm(a, b)
    segments.push({
      startMinute: a.minute,
      endMinute: b.minute,
      moving: !a.dwell,
      label: a.label,
      distanceKm,
      speedKmh: a.dwell || duration <= 0 ? 0 : (distanceKm / duration) * 60,
    })
  }

  return {
    destination: options.destination,
    mode: options.mode,
    dateKey: options.dateKey,
    waypoints: cleaned,
    segments,
    area: roamArea(options.destination, options.radiusMultiplier ?? 1),
  }
}

/** Index of the waypoint whose span contains `minute`. */
function segmentIndexAt(waypoints: Waypoint[], minute: number): number {
  let low = 0
  let high = waypoints.length - 2
  while (low < high) {
    const mid = (low + high + 1) >> 1
    if (waypoints[mid].minute <= minute) low = mid
    else high = mid - 1
  }
  return low
}

/**
 * A few metres of slow drift, so a stationary marker still breathes. Two
 * out-of-phase sine terms keep it continuous and non-repeating without the
 * twitchiness that real GPS noise would give.
 */
function stationaryDrift(base: Coord, minute: number, phase: number): Coord {
  const a = phase * 0.9
  const b = phase * 2.3 + 1.7
  const km = 0.004 + 0.005 * (0.5 + 0.5 * Math.sin(minute * 0.09 + a))
  const bearing = (minute * 3.1 + Math.sin(minute * 0.017 + b) * 140 + phase * 57) % 360
  return project(base, km, bearing)
}

/** Where the person is at `minuteOfDay`, plus what the status card should say. */
export function resolvePosition(plan: MovementPlan, minuteOfDay: number): LiveLocation {
  const minute = Math.max(0, Math.min(MINUTES_PER_DAY - 0.0001, minuteOfDay))
  const { waypoints } = plan
  const i = segmentIndexAt(waypoints, minute)
  const a = waypoints[i]
  const b = waypoints[Math.min(i + 1, waypoints.length - 1)]
  const phase = hashString(`${plan.dateKey}|${plan.destination.id}|${i}`) % 1000

  if (a.dwell || b.minute <= a.minute) {
    // Clamping is belt and braces: a few metres of drift at a waypoint that
    // sits right on a sector boundary could otherwise nudge it over the line.
    const drifted = clampToRoamArea(plan.area, stationaryDrift(a, minute, phase))
    return {
      ...drifted,
      heading: null,
      moving: false,
      accuracyMeters: 9 + 5 * (0.5 + 0.5 * Math.sin(minute * 0.21 + phase)),
      speedKmh: 0,
      statusLabel: 'Now',
      localMinuteOfDay: minute,
    }
  }

  const t = (minute - a.minute) / (b.minute - a.minute)
  const eased = easeInOut(t)
  const point = clampToRoamArea(plan.area, lerpCoord(a, b, eased))
  const distanceKm = haversineKm(a, b)
  const durationMin = b.minute - a.minute
  // Easing means instantaneous speed peaks in the middle of the leg. The
  // smoothstep t^2(3-2t) differentiates to 6t(1-t), which already peaks at
  // 1.5x the average — multiplying by 1.5 again reported 2.25x and made the
  // status card disagree with the marker.
  const averageSpeed = (distanceKm / durationMin) * 60
  const instantaneous = averageSpeed * 6 * t * (1 - t) || 0

  return {
    ...point,
    heading: bearingBetween(a, b),
    moving: true,
    accuracyMeters: 14 + 10 * (0.5 + 0.5 * Math.sin(minute * 0.35 + phase)),
    speedKmh: Math.max(0, instantaneous),
    statusLabel: 'Now',
    localMinuteOfDay: minute,
  }
}
