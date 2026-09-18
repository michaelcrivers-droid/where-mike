/** Shared domain types for WhereMike. */

export type Continent =
  | 'North America'
  | 'South America'
  | 'Europe'
  | 'Africa'
  | 'Asia'
  | 'Oceania'

export type DestinationCategory =
  | 'major-city'
  | 'vacation'
  | 'beach'
  | 'capital'
  | 'small-city'
  | 'island'
  | 'historic'
  | 'nightlife'
  | 'mountain'
  | 'tropical'

/**
 * One known-populated place the traveller can turn up in. Coordinates always
 * come from this dataset — nothing in the app invents a latitude/longitude
 * from scratch, which is what keeps the marker out of the ocean.
 */
export interface Destination {
  /** Stable slug, e.g. `fr-paris`. Used as the anti-repeat key and in the URL. */
  id: string
  city: string
  /** State/province/prefecture. Empty string when a region reads as noise. */
  region: string
  country: string
  /** ISO 3166-1 alpha-2, used for the flag and for country-spacing rules. */
  countryCode: string
  continent: Continent
  latitude: number
  longitude: number
  /** IANA zone, e.g. `Europe/Paris`. */
  timezone: string
  /** How far from the city centre the simulated person may wander, in km. */
  safeRoamingRadiusKm: number
  category: DestinationCategory
  /**
   * 16-bit compass mask. Bit N is set when the sector starting at
   * N * 22.5 degrees is dry land the whole way out to `safeRoamingRadiusKm`,
   * verified against Natural Earth 10m land and lake polygons at data-build
   * time. The roaming engine only places the marker inside a set bit.
   */
  landSectors: number
}

export type MovementMode = 'stationary' | 'walking' | 'tourist' | 'driving'

/** A single point on the day's plan, in minutes since local midnight. */
export interface Waypoint {
  /** Minutes since local midnight, 0–1440. */
  minute: number
  latitude: number
  longitude: number
  /** True when the person is parked here until the next waypoint. */
  dwell: boolean
  /** Human label for the control panel timeline, e.g. "Walking". */
  label: string
}

/** The whole day, precomputed once per (date, seed, mode, destination). */
export interface MovementPlan {
  destination: Destination
  mode: MovementMode
  /** `YYYY-MM-DD` in the destination's local calendar. */
  dateKey: string
  waypoints: Waypoint[]
  /** Contiguous segments derived from the waypoints, for the timeline UI. */
  segments: MovementSegment[]
}

export interface MovementSegment {
  startMinute: number
  endMinute: number
  moving: boolean
  label: string
  /** Straight-line distance covered by this segment, in km. */
  distanceKm: number
  /** Average speed across the segment, in km/h. 0 while stationary. */
  speedKmh: number
}

/** Where the person is right now, plus the bits the status card renders. */
export interface LiveLocation {
  latitude: number
  longitude: number
  /** Degrees clockwise from north; null when effectively stationary. */
  heading: number | null
  moving: boolean
  /** Fake-but-plausible GPS accuracy halo radius, in metres. */
  accuracyMeters: number
  speedKmh: number
  /** Copy for the status line, e.g. "Now" or "Moving · 4 km/h". */
  statusLabel: string
  /** Minutes since local midnight at the destination. */
  localMinuteOfDay: number
}

/** Local-only developer overrides, persisted to localStorage. */
export interface ControlOverrides {
  /** Force a specific calendar date, `YYYY-MM-DD`. */
  dateOverride: string | null
  /** Replace the build-time SECRET_SEED for this browser only. */
  seedOverride: string | null
  /** Force one destination by id, ignoring the daily draw. */
  destinationIdOverride: string | null
  /** Override the movement profile. */
  modeOverride: MovementMode | null
  /** Force the time of day, in minutes since local midnight. */
  timeOfDayOverride: number | null
  /** Multiply the roaming radius. 1 = dataset value. */
  radiusMultiplier: number
  /** Compress a simulated day into this many real-world minutes. 0 = off. */
  acceleratedDayMinutes: number
  /** Nudge the plan without changing the date — reshuffles waypoints only. */
  planVariant: number
  /** Show the debug overlay on the public viewer. */
  debug: boolean
  /** Display name shown on the status card. */
  displayNameOverride: string | null
}

/** Everything the viewer needs for one render tick. */
export interface ViewerState {
  destination: Destination
  plan: MovementPlan
  live: LiveLocation
  /** `YYYY-MM-DD` the destination was drawn for. */
  dateKey: string
  displayName: string
  /** True while accelerated-day testing is active. */
  accelerated: boolean
}
