/**
 * Spherical geometry, plus the sector logic that keeps the marker on land.
 */

import type { Destination } from '@/types'
import type { Rng } from './seededRandom'

export interface Coord {
  latitude: number
  longitude: number
}

const EARTH_RADIUS_KM = 6371
const DEG = Math.PI / 180
const SECTORS = 16
const SECTOR_DEG = 360 / SECTORS
/**
 * Sectors were validated along their centre lines, so we keep a small margin
 * away from each edge rather than hugging the boundary with a neighbour that
 * may well be open water.
 */
const SECTOR_INSET_DEG = 3.5

export function toRadians(deg: number): number {
  return deg * DEG
}

/** Great-circle distance in kilometres. */
export function haversineKm(a: Coord, b: Coord): number {
  const dLat = (b.latitude - a.latitude) * DEG
  const dLng = (b.longitude - a.longitude) * DEG
  const lat1 = a.latitude * DEG
  const lat2 = b.latitude * DEG
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Normalise any bearing into [0, 360). */
export function normaliseBearing(deg: number): number {
  return ((deg % 360) + 360) % 360
}

/** Move `km` from `origin` along `bearingDeg`. */
export function project(origin: Coord, km: number, bearingDeg: number): Coord {
  const d = km / EARTH_RADIUS_KM
  const br = bearingDeg * DEG
  const lat1 = origin.latitude * DEG
  const lng1 = origin.longitude * DEG
  const sinLat2 =
    Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(br)
  const lat2 = Math.asin(Math.min(1, Math.max(-1, sinLat2)))
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(br) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * sinLat2,
    )
  return {
    latitude: lat2 / DEG,
    longitude: (((lng2 / DEG + 540) % 360) - 180),
  }
}

/** Initial bearing from `a` to `b`, in degrees clockwise from north. */
export function bearingBetween(a: Coord, b: Coord): number {
  const lat1 = a.latitude * DEG
  const lat2 = b.latitude * DEG
  const dLng = (b.longitude - a.longitude) * DEG
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return normaliseBearing(Math.atan2(y, x) / DEG)
}

/**
 * Straight-line blend between two nearby coordinates. Distances here are a few
 * kilometres at most, so linear interpolation is indistinguishable from a
 * great-circle path and much cheaper. Longitude is unwrapped first so a route
 * that straddles the antimeridian does not sweep the long way round the world.
 */
export function lerpCoord(a: Coord, b: Coord, t: number): Coord {
  let dLng = b.longitude - a.longitude
  if (dLng > 180) dLng -= 360
  if (dLng < -180) dLng += 360
  return {
    latitude: a.latitude + (b.latitude - a.latitude) * t,
    longitude: (((a.longitude + dLng * t + 540) % 360) - 180),
  }
}

