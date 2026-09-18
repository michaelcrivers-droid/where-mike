import { writeFileSync } from 'node:fs'
import { describe, it } from 'vitest'
import { getDestinations } from '@/data/destinations'
import { bearingBetween, haversineKm, isBearingOnLand, roamArea } from '@/lib/geoUtils'
import { createMovementPlan, resolvePosition } from '@/lib/movementEngine'
import type { MovementMode } from '@/types'

const O: string[] = []
const log = (...xs: unknown[]) => O.push(xs.map(String).join(' '))
const MODES: MovementMode[] = ['stationary', 'walking', 'tourist', 'driving']

describe('probe4', () => {
  it('distance bands of ocean hits', () => {
    const all = getDestinations()
    const bands = [0.05, 0.25, 0.5, 1, 2, 3, 5, 100]
    const counts = new Array(bands.length).fill(0)
    const destsByBand: Array<Set<string>> = bands.map(() => new Set())
    let worst = { km: 0, label: '' }
    const dates = ['2026-09-18', '2026-02-11', '2027-05-03']
    for (const d of all) {
      const area = roamArea(d)
      for (const mode of MODES) {
        for (const dateKey of dates) {
          const plan = createMovementPlan({ seed: 'rc', dateKey, destination: d, mode })
          for (let m = 0; m < 1440; m += 2) {
            const p = resolvePosition(plan, m)
            const dist = haversineKm(d, p)
            if (dist < 0.05) continue
            const b = bearingBetween(d, p)
            if (isBearingOnLand(d.landSectors, b)) continue
            const bi = bands.findIndex((x) => dist <= x)
            counts[bi]++; destsByBand[bi].add(d.id)
            if (dist > worst.km) worst = { km: dist, label: `${d.id} ${mode} ${dateKey} @${m} bearing=${b.toFixed(1)} dist=${dist.toFixed(2)}km radius=${area.radiusKm}` }
          }
        }
      }
    }
    bands.forEach((b, i) => log(`<= ${b} km:`, counts[i], 'samples,', destsByBand[i].size, 'destinations'))
    log('worst:', worst.label)
    const over500 = new Set<string>()
    for (let i = 0; i < bands.length; i++) if (bands[i] > 0.5) destsByBand[i].forEach((x) => over500.add(x))
    log('destinations with a water hit beyond 500 m:', over500.size)
    log(' e.g.', [...over500].slice(0, 40).join(','))
    writeFileSync('/tmp/probe4.txt', O.join('\n'))
  })
})
