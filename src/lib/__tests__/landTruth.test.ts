/**
 * The land-safety test that is not circular.
 *
 * `exhaustive.test.ts` checks that every position the engine produces lies
 * inside the sector mask. That is worth having, but it can only ever prove the
 * engine respects the mask — if the mask itself were wrong, every assertion
 * would still pass. It validates the output against the same data that
 * generated it.
 *
 * This file closes that loop by throwing away the mask and asking the source
 * geometry directly: is this exact coordinate on dry land, according to the
 * Natural Earth polygons? Nothing the engine believes is taken on trust.
 *
 * It needs the 15MB polygon cache, which is gitignored because a normal build
 * has no use for it. Without the cache the test skips rather than fails.
 * Populate it with `npm run data:build` and re-run.
 */

import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { getDestinations } from '@/data/destinations'
import { createMovementPlan, resolvePosition } from '@/lib/movementEngine'
import { haversineKm } from '@/lib/geoUtils'
import type { MovementMode } from '@/types'

const HERE = dirname(fileURLToPath(import.meta.url))
const CACHE = resolve(HERE, '../../../scripts/.cache')
const HAS_POLYGONS =
  existsSync(resolve(CACHE, 'land.geojson')) && existsSync(resolve(CACHE, 'lakes.geojson'))

const MODES: MovementMode[] = ['stationary', 'walking', 'tourist', 'driving']
const DATES = ['2026-02-11', '2026-09-18', '2027-07-04']

/** Every Nth destination. WM_FULL=1 checks all of them. */
const STRIDE = process.env.WM_FULL ? 1 : 13

describe.skipIf(!HAS_POLYGONS)('land truth (needs scripts/.cache — run npm run data:build)', () => {
  it('every sampled position is on real land, per Natural Earth', async () => {
    const { createLandOracle } = (await import(
      /* @vite-ignore */ resolve(HERE, '../../../scripts/geo-mask.mjs')
    )) as { createLandOracle: () => Promise<{ isLand: (lat: number, lng: number) => boolean }> }
    const oracle = await createLandOracle()

    const all = getDestinations().filter((_, i) => i % STRIDE === 0)
    const wet: string[] = []
    let samples = 0

    for (const destination of all) {
      // The centre itself must be dry: it is the origin every position is
      // projected from, and where stops cluster.
      if (!oracle.isLand(destination.latitude, destination.longitude)) {
        wet.push(`${destination.id} CENTRE ${destination.latitude},${destination.longitude}`)
      }
      for (const dateKey of DATES) {
        for (const mode of MODES) {
          for (const radiusMultiplier of [1, 2.5]) {
            const plan = createMovementPlan({
              seed: 'land-truth', dateKey, destination, mode, radiusMultiplier,
            })
            for (let minute = 0; minute < 1440; minute += 5) {
              const p = resolvePosition(plan, minute)
              samples++
              if (!oracle.isLand(p.latitude, p.longitude)) {
                wet.push(
                  `${destination.id}/${mode}/${dateKey}/${radiusMultiplier}x@${minute} ` +
                    `${p.latitude.toFixed(5)},${p.longitude.toFixed(5)} ` +
                    `(${haversineKm(destination, p).toFixed(2)}km out)`,
                )
              }
            }
          }
        }
      }
    }

    console.log(
      `land truth: ${samples.toLocaleString()} positions over ${all.length} destinations, ` +
        `${wet.length} in water`,
    )
    expect(wet.slice(0, 20), `${wet.length} positions in water`).toEqual([])
  }, 900_000)
})
