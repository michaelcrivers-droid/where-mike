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
  bearingBetween, easeInOut, haversineKm, lerpCoord, pointInRoamArea, project, roamArea,
  type Coord, type RoamArea,
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
  // Only keep the detour when it stays comfortably inside the safe area.
  return haversineKm(area.centre, bent) <= area.radiusKm ? bent : null
}

function travelMinutes(distanceKm: number, profile: Profile): { minutes: number; speed: number } {
  const speed = distanceKm >= profile.rideThresholdKm ? profile.rideSpeed : profile.walkSpeed
  const minutes = Math.max(3, Math.round((distanceKm / speed) * 60))
  return { minutes, speed }
}

/** Build the day. */
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

  const waypoints: Waypoint[] = [
    { minute: 0, ...home, dwell: true, label: homeLabel },
  ]

  const tripCount = rng.int(profile.trips[0], profile.trips[1])
  const stopLabels = STOP_LABELS[mode]
  let cursor = wake
  let current: Coord = home
  let stops = 0

  // Leaving the hotel is itself a waypoint: same spot, but no longer parked.
  waypoints.push({ minute: cursor, ...home, dwell: false, label: 'Heading out' })

  for (let trip = 0; trip < tripCount; trip++) {
    const target = pointInRoamArea(area, rng, profile.maxFraction, profile.centreBias)
    const leg = haversineKm(current, target)
    const { minutes } = travelMinutes(leg, profile)

    // Reserve enough time to get home afterwards.
    const returnLeg = travelMinutes(haversineKm(target, home), profile).minutes
    if (cursor + minutes + returnLeg + 20 > homeBy) break

    const bend = bendPoint(current, target, area, rng)
    if (bend) {
      waypoints.push({
        minute: clampMinute(cursor + Math.round(minutes * 0.5)),
        ...bend,
        dwell: false,
        label: 'On the move',
      })
    }

    cursor = clampMinute(cursor + minutes)
    const stopLabel = stopLabels[(hashString(`${options.dateKey}${trip}`) + trip) % stopLabels.length]
    waypoints.push({ minute: cursor, ...target, dwell: true, label: stopLabel })

    const maxDwell = Math.max(15, homeBy - cursor - returnLeg - 10)
    const dwell = Math.min(maxDwell, rng.int(profile.dwellMinutes[0], profile.dwellMinutes[1]))
    cursor = clampMinute(cursor + dwell)
    waypoints.push({ minute: cursor, ...target, dwell: false, label: 'On the move' })

    current = target
    stops++
    if (cursor + returnLeg + 15 > homeBy) break
  }

  if (stops === 0) {
    // Nothing fitted — spend the day at home rather than emitting a stub trip.
    waypoints.length = 1
    waypoints.push({ minute: MINUTES_PER_DAY, ...home, dwell: true, label: homeLabel })
    return finalise(options, waypoints)
  }

  const backHome = travelMinutes(haversineKm(current, home), profile).minutes
  const arriveHome = clampMinute(Math.max(cursor + backHome, Math.min(homeBy, MINUTES_PER_DAY - 5)))
  const homeBend = bendPoint(current, home, area, rng)
  if (homeBend) {
    waypoints.push({
      minute: clampMinute(cursor + Math.round((arriveHome - cursor) * 0.5)),
      ...homeBend,
      dwell: false,
      label: 'Heading back',
    })
  }
  waypoints.push({ minute: arriveHome, ...home, dwell: true, label: homeLabel })
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
    const drifted = stationaryDrift(a, minute, phase)
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
  const point = lerpCoord(a, b, eased)
  const distanceKm = haversineKm(a, b)
  const durationMin = b.minute - a.minute
  // Easing means instantaneous speed peaks in the middle of the leg.
  const averageSpeed = (distanceKm / durationMin) * 60
  const instantaneous = averageSpeed * (1.5 * 6 * t * (1 - t)) || 0

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
