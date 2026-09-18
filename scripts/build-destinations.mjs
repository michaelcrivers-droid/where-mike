/**
 * Generates `src/data/destinations.generated.ts`.
 *
 * Inputs:
 *   - city-timezones (dev dependency): ~7,300 populated places with
 *     coordinates, population, country, province and IANA timezone.
 *   - scripts/curation.mjs: editorial choices — continents, per-country
 *     quotas, must-have travel destinations, exclusions.
 *   - Natural Earth 10m land/lake polygons: used to prove every roaming
 *     radius we ship actually has dry land in it.
 *
 * Output is committed to the repo, so a normal `npm run build` never needs
 * this script, the 15MB of polygons, or a network connection.
 *
 *   npm run data:build
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

import { createLandOracle } from './geo-mask.mjs'
import {
  CONTINENT_BY_ISO2, COUNTRY_QUOTA, DEFAULT_COUNTRY_QUOTA, MUST_INCLUDE,
  EXCLUDED_COUNTRIES, EXCLUDED_CITIES, DROP_REGION_FOR, CAPITAL_CITIES,
  ISLAND_NATIONS, COUNTRY_DISPLAY_NAME,
} from './curation.mjs'

const require = createRequire(import.meta.url)
const { cityMapping } = require('city-timezones')

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..', 'src', 'data', 'destinations.generated.ts')

/** Minimum population for a city to be considered at all (must-haves bypass). */
const MIN_POPULATION = 40_000
/** Sectors of the compass rose we test around each city. */
const SECTORS = 16
/** A destination needs at least this many dry sectors to be usable. */
const MIN_LAND_SECTORS = 5
/** Never shrink a roaming radius below this. */
const MIN_RADIUS_KM = 1.4
const MAX_RADIUS_KM = 9
/**
 * The furthest the control panel's radius multiplier is ever allowed to push
 * the marker, before land verification. The real ceiling per destination is
 * whatever survives the check below, which is usually far less.
 */
const MAX_EXPANDED_RADIUS_KM = 22

const CONTINENT_CODE = {
  'North America': 'NA', 'South America': 'SA', Europe: 'EU',
  Africa: 'AF', Asia: 'AS', Oceania: 'OC',
}

const EARTH_RADIUS_KM = 6371

/** Move `km` from a coordinate along `bearingDeg`, on a spherical earth. */
function project(lat, lng, km, bearingDeg) {
  const d = km / EARTH_RADIUS_KM
  const br = (bearingDeg * Math.PI) / 180
  const lat1 = (lat * Math.PI) / 180
  const lng1 = (lng * Math.PI) / 180
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(br))
  const lng2 = lng1 + Math.atan2(
    Math.sin(br) * Math.sin(d) * Math.cos(lat1),
    Math.cos(d) - Math.sin(lat1) * Math.sin(lat2),
  )
  return [(lat2 * 180) / Math.PI, (((lng2 * 180) / Math.PI + 540) % 360) - 180]
}

/**
 * Field values land inside a template literal and a pipe-delimited row, so a
 * stray backtick, pipe, newline or `${` would either break the file or shift
 * every column. Source data really does contain backticks (`Bur Sa`id`).
 */
