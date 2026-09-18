/**
 * Typed access to the generated destination table.
 *
 * The table itself is a pipe-delimited string rather than an array of object
 * literals: 1,300-odd repeated key names cost several times more over the
 * wire than the values do, and a one-line-per-place format is far easier to
 * hand-edit. Parsing happens once, lazily, on first access.
 */

import type { Continent, Destination, DestinationCategory } from '@/types'
import { DESTINATION_COUNT, DESTINATION_TABLE } from './destinations.generated'

const CONTINENT_BY_CODE: Record<string, Continent> = {
  NA: 'North America',
  SA: 'South America',
  EU: 'Europe',
  AF: 'Africa',
  AS: 'Asia',
  OC: 'Oceania',
}

function parseTable(): Destination[] {
  const rows = DESTINATION_TABLE.trim().split('\n')
  const out: Destination[] = new Array(rows.length)
  for (let i = 0; i < rows.length; i++) {
    const c = rows[i].split('|')
    out[i] = {
      id: c[0],
      city: c[1],
      region: c[2],
      country: c[3],
      countryCode: c[4],
      continent: CONTINENT_BY_CODE[c[5]] ?? 'Europe',
      latitude: Number(c[6]),
      longitude: Number(c[7]),
      timezone: c[8],
      safeRoamingRadiusKm: Number(c[9]),
      category: c[10] as DestinationCategory,
      landSectors: Number(c[11]),
      maxRoamingRadiusKm: Number(c[12]),
    }
  }
  return out
}

let cache: Destination[] | null = null

/** Every destination, in a stable order. Parsed once. */
export function getDestinations(): readonly Destination[] {
  if (!cache) cache = parseTable()
  return cache
}

let byId: Map<string, Destination> | null = null

export function getDestinationById(id: string): Destination | undefined {
  if (!byId) byId = new Map(getDestinations().map((d) => [d.id, d]))
  return byId.get(id)
}

/** Row count declared by the generator, used as a data-integrity check. */
export { DESTINATION_COUNT }