/** Smoothstep easing, so departures and arrivals are not abrupt. */
export function easeInOut(t: number): number {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

/** True when `bearingDeg` falls inside a sector that the mask marks as land. */
export function isBearingOnLand(mask: number, bearingDeg: number): boolean {
  const sector = Math.floor(normaliseBearing(bearingDeg) / SECTOR_DEG) % SECTORS
  return (mask & (1 << sector)) !== 0
}

/**
 * The longest circular run of land sectors.
 *
 * Confining a whole day to one contiguous wedge means every straight leg
 * between two points stays inside verified land. Picking anchors from
 * scattered sectors would let a route cut across the bay in between.
 */
export function longestLandRun(mask: number): { start: number; length: number } {
  if (mask === 0) return { start: 0, length: 0 }
  if ((mask & 0xffff) === 0xffff) return { start: 0, length: SECTORS }

  let best = { start: 0, length: 0 }
  for (let start = 0; start < SECTORS; start++) {
    if ((mask & (1 << start)) === 0) continue
    // Only consider runs that actually begin here.
    const prev = (start + SECTORS - 1) % SECTORS
    if ((mask & (1 << prev)) !== 0) continue
    let length = 0
    while (length < SECTORS && (mask & (1 << ((start + length) % SECTORS))) !== 0) length++
    if (length > best.length) best = { start, length }
  }
  return best.length > 0 ? best : { start: 0, length: 0 }
}

/** The bearing window, in degrees, covered by a sector run. */
export function runToBearingWindow(run: { start: number; length: number }): {
  from: number
  span: number
} {
  // A run covering the whole compass has no edges to stay clear of; applying
  // the inset there would carve a wedge of perfectly good land out of the
  // middle of an inland city.
  if (run.length >= SECTORS) return { from: 0, span: 360 }
  return {
    from: run.start * SECTOR_DEG + SECTOR_INSET_DEG,
    span: Math.max(0, run.length * SECTOR_DEG - SECTOR_INSET_DEG * 2),
  }
}

/** True when a bearing sits inside the given run of sectors. */
export function isBearingInRun(run: { start: number; length: number }, bearingDeg: number): boolean {
  if (run.length >= SECTORS) return true
  if (run.length <= 0) return false
  const sector = Math.floor(normaliseBearing(bearingDeg) / SECTOR_DEG) % SECTORS
  return normaliseBearing((sector - run.start) * SECTOR_DEG) < run.length * SECTOR_DEG
}

export { SECTORS, SECTOR_DEG }

export interface RoamArea {
  centre: Coord
  /** Maximum distance from the centre, in km, after any local multiplier. */
  radiusKm: number
  from: number
  span: number
}

/** Everything the movement engine needs to stay on dry land in one place. */
export function roamArea(destination: Destination, radiusMultiplier = 1): RoamArea {
  const run = longestLandRun(destination.landSectors)
  const window = runToBearingWindow(run)
  // Scaling up is capped at the distance the data build actually proved was
  // land. Without the cap a 3x multiplier walks the marker straight past the
  // evidence — 17km out into the bay, for somewhere like Shenzhen. Scaling
  // down is always safe, so only the upper end is clamped.
  const ceiling = Math.max(
    destination.safeRoamingRadiusKm,
    destination.maxRoamingRadiusKm || destination.safeRoamingRadiusKm,
  )
  const requested = destination.safeRoamingRadiusKm * radiusMultiplier
  return {
    centre: { latitude: destination.latitude, longitude: destination.longitude },
    radiusKm: Math.max(0.3, Math.min(requested, ceiling)),
    ...window,
  }
}

/**
 * A point inside the safe wedge.
 *
 * `maxFraction` caps how far out it may sit, and `centreBias` pulls the
 * distribution inwards — 1 spreads points evenly across the radius, higher
 * values keep them nearer the middle of town, which both looks more like a
 * real day and leaves more margin against the coast.
 */
export function pointInRoamArea(
  area: RoamArea,
  rng: Rng,
  maxFraction = 1,
  centreBias = 1.6,
): Coord {
  if (area.span <= 0) return area.centre
  const bearing = normaliseBearing(area.from + rng.next() * area.span)
  const km = area.radiusKm * maxFraction * Math.pow(rng.next(), centreBias)
  return project(area.centre, km, bearing)
}

/** True when a point lies inside the wedge, both in range and in bearing. */
export function isInRoamArea(area: RoamArea, point: Coord, marginDeg = 0): boolean {
  const distance = haversineKm(area.centre, point)
  if (distance > area.radiusKm) return false
  if (area.span >= 360 - 1e-6) return true
  // Within a few metres of the centre the bearing is numerical noise, and the
  // centre is verified land in any case. Without this, a stop drawn almost
  // exactly on the centre can be judged out of the wedge, every candidate for
  // the day gets rejected in turn, and the plan collapses to twenty-four hours
  // of standing still.
  if (distance < 0.02) return true
  const offset = normaliseBearing(bearingBetween(area.centre, point) - area.from)
  return offset <= area.span + marginDeg
}

/**
 * True when the whole straight leg between two points stays on verified land.
 *
 * Both endpoints being inside the wedge is not enough. A wedge wider than 180
 * degrees is not convex, so a leg between two points on either side of the
 * missing slice cuts straight through it — which for a city like Melbourne
 * means walking across the bay. Sampling the chord catches that.
 */
export function legStaysOnLand(area: RoamArea, a: Coord, b: Coord): boolean {
  if (area.span >= 360 - 1e-6) return true
  // Sampled by distance rather than a fixed count: a leg that clips the
  // excluded slice does so over a short arc, and a fixed twelve samples steps
  // straight over it on anything longer than a kilometre or two.
  const samples = Math.max(16, Math.min(320, Math.ceil(haversineKm(a, b) / 0.08)))
  for (let i = 0; i <= samples; i++) {
    if (!isInRoamArea(area, lerpCoord(a, b, i / samples))) return false
  }
  return true
}

/** Clamp a coordinate back inside the safe wedge if it has drifted out. */
export function clampToRoamArea(area: RoamArea, point: Coord): Coord {
  const distance = haversineKm(area.centre, point)
  if (distance <= area.radiusKm) {
    if (area.span >= 360 - 1e-6) return point
    const bearing = bearingBetween(area.centre, point)
    const offset = normaliseBearing(bearing - area.from)
    if (offset <= area.span) return point
    // Outside the wedge: fold onto the nearest edge.
    const toEnd = normaliseBearing(offset - area.span)
    const toStart = normaliseBearing(-offset)
    const edge = toStart < toEnd ? area.from : area.from + area.span
    return project(area.centre, distance, edge)
  }
  const bearing = bearingBetween(area.centre, point)
  return project(area.centre, area.radiusKm, bearing)
}