function sanitise(value) {
  return String(value ?? '')
    .replace(/[`\u2018\u2019\u02bb\u02bc]/g, "'")
    .replace(/\$\{/g, '$ {')
    .replace(/[|\r\n]+/g, ' ')
    .trim()
}

function slug(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Rough population-and-flavour-driven starting radius, before land checks. */
function baseRadiusKm(category, pop) {
  const byCategory = {
    'major-city': 7, capital: 6, nightlife: 5.5, historic: 5, vacation: 5,
    'small-city': 3.6, mountain: 4, beach: 3.8, island: 3.2, tropical: 3.4,
  }
  let km = byCategory[category] ?? 4
  if (pop > 3_000_000) km += 1.8
  else if (pop > 1_000_000) km += 1
  else if (pop > 300_000) km += 0.4
  else if (pop < 80_000) km -= 0.8
  return Math.min(MAX_RADIUS_KM, Math.max(MIN_RADIUS_KM, km))
}

/**
 * Bitmask of compass sectors whose full depth is dry land. A sector counts
 * only when three sample points along it — near, mid and the rim — are all
 * on land and outside any mapped lake.
 */
function landSectorMask(oracle, lat, lng, radiusKm, fractions = [0.45, 0.75, 1]) {
  let mask = 0
  let count = 0
  for (let s = 0; s < SECTORS; s++) {
    const bearing = (s * 360) / SECTORS
    let ok = true
    for (const frac of fractions) {
      const [plat, plng] = project(lat, lng, radiusKm * frac, bearing)
      if (!oracle.isLand(plat, plng)) { ok = false; break }
    }
    if (ok) { mask |= 1 << s; count++ }
  }
  return { mask, count }
}

/** True when the city centre, or somewhere within ~1km of it, is on land. */
function centreIsLand(oracle, lat, lng) {
  if (oracle.isLand(lat, lng)) return true
  for (let s = 0; s < 8; s++) {
    const [plat, plng] = project(lat, lng, 1, s * 45)
    if (oracle.isLand(plat, plng)) return true
  }
  return false
}

/** Shrink the radius until enough of the compass rose is dry, or give up. */
function fitRadius(oracle, lat, lng, startKm) {
  for (const scale of [1, 0.78, 0.6, 0.45, 0.32]) {
    const km = Math.max(MIN_RADIUS_KM, Number((startKm * scale).toFixed(2)))
    const { mask, count } = landSectorMask(oracle, lat, lng, km)
    if (count >= MIN_LAND_SECTORS) return { km, mask, count }
    if (km === MIN_RADIUS_KM) break
  }
  const floor = landSectorMask(oracle, lat, lng, MIN_RADIUS_KM)
  return floor.count >= 3 ? { km: MIN_RADIUS_KM, ...floor } : null
}

/** The longest circular run of set sectors, mirroring the runtime helper. */
function longestRun(mask) {
  if (mask === 0) return { start: 0, length: 0 }
  if ((mask & 0xffff) === 0xffff) return { start: 0, length: SECTORS }
  let best = { start: 0, length: 0 }
  for (let start = 0; start < SECTORS; start++) {
    if ((mask & (1 << start)) === 0) continue
    if ((mask & (1 << ((start + SECTORS - 1) % SECTORS))) !== 0) continue
    let length = 0
    while (length < SECTORS && (mask & (1 << ((start + length) % SECTORS))) !== 0) length++
    if (length > best.length) best = { start, length }
  }
  return best
}

function runToMask(run) {
  let mask = 0
  for (let i = 0; i < run.length; i++) mask |= 1 << ((run.start + i) % SECTORS)
  return mask
}

/**
 * How far the day's wedge can be stretched and still be on land.
 *
 * The sector mask proves dry land out to the chosen radius and says nothing
 * about anything beyond it, so scaling the radius up at runtime — which the
 * control panel's multiplier does — would walk the marker straight past the
 * evidence and into the sea. Shenzhen at 3x lands 16km out in the bay.
 *
 * So the ceiling is measured here instead: push the radius out step by step
 * and keep going only while every sector in the wedge the runtime actually
 * uses is still land, sampled densely along its whole length.
 */
function maxSafeRadiusKm(oracle, lat, lng, baseKm, mask) {
  const wedge = runToMask(longestRun(mask))
  if (wedge === 0) return baseKm
  const dense = [0.25, 0.4, 0.55, 0.7, 0.85, 1]
  let best = baseKm
  for (let km = baseKm * 1.25; km <= MAX_EXPANDED_RADIUS_KM; km *= 1.25) {
    const probe = landSectorMask(oracle, lat, lng, km, dense)
    if ((probe.mask & wedge) !== wedge) break
    best = Number(km.toFixed(2))
  }
  return best
}

function pickCategory(key, city, pop, coastal) {
  const pinned = MUST_INCLUDE[key]
  if (pinned) return pinned
  const iso2 = key.split('|')[1]
  if (CAPITAL_CITIES.has(key)) return 'capital'
  if (ISLAND_NATIONS.has(iso2)) return Math.abs(city.lat) < 23.5 ? 'tropical' : 'island'
  if (coastal && Math.abs(city.lat) < 35) return 'beach'
  if (pop >= 900_000) return 'major-city'
  if (coastal) return 'beach'
  if (pop >= 220_000) return 'major-city'
  return 'small-city'
}

function normaliseRegion(key, city) {
  const region = (city.province ?? '').trim()
  if (!region) return ''
  if (DROP_REGION_FOR.has(key)) return ''
  if (region.toLowerCase() === city.city.toLowerCase()) return ''
  if (region.toLowerCase() === (city.country ?? '').toLowerCase()) return ''
  if (region.length > 34) return ''
  return region
}

async function main() {
  console.log('Loading Natural Earth polygons…')
  const oracle = await createLandOracle()
  console.log(`  ${oracle.landPolygonCount} land + ${oracle.lakePolygonCount} lake polygons\n`)

  // 1. Deduplicate the source list, keeping the most populous entry per city.
  const byKey = new Map()
  for (const city of cityMapping) {
    const iso2 = city.iso2
    if (!iso2 || !city.timezone || !Number.isFinite(city.lat) || !Number.isFinite(city.lng)) continue
    if (!CONTINENT_BY_ISO2[iso2]) continue
    if (EXCLUDED_COUNTRIES.has(iso2)) continue
    const key = `${city.city}|${iso2}`
    if (EXCLUDED_CITIES.has(key)) continue
    const prev = byKey.get(key)
    if (!prev || (city.pop ?? 0) > (prev.pop ?? 0)) byKey.set(key, city)
  }

  // 2. Rank each country's candidates: must-haves first, then by population.
  const byCountry = new Map()
  for (const [key, city] of byKey) {
    const pop = city.pop ?? 0
    const must = key in MUST_INCLUDE
    if (!must && pop < MIN_POPULATION) continue
    const list = byCountry.get(city.iso2) ?? []
    list.push({ key, city, pop, must })
    byCountry.set(city.iso2, list)
  }
  for (const list of byCountry.values()) {
    list.sort((a, b) => (b.must ? 1 : 0) - (a.must ? 1 : 0) || b.pop - a.pop)
  }

  // 3. Fill each country's quota, verifying land safety and backfilling
  //    whenever a candidate turns out to be mostly water.
  const destinations = []
  const rejected = []
  const usedIds = new Set()

  for (const [iso2, candidates] of [...byCountry.entries()].sort()) {
    const quota = COUNTRY_QUOTA[iso2] ?? DEFAULT_COUNTRY_QUOTA
    let taken = 0
    for (const { key, city, pop, must } of candidates) {
      if (taken >= quota && !must) break
      if (!centreIsLand(oracle, city.lat, city.lng)) {
        rejected.push(`${key} (centre not on land)`)
        continue
      }
      // A city is "coastal" when the sea is within ~3.5km of the middle of it.
      const coastal = landSectorMask(oracle, city.lat, city.lng, 3.5).count < SECTORS
      const category = pickCategory(key, city, pop, coastal)
      const fitted = fitRadius(oracle, city.lat, city.lng, baseRadiusKm(category, pop))
      if (!fitted) {
        rejected.push(`${key} (no safe roaming radius)`)
        continue
      }

      const maxRadius = maxSafeRadiusKm(oracle, city.lat, city.lng, fitted.km, fitted.mask)

      let id = `${iso2.toLowerCase()}-${slug(city.city)}`
      if (usedIds.has(id)) {
        let n = 2
        while (usedIds.has(`${id}-${n}`)) n++
        id = `${id}-${n}`
      }
      usedIds.add(id)

      destinations.push({
        id,
        city: sanitise(city.city),
        region: sanitise(normaliseRegion(key, city)),
        country: sanitise(COUNTRY_DISPLAY_NAME[city.country] ?? city.country),
        countryCode: iso2,
        continent: CONTINENT_BY_ISO2[iso2],
        latitude: Number(city.lat.toFixed(4)),
        longitude: Number(city.lng.toFixed(4)),
        timezone: city.timezone,
        safeRoamingRadiusKm: fitted.km,
        maxRoamingRadiusKm: maxRadius,
        category,
        landSectors: fitted.mask,
      })
      taken++
    }
  }

  destinations.sort((a, b) => a.country.localeCompare(b.country) || a.city.localeCompare(b.city))

  // 4. Emit a compact, hand-editable pipe-delimited table.
  const lines = destinations.map((d) => [
    d.id, d.city, d.region, d.country, d.countryCode, CONTINENT_CODE[d.continent],
    d.latitude, d.longitude, d.timezone, d.safeRoamingRadiusKm, d.category, d.landSectors,
    d.maxRoamingRadiusKm,
  ].join('|'))

  const byContinent = {}
  const byCountryCount = {}
  const byCategory = {}
  for (const d of destinations) {
    byContinent[d.continent] = (byContinent[d.continent] ?? 0) + 1
    byCountryCount[d.country] = (byCountryCount[d.country] ?? 0) + 1
    byCategory[d.category] = (byCategory[d.category] ?? 0) + 1
  }

  const banner = Object.entries(byContinent)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `//   ${k.padEnd(14)} ${String(v).padStart(4)}`)
    .join('\n')

  const file = `// GENERATED FILE — do not edit by hand.
// Rebuild with: npm run data:build   (see scripts/build-destinations.mjs)
//
// ${destinations.length} destinations across ${Object.keys(byCountryCount).length} countries.
//
${banner}
//
// Each row is:
//   id|city|region|country|countryCode|continent|lat|lng|timezone|radiusKm|category|landSectors|maxRadiusKm
//
// landSectors is a 16-bit mask. Bit N is set when the compass sector
// starting at N * 22.5 degrees is dry land all the way out to the roaming
// radius, checked against Natural Earth 10m land and lake polygons at build
// time. The roaming engine only ever places the marker inside a set bit,
// which is what stops it turning up in the sea.
//
// maxRadiusKm is how far that wedge can be stretched and still be verified
// land, sampled densely along its whole length. It is the ceiling the control
// panel's roaming-radius multiplier is clamped to.

export const DESTINATION_TABLE = \`
${lines.join('\n')}\`

export const DESTINATION_COUNT = ${destinations.length}
`

  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, file)

  console.log(`Wrote ${destinations.length} destinations to ${OUT}`)
  console.log('\nBy continent:')
  for (const [k, v] of Object.entries(byContinent).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(15)} ${String(v).padStart(4)}  ${(100 * v / destinations.length).toFixed(1)}%`)
  }
  console.log('\nBy category:')
  for (const [k, v] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(15)} ${String(v).padStart(4)}`)
  }
  const topCountries = Object.entries(byCountryCount).sort((a, b) => b[1] - a[1]).slice(0, 8)
  console.log('\nTop countries:')
  for (const [k, v] of topCountries) {
    console.log(`  ${k.padEnd(20)} ${String(v).padStart(3)}  ${(100 * v / destinations.length).toFixed(1)}%`)
  }
  console.log(`\nCountries represented: ${Object.keys(byCountryCount).length}`)
  console.log(`Rejected for land safety: ${rejected.length}`)
  if (rejected.length) console.log('  ' + rejected.slice(0, 25).join('\n  '))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
