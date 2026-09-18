/**
 * Turns "what time is it, and what has this browser overridden" into the
 * single object the viewer renders. Deliberately free of React so it can be
 * tested directly.
 */

import type { ControlOverrides, Destination, MovementPlan, ViewerState } from '@/types'
import { getDestinationById, getDestinations } from '@/data/destinations'
import { destinationForDate } from './dailyDestination'
import { createMovementPlan, planKey, resolvePosition, type PlanOptions } from './movementEngine'
import {
  dateKeyToDayNumber, dayNumberToDateKey, localDateKey, minuteOfDayInZone, utcDateKey,
} from './timeUtils'
import {
  DAY_BOUNDARY, DAYS_PER_DESTINATION, DEFAULT_MOVEMENT_MODE, DISPLAY_NAME,
  ROAMING_RADIUS_SCALE, SECRET_SEED,
} from '@/config'

/** Which calendar day the app is showing, and where we are inside it. */
export interface ResolvedDay {
  dateKey: string
  /** 0–1 through the simulated day; only set while accelerated. */
  dayFraction: number | null
  accelerated: boolean
}

export function resolveDay(now: Date, overrides: ControlOverrides): ResolvedDay {
  if (overrides.dateOverride) {
    return { dateKey: overrides.dateOverride, dayFraction: null, accelerated: false }
  }

  const cycleMinutes = overrides.acceleratedDayMinutes
  if (cycleMinutes > 0) {
    // Anchor on the start of the real UTC day so the sequence begins at
    // today's date and marches forward visibly rather than starting in the
    // year 80,000.
    const anchorMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    const cycleMs = cycleMinutes * 60_000
    const elapsed = now.getTime() - anchorMs
    const cycles = Math.floor(elapsed / cycleMs)
    const fraction = (elapsed - cycles * cycleMs) / cycleMs
    return {
      dateKey: dayNumberToDateKey(dateKeyToDayNumber(utcDateKey(now)) + cycles),
      dayFraction: Math.min(0.999999, Math.max(0, fraction)),
      accelerated: true,
    }
  }

  return {
    dateKey: DAY_BOUNDARY === 'utc' ? utcDateKey(now) : localDateKey(now),
    dayFraction: null,
    accelerated: false,
  }
}

export function resolveSeed(overrides: ControlOverrides): string {
  return overrides.seedOverride?.trim() || SECRET_SEED
}

export function resolveDestination(dateKey: string, overrides: ControlOverrides): Destination {
  if (overrides.destinationIdOverride) {
    const forced = getDestinationById(overrides.destinationIdOverride)
    if (forced) return forced
  }
  return destinationForDate(dateKey, {
    seed: resolveSeed(overrides),
    daysPerDestination: DAYS_PER_DESTINATION,
  })
}

// Plans are pure functions of their key, and rebuilding one on every tick
// would be pointless work. A handful of entries covers today, the control
// panel's preview and whatever the user is scrubbing through.
const planCache = new Map<string, MovementPlan>()
const PLAN_CACHE_LIMIT = 24

export function getMovementPlan(options: PlanOptions): MovementPlan {
  const key = planKey(options)
  const cached = planCache.get(key)
  if (cached) return cached
  const plan = createMovementPlan(options)
  if (planCache.size >= PLAN_CACHE_LIMIT) {
    const oldest = planCache.keys().next().value
    if (oldest !== undefined) planCache.delete(oldest)
  }
  planCache.set(key, plan)
  return plan
}

export function clearPlanCache(): void {
  planCache.clear()
}

/** The whole viewer state for one instant. */
export function resolveSimulation(now: Date, overrides: ControlOverrides): ViewerState {
  const day = resolveDay(now, overrides)
  const destination = resolveDestination(day.dateKey, overrides)
  const mode = overrides.modeOverride ?? DEFAULT_MOVEMENT_MODE

  const plan = getMovementPlan({
    seed: resolveSeed(overrides),
    dateKey: day.dateKey,
    destination,
    mode,
    radiusMultiplier: ROAMING_RADIUS_SCALE * overrides.radiusMultiplier,
    variant: overrides.planVariant,
  })

  let minuteOfDay: number
  if (overrides.timeOfDayOverride !== null) {
    minuteOfDay = overrides.timeOfDayOverride
  } else if (day.dayFraction !== null) {
    minuteOfDay = day.dayFraction * 1440
  } else {
    minuteOfDay = minuteOfDayInZone(now, destination.timezone)
  }

  return {
    destination,
    plan,
    live: resolvePosition(plan, minuteOfDay),
    dateKey: day.dateKey,
    displayName: overrides.displayNameOverride ?? DISPLAY_NAME,
    accelerated: day.accelerated,
  }
}

/** Sanity check used by the tests and the control panel's data readout. */
export function datasetSummary(): {
  count: number
  countries: number
  continents: Record<string, number>
} {
  const all = getDestinations()
  const continents: Record<string, number> = {}
  const countries = new Set<string>()
  for (const d of all) {
    continents[d.continent] = (continents[d.continent] ?? 0) + 1
    countries.add(d.countryCode)
  }
  return { count: all.length, countries: countries.size, continents }
}
