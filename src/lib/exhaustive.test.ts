import { expect, it } from 'vitest'
import { getDestinations } from '@/data/destinations'
import { createMovementPlan, resolvePosition } from './movementEngine'
import {
  bearingBetween, haversineKm, isBearingInRun, isBearingOnLand, longestLandRun, roamArea,
} from './geoUtils'
import type { MovementMode } from '@/types'

const MODES: MovementMode[] = ['stationary', 'walking', 'tourist', 'driving']
const DATES = ['2026-01-07', '2026-05-22', '2026-09-18', '2027-02-28']

/**
 * The full sweep is every destination, every mode, every three minutes of four
 * different days — about ten million sampled positions, and roughly ten
 * seconds. That is too slow to sit in the default run, so the routine pass
 * takes every third city. Run the whole thing with:
 *
 *   WM_FULL=1 npx vitest run src/lib/exhaustive.test.ts
 */
const STRIDE = process.env.WM_FULL ? 1 : 3

it('exhaustive: no position ever leaves verified land', () => {
  const all = getDestinations().filter((_, i) => i % STRIDE === 0)
  const failures: string[] = []
  let samples = 0
  let maxSpeed = 0
  let emptyPlans = 0

  for (const destination of all) {
    const run = longestLandRun(destination.landSectors)
    const area = roamArea(destination)
    for (const dateKey of DATES) {
      for (const mode of MODES) {
        const plan = createMovementPlan({ seed: 'exhaustive', dateKey, destination, mode })
        if (plan.segments.filter((s) => s.moving).length === 0) emptyPlans++
        for (const s of plan.segments) if (s.speedKmh > maxSpeed) maxSpeed = s.speedKmh
        for (let minute = 0; minute < 1440; minute += 3) {
          const p = resolvePosition(plan, minute)
          samples++
          const distance = haversineKm(destination, p)
          if (distance > area.radiusKm + 0.02) {
            failures.push(`${destination.id}/${mode}/${dateKey}@${minute} dist ${distance.toFixed(3)} > ${area.radiusKm}`)
            continue
          }
          if (distance <= 0.15) continue
          const bearing = bearingBetween(destination, p)
          if (!isBearingOnLand(destination.landSectors, bearing) || !isBearingInRun(run, bearing)) {
            failures.push(`${destination.id}/${mode}/${dateKey}@${minute} bearing ${bearing.toFixed(1)} off land`)
          }
        }
      }
    }
  }

  console.log(`samples=${samples} maxSpeed=${maxSpeed.toFixed(1)} plansWithNoMovement=${emptyPlans} failures=${failures.length}`)
  if (failures.length) console.log(failures.slice(0, 15).join('\n'))
  expect(failures).toHaveLength(0)
  expect(maxSpeed).toBeLessThan(42)
  expect(samples).toBeGreaterThan(3_000_000)
}, 600_000)
