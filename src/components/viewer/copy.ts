/**
 * All the wording decisions in one place, so the components stay about layout.
 */

import type { Destination } from '@/types'

/**
 * Countries where the region is the thing people actually say — "Austin,
 * Texas" rather than "Austin, United States". Everywhere else the country is
 * the more informative second line, so the region is dropped.
 */
const REGION_SPEAKING = new Set([
  'US', 'CA', 'AU', 'BR', 'MX', 'IN', 'CN', 'RU', 'AR', 'DE', 'ES', 'ID', 'MY',
])

export interface PlaceLines {
  /** The big line. */
  primary: string
  /** The quieter line beneath it. Always names the country. */
  secondary: string
}

export function placeLines(destination: Destination): PlaceLines {
  const region = destination.region.trim()
  const useRegion = region.length > 0 && REGION_SPEAKING.has(destination.countryCode.toUpperCase())
  const secondary = useRegion ? `${region}, ${destination.country}` : destination.country
  return { primary: destination.city, secondary }
}

/** "5 hours ahead of you", from the whole-hour offset. */
export function offsetPhrase(hoursAhead: number): string {
  if (hoursAhead === 0) return 'Same time as you'
  const magnitude = Math.abs(hoursAhead)
  const unit = magnitude === 1 ? 'hour' : 'hours'
  return `${magnitude} ${unit} ${hoursAhead > 0 ? 'ahead of' : 'behind'} you`
}

export function roamingPhrase(radiusKm: number): string {
  const rounded = radiusKm >= 10 ? Math.round(radiusKm) : Math.round(radiusKm * 10) / 10
  return `Within ${rounded} km of the centre`
}

export function movementPhrase(moving: boolean, speedKmh: number): string {
  if (!moving) return 'Staying put'
  if (speedKmh < 0.4) return 'Barely moving'
  const speed = speedKmh >= 10 ? Math.round(speedKmh) : Math.round(speedKmh * 10) / 10
  return `On the move · ${speed} km/h`
}

const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

/** "Thursday", straight off the date key. No date library, no timezone maths. */
export function weekdayFrom(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return ''
  return WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]
}

/**
 * The "where tomorrow?" tease. Deliberately tells you nothing — it is picked
 * from the date key so every viewer gets the same line on the same day, and
 * none of the lines narrows the answer down by so much as a hemisphere.
 */
const TEASES = [
  'Bags by the door, as usual.',
  'A different breakfast, somewhere.',
  'The map reshuffles at midnight.',
  'He has not told anyone. Including himself.',
  'Somewhere with better weather. Or worse.',
  'Ask again after midnight.',
  'Another airport, another flat white.',
  'Still deciding. He is always still deciding.',
]

export function tomorrowTease(dateKey: string): string {
  let hash = 0
  for (let i = 0; i < dateKey.length; i += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0
  }
  return TEASES[hash % TEASES.length]
}
