/**
 * Everything you are likely to want to change lives here.
 *
 * Nothing in this file is a secret in the cryptographic sense — the whole app
 * is static and ships to the browser. SECRET_SEED is "secret" only in the
 * sense that a reader of the deployed site is unlikely to bother digging it
 * out, and changing it reshuffles the entire past and future itinerary.
 */

import type { MovementMode } from './types'

/** Product name. Change this and the browser tab, header and README follow. */
export const APP_NAME = 'WhereMike'

/** The name on the status card. */
export const DISPLAY_NAME = 'Michael'

/**
 * Change this string and every date resolves to a completely different city —
 * history and future alike. Any string works.
 */
export const SECRET_SEED = 'wheremike-v1-8f3a92'

/**
 * Which midnight flips the city over.
 *
 * `local` means the switch happens at the viewer's own midnight, so the joke
 * lands when *your* day changes. `utc` makes every viewer on earth agree at
 * the same instant, at the cost of the change landing mid-evening in the
 * Americas.
 */
export const DAY_BOUNDARY: 'local' | 'utc' = 'local'

/**
 * How many calendar days share one destination. 1 = a new city every day.
 * Set to 2 for a new city every other day, 7 for weekly, and so on.
 */
export const DAYS_PER_DESTINATION = 1

/** Movement profile used when the viewer has no local override. */
export const DEFAULT_MOVEMENT_MODE: MovementMode = 'tourist'

/**
 * Recent destinations the draw will not repeat. Guards against the same city
 * twice in a fortnight.
 */
export const NO_REPEAT_CITY_DAYS = 45

/** Days within which the draw avoids reusing a country. */
export const NO_REPEAT_COUNTRY_DAYS = 6

/** Days within which the draw avoids reusing a continent. */
export const NO_REPEAT_CONTINENT_DAYS = 2

/**
 * Minimum great-circle distance, in km, between a day's destination and the
 * previous day's. Stops "Nice → Cannes" reading as a bug.
 */
export const MIN_HOP_DISTANCE_KM = 400

/** Global multiplier on every dataset roaming radius. */
export const ROAMING_RADIUS_SCALE = 1

/** Profile picture. Drop your own file in `public/` and point this at it. */
export const PROFILE_IMAGE_URL = './avatar.svg'

/** Where the hidden control panel lives. */
export const CONTROL_ROUTE = '/control'

/** localStorage key holding the dev overrides. */
export const OVERRIDES_STORAGE_KEY = 'wheremike.overrides.v1'

/**
 * Map style. Free, key-less, community-hosted raster tiles from OpenFreeMap's
 * sibling project. See `src/lib/mapStyle.ts` for the actual style document —
 * swapping providers is a one-file change.
 */
export const MAP_ATTRIBUTION = '© OpenStreetMap contributors'

/** Camera zoom when the viewer opens. Neighbourhood scale. */
export const INITIAL_ZOOM = 14.2

/** How often the live position recomputes, in milliseconds. */
export const TICK_INTERVAL_MS = 1000
