/**
 * Dataset integrity.
 *
 * The destination table is the one piece of the app that is not computed, so
 * everything downstream trusts it completely: a bad latitude, a timezone the
 * runtime rejects or an empty land mask would show up as a broken viewer with
 * no stack trace. These checks run over every row.
 */

import { describe, expect, it } from 'vitest'
import { DESTINATION_COUNT, getDestinationById, getDestinations } from '@/data/destinations'
import { datasetSummary } from '@/lib/simulation'
import { longestLandRun } from '@/lib/geoUtils'
import type { Continent, DestinationCategory } from '@/types'

const CONTINENTS: Continent[] = [
  'North America', 'South America', 'Europe', 'Africa', 'Asia', 'Oceania',
]

const CATEGORIES: DestinationCategory[] = [
  'major-city', 'vacation', 'beach', 'capital', 'small-city', 'island',
  'historic', 'nightlife', 'mountain', 'tropical',
]

const all = getDestinations()

describe('table parsing', () => {
  it('parses every declared row', () => {
    expect(all.length).toBe(DESTINATION_COUNT)
    expect(all.length).toBeGreaterThan(1000)
  })

  it('is memoised, not reparsed', () => {
    expect(getDestinations()).toBe(getDestinations())
  })

  it('reports the same count through datasetSummary', () => {
    const summary = datasetSummary()
    expect(summary.count).toBe(DESTINATION_COUNT)
    expect(summary.countries).toBe(new Set(all.map((d) => d.countryCode)).size)
    expect(Object.keys(summary.continents).sort()).toEqual([...CONTINENTS].sort())
    expect(Object.values(summary.continents).reduce((a, b) => a + b, 0)).toBe(summary.count)
  })
})

describe('identity fields', () => {
  it('has a non-empty id, city, country, countryCode and timezone on every row', () => {
    const bad = all.filter((d) => !d.id || !d.city || !d.country || !d.countryCode || !d.timezone)
    expect(bad.map((d) => d.id ?? '(no id)')).toEqual([])
  })

  it('has unique ids', () => {
    const seen = new Map<string, number>()
    for (const d of all) seen.set(d.id, (seen.get(d.id) ?? 0) + 1)
    expect([...seen.entries()].filter(([, n]) => n > 1)).toEqual([])
    expect(seen.size).toBe(all.length)
  })

  it('uses slug-shaped ids that start with the country code', () => {
    const bad = all.filter((d) => !/^[a-z]{2}-[a-z0-9-]+$/.test(d.id))
    expect(bad.map((d) => d.id)).toEqual([])
    const mismatched = all.filter((d) => d.id.slice(0, 2) !== d.countryCode.toLowerCase())
    expect(mismatched.map((d) => `${d.id} / ${d.countryCode}`)).toEqual([])
  })

  it('looks every row up by id', () => {
    for (const d of all) expect(getDestinationById(d.id)).toBe(d)
    expect(getDestinationById('nope-nowhere')).toBeUndefined()
    expect(getDestinationById('')).toBeUndefined()
  })

  it('uses uppercase ISO 3166-1 alpha-2 country codes', () => {
    const bad = all.filter((d) => !/^[A-Z]{2}$/.test(d.countryCode))
    expect(bad.map((d) => `${d.id}: ${d.countryCode}`)).toEqual([])
  })

  it('maps each country code to exactly one country name', () => {
    const names = new Map<string, Set<string>>()
    for (const d of all) {
      if (!names.has(d.countryCode)) names.set(d.countryCode, new Set())
      names.get(d.countryCode)!.add(d.country)
    }
    const ambiguous = [...names.entries()].filter(([, set]) => set.size > 1)
    expect(ambiguous.map(([code, set]) => `${code}: ${[...set].join(' / ')}`)).toEqual([])
  })

  it('never lets a delimiter leak into a field', () => {
    // The table is pipe-delimited and newline-separated, so either character
    // inside a value would silently shift every later column on that row.
    const bad: string[] = []
    for (const d of all) {
      for (const [key, value] of Object.entries(d)) {
        if (typeof value !== 'string') continue
        if (value.includes('|') || value.includes('\n') || value.includes('\r')) {
          bad.push(`${d.id}.${key}`)
        }
      }
    }
    expect(bad).toEqual([])
  })

  it('never leaves a stray "undefined" from a short row', () => {
    const bad = all.filter((d) =>
      Object.values(d).some((v) => v === undefined || (typeof v === 'number' && Number.isNaN(v))))
    expect(bad.map((d) => d.id ?? '(no id)')).toEqual([])
  })

  it('allows an empty region but nothing else blank', () => {
    // Region is explicitly optional; the rest is not.
    expect(all.filter((d) => d.region === '').length).toBeGreaterThan(0)
    expect(all.filter((d) => d.region.trim() !== d.region)).toEqual([])
  })
})

describe('coordinates', () => {
  it('keeps every latitude and longitude in range', () => {
    const bad = all.filter((d) =>
      !Number.isFinite(d.latitude) || !Number.isFinite(d.longitude) ||
      d.latitude < -90 || d.latitude > 90 || d.longitude < -180 || d.longitude > 180)
    expect(bad.map((d) => `${d.id}: ${d.latitude},${d.longitude}`)).toEqual([])
  })

  it('has no null island', () => {
    const bad = all.filter((d) => d.latitude === 0 && d.longitude === 0)
    expect(bad.map((d) => d.id)).toEqual([])
  })

  it('has no two destinations at exactly the same point', () => {
    const seen = new Map<string, string>()
    const clashes: string[] = []
    for (const d of all) {
      const key = `${d.latitude},${d.longitude}`
      if (seen.has(key)) clashes.push(`${d.id} == ${seen.get(key)}`)
      seen.set(key, d.id)
    }
    expect(clashes).toEqual([])
  })

  it('spreads over both hemispheres', () => {
    expect(all.filter((d) => d.latitude > 0).length).toBeGreaterThan(200)
    expect(all.filter((d) => d.latitude < 0).length).toBeGreaterThan(200)
    expect(all.filter((d) => d.longitude > 0).length).toBeGreaterThan(200)
    expect(all.filter((d) => d.longitude < 0).length).toBeGreaterThan(200)
  })
})

