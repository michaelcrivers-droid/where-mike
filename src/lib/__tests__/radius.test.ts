import { expect, it } from 'vitest'
import { getDestinations } from '@/data/destinations'
import { createMovementPlan, resolvePosition } from '@/lib/movementEngine'
import { haversineKm, roamArea } from '@/lib/geoUtils'
import type { MovementMode } from '@/types'

it('a scaled radius never exceeds the verified ceiling', () => {
  const all = getDestinations()
  let worst = 0, worstId = ''
  for (let i = 0; i < all.length; i += 7) {
    const d = all[i]
    for (const mult of [0.25, 1, 2, 3, 4]) {
      const area = roamArea(d, mult)
      expect(area.radiusKm, d.id).toBeLessThanOrEqual(Math.max(d.safeRoamingRadiusKm, d.maxRoamingRadiusKm) + 1e-9)
      for (const mode of ['tourist', 'driving'] as MovementMode[]) {
        const plan = createMovementPlan({ seed: 'r', dateKey: '2026-09-18', destination: d, mode, radiusMultiplier: mult })
        for (let m = 0; m < 1440; m += 17) {
          const over = haversineKm(d, resolvePosition(plan, m)) - Math.max(d.safeRoamingRadiusKm, d.maxRoamingRadiusKm)
          if (over > worst) { worst = over; worstId = `${d.id}/${mode}/${mult}x@${m}` }
        }
      }
    }
  }
  console.log(`worst overshoot beyond VERIFIED ceiling: ${worst.toFixed(4)} km (${worstId || 'none'})`)
  expect(worst).toBeLessThan(0.05)
}, 120_000)
