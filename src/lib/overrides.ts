/**
 * Local developer overrides.
 *
 * Two sources, in order of precedence:
 *
 *   1. URL query parameters — transient, never persisted, handy for sharing a
 *      "look at this date" link with yourself.
 *   2. localStorage — set from /control, and scoped to one browser. Nothing
 *      here reaches another visitor; there is no server to reach.
 *
 * With neither present the app runs on real calendar days and the build-time
 * SECRET_SEED, which is what every normal visitor gets.
 */

import type { ControlOverrides, MovementMode } from '@/types'
import { OVERRIDES_STORAGE_KEY } from '@/config'
import { isValidDateKey } from './timeUtils'

export const DEFAULT_OVERRIDES: ControlOverrides = {
  dateOverride: null,
  seedOverride: null,
  destinationIdOverride: null,
  modeOverride: null,
  timeOfDayOverride: null,
  radiusMultiplier: 1,
  acceleratedDayMinutes: 0,
  planVariant: 0,
  debug: false,
  displayNameOverride: null,
}

const MOVEMENT_MODES: MovementMode[] = ['stationary', 'walking', 'tourist', 'driving']

function isMovementMode(value: unknown): value is MovementMode {
  return typeof value === 'string' && (MOVEMENT_MODES as string[]).includes(value)
}

/** Narrow whatever came out of storage back to a known-good shape. */
function coerce(raw: unknown): Partial<ControlOverrides> {
  if (!raw || typeof raw !== 'object') return {}
  const r = raw as Record<string, unknown>
  const out: Partial<ControlOverrides> = {}

  if (typeof r.dateOverride === 'string' && isValidDateKey(r.dateOverride)) {
    out.dateOverride = r.dateOverride
  }
  if (typeof r.seedOverride === 'string' && r.seedOverride.trim()) {
    out.seedOverride = r.seedOverride.trim()
  }
  if (typeof r.destinationIdOverride === 'string' && r.destinationIdOverride.trim()) {
    out.destinationIdOverride = r.destinationIdOverride.trim()
  }
  if (isMovementMode(r.modeOverride)) out.modeOverride = r.modeOverride
  if (typeof r.timeOfDayOverride === 'number' && Number.isFinite(r.timeOfDayOverride)) {
    out.timeOfDayOverride = Math.max(0, Math.min(1439.99, r.timeOfDayOverride))
  }
  if (typeof r.radiusMultiplier === 'number' && Number.isFinite(r.radiusMultiplier)) {
    out.radiusMultiplier = Math.max(0.1, Math.min(4, r.radiusMultiplier))
  }
  if (typeof r.acceleratedDayMinutes === 'number' && Number.isFinite(r.acceleratedDayMinutes)) {
    out.acceleratedDayMinutes = Math.max(0, Math.min(1440, r.acceleratedDayMinutes))
  }
  if (typeof r.planVariant === 'number' && Number.isFinite(r.planVariant)) {
    out.planVariant = Math.max(0, Math.round(r.planVariant))
  }
  if (typeof r.debug === 'boolean') out.debug = r.debug
  if (typeof r.displayNameOverride === 'string' && r.displayNameOverride.trim()) {
    out.displayNameOverride = r.displayNameOverride.trim().slice(0, 32)
  }
  return out
}

function readStorage(): Partial<ControlOverrides> {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY)
    return raw ? coerce(JSON.parse(raw)) : {}
  } catch {
    // Private browsing, disabled storage, corrupt JSON — none of it should
    // stop the public viewer from rendering.
    return {}
  }
}

/** Parse `hh:mm`, `h:mm`, or a raw minute count. Returns null if unusable. */
function parseTimeOfDay(value: string): number | null {
  const clock = /^(\d{1,2}):(\d{2})$/.exec(value)
  if (clock) {
    const h = Number(clock[1])
    const m = Number(clock[2])
    if (h < 24 && m < 60) return h * 60 + m
    return null
  }
  const minutes = Number(value)
  return Number.isFinite(minutes) && minutes >= 0 && minutes < 1440 ? minutes : null
}

function readQuery(search: string): Partial<ControlOverrides> {
  const out: Partial<ControlOverrides> = {}
  if (!search) return out
  const params = new URLSearchParams(search)

  const date = params.get('date')
  if (date && isValidDateKey(date)) out.dateOverride = date

  const seed = params.get('seed')
  if (seed?.trim()) out.seedOverride = seed.trim()

  const city = params.get('city')
  if (city?.trim()) out.destinationIdOverride = city.trim()

  const mode = params.get('mode')
  if (isMovementMode(mode)) out.modeOverride = mode

  const time = params.get('time')
  if (time) {
    const minute = parseTimeOfDay(time)
    if (minute !== null) out.timeOfDayOverride = minute
  }

  const radius = params.get('radius')
  if (radius && Number.isFinite(Number(radius))) {
    out.radiusMultiplier = Math.max(0.1, Math.min(4, Number(radius)))
  }

  // `speed` is a multiplier: 60 means a day goes by in 24 minutes.
  const speed = params.get('speed')
  if (speed && Number(speed) > 1) {
    out.acceleratedDayMinutes = Math.max(0.25, Math.min(1440, 1440 / Number(speed)))
  }
  const dayMinutes = params.get('dayMinutes')
  if (dayMinutes && Number(dayMinutes) > 0) {
    out.acceleratedDayMinutes = Math.max(0.25, Math.min(1440, Number(dayMinutes)))
  }

  const variant = params.get('variant')
  if (variant && Number.isFinite(Number(variant))) out.planVariant = Math.max(0, Number(variant))

  if (params.get('debug') === '1' || params.get('debug') === 'true') out.debug = true

  const name = params.get('name')
  if (name?.trim()) out.displayNameOverride = name.trim().slice(0, 32)

  return out
}

/** Effective overrides: defaults, then storage, then the URL. */
export function readOverrides(search = typeof location === 'undefined' ? '' : location.search): ControlOverrides {
  return { ...DEFAULT_OVERRIDES, ...readStorage(), ...readQuery(search) }
}

/** Just the persisted layer, for the control panel's own form state. */
export function readStoredOverrides(): ControlOverrides {
  return { ...DEFAULT_OVERRIDES, ...readStorage() }
}

type Listener = () => void
const listeners = new Set<Listener>()

function notify(): void {
  for (const listener of listeners) listener()
}

export function subscribeToOverrides(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Merge a patch into the persisted overrides and tell everyone. */
export function writeOverrides(patch: Partial<ControlOverrides>): ControlOverrides {
  const next = { ...readStoredOverrides(), ...patch }
  try {
    localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Nothing useful to do; the in-memory value still applies for this session.
  }
  notify()
  return next
}

/** Clear every local override. The reset button. */
export function resetOverrides(): void {
  try {
    localStorage.removeItem(OVERRIDES_STORAGE_KEY)
  } catch {
    /* ignore */
  }
  notify()
}

/** True when anything is currently being overridden locally. */
export function hasActiveOverrides(overrides: ControlOverrides): boolean {
  return (Object.keys(DEFAULT_OVERRIDES) as Array<keyof ControlOverrides>).some(
    (key) => overrides[key] !== DEFAULT_OVERRIDES[key],
  )
}