describe('enumerations', () => {
  it('uses only the six known continents', () => {
    const bad = all.filter((d) => !CONTINENTS.includes(d.continent))
    expect(bad.map((d) => `${d.id}: ${d.continent}`)).toEqual([])
    expect(new Set(all.map((d) => d.continent)).size).toBe(6)
  })

  it('uses only known categories, and uses most of them', () => {
    const bad = all.filter((d) => !CATEGORIES.includes(d.category))
    expect(bad.map((d) => `${d.id}: ${d.category}`)).toEqual([])
    expect(new Set(all.map((d) => d.category)).size).toBeGreaterThanOrEqual(8)
  })

  it('accepts every timezone in Intl.DateTimeFormat', () => {
    const bad: string[] = []
    for (const zone of new Set(all.map((d) => d.timezone))) {
      try {
        new Intl.DateTimeFormat('en-US', { timeZone: zone })
      } catch {
        bad.push(zone)
      }
    }
    expect(bad).toEqual([])
  }, 60_000)

  it('uses IANA-shaped zone names', () => {
    const bad = all.filter((d) => !/^[A-Za-z][A-Za-z_+-]*(\/[A-Za-z0-9_+-]+)+$/.test(d.timezone) && d.timezone !== 'UTC')
    expect(bad.map((d) => `${d.id}: ${d.timezone}`)).toEqual([])
  })
})

describe('roaming radius', () => {
  it('is a sane positive distance on every row', () => {
    const bad = all.filter((d) =>
      !Number.isFinite(d.safeRoamingRadiusKm) || d.safeRoamingRadiusKm < 0.5 || d.safeRoamingRadiusKm > 25)
    expect(bad.map((d) => `${d.id}: ${d.safeRoamingRadiusKm}`)).toEqual([])
  })

  it('varies with the kind of place rather than being one constant', () => {
    const radii = new Set(all.map((d) => d.safeRoamingRadiusKm))
    expect(radii.size).toBeGreaterThan(5)
    const capitals = all.filter((d) => d.category === 'capital')
    const small = all.filter((d) => d.category === 'small-city')
    const mean = (xs: typeof all): number => xs.reduce((s, d) => s + d.safeRoamingRadiusKm, 0) / xs.length
    expect(mean(capitals)).toBeGreaterThan(mean(small))
  })
})

describe('land sector masks', () => {
  it('is a 16-bit integer greater than zero on every row', () => {
    const bad = all.filter((d) =>
      !Number.isInteger(d.landSectors) || d.landSectors <= 0 || d.landSectors > 0xffff)
    expect(bad.map((d) => `${d.id}: ${d.landSectors}`)).toEqual([])
  })

  it('always has a contiguous run of at least three sectors', () => {
    // Three sectors is 67.5 degrees, which is the smallest wedge the movement
    // engine can lay a believable day out inside.
    const bad = all
      .map((d) => ({ d, run: longestLandRun(d.landSectors) }))
      .filter(({ run }) => run.length < 3)
    expect(bad.map(({ d, run }) => `${d.id}: mask ${d.landSectors} run ${run.length}`)).toEqual([])
  })

  it('reports a run start inside the mask', () => {
    const bad = all.filter((d) => {
      const run = longestLandRun(d.landSectors)
      return (d.landSectors & (1 << run.start)) === 0
    })
    expect(bad.map((d) => d.id)).toEqual([])
  })

  it('carves real water out of coastal cities rather than marking everything land', () => {
    const partial = all.filter((d) => d.landSectors !== 0xffff)
    expect(partial.length).toBeGreaterThan(100)
    const beaches = all.filter((d) => d.category === 'beach' || d.category === 'island')
    const beachesWithWater = beaches.filter((d) => d.landSectors !== 0xffff)
    expect(beachesWithWater.length / beaches.length).toBeGreaterThan(0.5)
  })
})

describe('geographic spread', () => {
  it('covers a lot of countries', () => {
    expect(new Set(all.map((d) => d.countryCode)).size).toBeGreaterThan(150)
  })

  it('never lets one country dominate', () => {
    const counts = new Map<string, number>()
    for (const d of all) counts.set(d.countryCode, (counts.get(d.countryCode) ?? 0) + 1)
    const over = [...counts.entries()]
      .filter(([, n]) => n / all.length > 0.08)
      .map(([code, n]) => `${code}: ${(n / all.length * 100).toFixed(1)}%`)
    expect(over).toEqual([])
  })

  it('gives every continent a workable share', () => {
    const { continents, count } = datasetSummary()
    for (const continent of CONTINENTS) {
      expect(continents[continent], continent).toBeGreaterThan(20)
      // No continent may be more than half the dataset, or the no-repeat rule
      // has nowhere to go.
      expect(continents[continent] / count, continent).toBeLessThan(0.5)
    }
  })

  it('has enough countries per continent for the country-spacing rule', () => {
    const byContinent = new Map<string, Set<string>>()
    for (const d of all) {
      if (!byContinent.has(d.continent)) byContinent.set(d.continent, new Set())
      byContinent.get(d.continent)!.add(d.countryCode)
    }
    for (const continent of CONTINENTS) {
      expect(byContinent.get(continent)!.size, continent).toBeGreaterThan(8)
    }
  })
})
