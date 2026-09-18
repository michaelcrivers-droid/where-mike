/**
 * The movement engine: plan shape, interpolation and speed.
 *
 * Land safety gets its own file (`landSafety.test.ts`) because it is the
 * single most important property in the suite. What is here is everything
 * else a day has to satisfy: the timeline is well-formed, the dot moves
 * continuously, and the numbers on the status card are the numbers the dot is
 * actually doing.
 *
 * Heavy checks sample the dataset (every 17th or 53rd destination) rather than
 * dropping coverage, which keeps the whole file well under ten seconds.
 */

import { describe, expect, it } from 'vitest'
import { createMovementPlan, planKey, resolvePosition } from '@/lib/movementEngine'
import { getDestinationById, getDestinations } from '@/data/destinations'
import { bearingBetween, haversineKm, roamArea } from '@/lib/geoUtils'
import { MINUTES_PER_DAY } from '@/lib/timeUtils'
import type { Destination, MovementMode, MovementPlan } from '@/types'

const MODES: MovementMode[] = ['stationary', 'walking', 'tourist', 'driving']
const DATES = ['2026-01-07', '2026-05-22', '2026-09-18', '2027-02-28']
const all = getDestinations()

/** A representative slice of the dataset — every 17th city, all continents. */
const sample = all.filter((_, i) => i % 17 === 0)
/** A smaller slice for the checks that walk a whole day minute by minute. */
const smallSample = all.filter((_, i) => i % 53 === 0)

const paris = getDestinationById('fr-paris') ?? all[0]

const plansFor = (destination: Destination, dateKey = '2026-09-18'): MovementPlan[] =>
  MODES.map((mode) => createMovementPlan({ seed: 'engine', dateKey, destination, mode }))

interface Leg {
  index: number
  startMinute: number
  endMinute: number
  distanceKm: number
  speedKmh: number
}

/**
 * The longest *journey* of a plan — one stop to the next — that is long enough
 * to measure.
 *
 * A journey is frequently split by a bend waypoint, and the engine eases
 * across the whole thing rather than each half, so a single waypoint pair is
 * no longer the meaningful unit. Distance here is path distance along the
 * journey, which is what the marker actually travels.
 */
const longestLeg = (plan: MovementPlan, minMinutes = 8, minKm = 0.3): Leg | null => {
  const { waypoints } = plan
  let best: Leg | null = null
  for (let i = 0; i < waypoints.length - 1; i++) {
    if (waypoints[i].dwell) continue
    if (i > 0 && !waypoints[i - 1].dwell) continue // mid-journey, not its start
    let end = i + 1
    while (end < waypoints.length - 1 && !waypoints[end].dwell) end++
    let distanceKm = 0
    for (let k = i; k < end; k++) distanceKm += haversineKm(waypoints[k], waypoints[k + 1])
    const startMinute = waypoints[i].minute
    const endMinute = waypoints[end].minute
    if (endMinute - startMinute < minMinutes || distanceKm < minKm) continue
    if (!best || distanceKm > best.distanceKm) {
      best = {
        index: i,
        startMinute,
        endMinute,
        distanceKm,
        speedKmh: (distanceKm / (endMinute - startMinute)) * 60,
      }
    }
  }
  return best
}

/**
 * A plan with a leg long enough to measure easing and speed on. Whether any
 * one (seed, date) throws up a long leg is a draw, so this walks a fixed list
 * of seeds — deterministic, but not hostage to one lucky roll.
 */
const planWithLongLeg = (destination: Destination, mode: MovementMode): { plan: MovementPlan; leg: Leg } => {
  for (let i = 0; i < 20; i++) {
    const plan = createMovementPlan({ seed: `leg-${i}`, dateKey: '2026-09-18', destination, mode })
    const leg = longestLeg(plan)
    if (leg) return { plan, leg }
  }
  throw new Error(`no substantial moving leg for ${destination.id}/${mode} in 20 seeds`)
}

describe('planKey', () => {
  const base = { seed: 's', dateKey: '2026-09-18', destination: paris, mode: 'tourist' as MovementMode }

  it('is stable for identical inputs', () => {
    expect(planKey(base)).toBe(planKey({ ...base }))
    expect(planKey({ ...base, radiusMultiplier: 1, variant: 0 })).toBe(planKey(base))
  })

  it('changes when any input that matters changes', () => {
    const keys = new Set([
      planKey(base),
      planKey({ ...base, seed: 't' }),
      planKey({ ...base, dateKey: '2026-09-19' }),
      planKey({ ...base, destination: all[1] }),
      planKey({ ...base, mode: 'driving' }),
      planKey({ ...base, radiusMultiplier: 2 }),
      planKey({ ...base, variant: 1 }),
    ])
    expect(keys.size).toBe(7)
  })
})

describe('determinism', () => {
  it('builds byte-identical plans from identical inputs', () => {
    for (const destination of smallSample) {
      for (const mode of MODES) {
        for (const dateKey of ['2026-09-18', '2027-02-28']) {
          const options = { seed: 'determinism', dateKey, destination, mode }
          const a = createMovementPlan(options)
          const b = createMovementPlan({ ...options })
          expect(a, `${destination.id}/${mode}/${dateKey}`).toEqual(b)
          expect(a).not.toBe(b)
        }
      }
    }
  }, 60_000)

  it('resolves the same position for the same minute every time', () => {
    const plan = createMovementPlan({ seed: 'determinism', dateKey: '2026-09-18', destination: paris, mode: 'tourist' })
    for (let minute = 0; minute < MINUTES_PER_DAY; minute += 37) {
      expect(resolvePosition(plan, minute)).toEqual(resolvePosition(plan, minute))
    }
  })

  it('produces different days for different dates, modes, seeds and variants', () => {
    const base = { seed: 'v', dateKey: '2026-09-18', destination: paris, mode: 'tourist' as MovementMode }
    const signature = (p: MovementPlan): string =>
      p.waypoints.map((w) => `${w.minute}:${w.latitude.toFixed(5)}`).join('|')
    const signatures = new Set([
      signature(createMovementPlan(base)),
      signature(createMovementPlan({ ...base, dateKey: '2026-09-19' })),
      signature(createMovementPlan({ ...base, mode: 'driving' })),
      signature(createMovementPlan({ ...base, seed: 'w' })),
      signature(createMovementPlan({ ...base, variant: 1 })),
      signature(createMovementPlan({ ...base, radiusMultiplier: 0.4 })),
    ])
    expect(signatures.size).toBe(6)
  })
})

describe('plan shape', () => {
  it('spans exactly one day with strictly increasing waypoints', () => {
    const problems: string[] = []
    for (const destination of sample) {
      for (const mode of MODES) {
        for (const dateKey of DATES) {
          const plan = createMovementPlan({ seed: 'shape', dateKey, destination, mode })
          const label = `${destination.id}/${mode}/${dateKey}`
          if (plan.waypoints.length < 2) problems.push(`${label}: only ${plan.waypoints.length} waypoints`)
          if (plan.waypoints[0].minute !== 0) problems.push(`${label}: starts at ${plan.waypoints[0].minute}`)
          const last = plan.waypoints[plan.waypoints.length - 1]
          if (last.minute !== MINUTES_PER_DAY) problems.push(`${label}: ends at ${last.minute}`)
          for (let i = 1; i < plan.waypoints.length; i++) {
            if (!(plan.waypoints[i].minute > plan.waypoints[i - 1].minute)) {
              problems.push(`${label}: minute ${plan.waypoints[i].minute} does not follow ${plan.waypoints[i - 1].minute}`)
            }
          }
        }
      }
    }
    expect(problems.slice(0, 10)).toEqual([])
  }, 60_000)

  it('carries the inputs back out on the plan', () => {
    for (const mode of MODES) {
      const plan = createMovementPlan({ seed: 'echo', dateKey: '2026-09-18', destination: paris, mode })
      expect(plan.destination).toBe(paris)
      expect(plan.mode).toBe(mode)
      expect(plan.dateKey).toBe('2026-09-18')
    }
  })

  it('gives every waypoint finite coordinates and a label', () => {
    const problems: string[] = []
    for (const destination of sample) {
      for (const plan of plansFor(destination)) {
        for (const wp of plan.waypoints) {
          if (!Number.isFinite(wp.latitude) || !Number.isFinite(wp.longitude)) {
            problems.push(`${destination.id}/${plan.mode}: non-finite coordinate`)
          }
          if (typeof wp.label !== 'string' || wp.label.length === 0) {
            problems.push(`${destination.id}/${plan.mode}: empty label`)
          }
          if (typeof wp.dwell !== 'boolean') problems.push(`${destination.id}/${plan.mode}: dwell not boolean`)
        }
      }
    }
    expect(problems.slice(0, 10)).toEqual([])
  }, 60_000)

  it('contains a believable number of movement periods', () => {
    const problems: string[] = []
    for (const destination of sample) {
      for (const mode of MODES) {
        for (const dateKey of DATES) {
          const plan = createMovementPlan({ seed: 'periods', dateKey, destination, mode })
          const moving = plan.segments.filter((s) => s.moving).length
          if (moving < 2 || moving > 40) {
            problems.push(`${destination.id}/${mode}/${dateKey}: ${moving} movement periods`)
          }
        }
      }
    }
    expect(problems.slice(0, 10)).toEqual([])
  }, 60_000)

  it('covers real ground over the day, more so in the busier modes', () => {
    // `stationary` is allowed a quiet day; the rest have to go somewhere.
    const floors: Record<MovementMode, number> = {
      stationary: 0.05, walking: 1, tourist: 1, driving: 1,
    }
    const problems: string[] = []
    const totals: Record<string, number[]> = {}
    for (const destination of sample) {
      for (const mode of MODES) {
        for (const dateKey of DATES) {
          const plan = createMovementPlan({ seed: 'distance', dateKey, destination, mode })
          const total = plan.segments.reduce((sum, seg) => sum + seg.distanceKm, 0)
          ;(totals[mode] ??= []).push(total)
          if (total < floors[mode]) {
            problems.push(`${destination.id}/${mode}/${dateKey}: only ${total.toFixed(2)} km all day`)
          }
        }
      }
    }
    expect(problems.slice(0, 10)).toEqual([])
    const mean = (xs: number[]): number => xs.reduce((a, b) => a + b, 0) / xs.length
    expect(mean(totals.stationary)).toBeLessThan(mean(totals.tourist))
    expect(mean(totals.walking)).toBeLessThan(mean(totals.driving))
  }, 60_000)

  it('starts and ends the day parked at the same place', () => {
    for (const destination of smallSample) {
      for (const plan of plansFor(destination)) {
        const first = plan.waypoints[0]
        const last = plan.waypoints[plan.waypoints.length - 1]
        expect(first.dwell, `${destination.id}/${plan.mode}`).toBe(true)
        expect(last.dwell, `${destination.id}/${plan.mode}`).toBe(true)
        expect(haversineKm(first, last), `${destination.id}/${plan.mode}`).toBeLessThan(0.001)
      }
    }
  })

  it('derives segments that tile the whole day without gaps', () => {
    const problems: string[] = []
    for (const destination of smallSample) {
      for (const plan of plansFor(destination)) {
        const label = `${destination.id}/${plan.mode}`
        if (plan.segments.length !== plan.waypoints.length - 1) {
          problems.push(`${label}: ${plan.segments.length} segments for ${plan.waypoints.length} waypoints`)
          continue
        }
        if (plan.segments[0].startMinute !== 0) problems.push(`${label}: first segment starts at ${plan.segments[0].startMinute}`)
        if (plan.segments[plan.segments.length - 1].endMinute !== MINUTES_PER_DAY) {
          problems.push(`${label}: last segment ends at ${plan.segments[plan.segments.length - 1].endMinute}`)
        }
        plan.segments.forEach((s, i) => {
          if (s.startMinute !== plan.waypoints[i].minute) problems.push(`${label}/${i}: start does not match waypoint`)
          if (s.endMinute !== plan.waypoints[i + 1].minute) problems.push(`${label}/${i}: end does not match waypoint`)
          if (s.moving !== !plan.waypoints[i].dwell) problems.push(`${label}/${i}: moving flag disagrees with dwell`)
          if (s.label !== plan.waypoints[i].label) problems.push(`${label}/${i}: label disagrees with waypoint`)
          if (!(s.endMinute > s.startMinute)) problems.push(`${label}/${i}: zero-length segment`)
        })
      }
    }
    expect(problems.slice(0, 10)).toEqual([])
  })

  it('keeps segment distance and speed consistent with the waypoints', () => {
    const problems: string[] = []
    const close = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9
    for (const destination of smallSample) {
      for (const plan of plansFor(destination)) {
        plan.segments.forEach((s, i) => {
          const label = `${destination.id}/${plan.mode}/segment ${i}`
          if (!s.moving) {
            if (s.distanceKm !== 0 || s.speedKmh !== 0) problems.push(`${label}: parked but ${s.distanceKm} km at ${s.speedKmh} km/h`)
            return
          }
          const expected = haversineKm(plan.waypoints[i], plan.waypoints[i + 1])
          if (!close(s.distanceKm, expected)) problems.push(`${label}: distance ${s.distanceKm} vs ${expected}`)
          if (!close(s.speedKmh, (expected / (s.endMinute - s.startMinute)) * 60)) {
            problems.push(`${label}: speed ${s.speedKmh} does not match distance over duration`)
          }
        })
      }
    }
    expect(problems.slice(0, 10)).toEqual([])
  })

  it('builds a valid plan for every mode and a large sample of destinations', () => {
    let built = 0
    for (const destination of sample) {
      for (const mode of MODES) {
        for (const dateKey of DATES) {
          const plan = createMovementPlan({ seed: 'coverage', dateKey, destination, mode })
          expect(plan.waypoints.length, `${destination.id}/${mode}`).toBeGreaterThanOrEqual(2)
          built++
        }
      }
    }
    expect(built).toBeGreaterThan(1000)
  }, 60_000)

  it('shrinks the day when the radius multiplier shrinks', () => {
    const wander = (multiplier: number): number => {
      const plan = createMovementPlan({
        seed: 'radius', dateKey: '2026-09-18', destination: paris, mode: 'tourist', radiusMultiplier: multiplier,
      })
      return Math.max(...plan.waypoints.map((w) => haversineKm(paris, w)))
    }
    expect(wander(0.25)).toBeLessThan(wander(1))
    expect(wander(0.25)).toBeLessThanOrEqual(roamArea(paris, 0.25).radiusKm + 1e-6)
  })
})

describe('interpolation', () => {
  it('sits on a waypoint at that waypoint exact minute', () => {
    let worst = 0
    let worstLabel = ''
    for (const destination of smallSample) {
      for (const plan of plansFor(destination)) {
        plan.waypoints.forEach((wp, i) => {
          // Bend waypoints shape the route without anchoring the clock: with
          // easing spread over the whole journey, the marker reaches the bend
          // at the point of the journey where the *distance* falls, not where
          // the bend's own timestamp does.
          const isBend = !wp.dwell && i > 0 && !plan.waypoints[i - 1].dwell
          if (isBend) return
          const delta = haversineKm(wp, resolvePosition(plan, wp.minute))
          if (delta > worst) {
            worst = delta
            worstLabel = `${destination.id}/${plan.mode}@${wp.minute}`
          }
        })
      }
    }
    // A parked waypoint gets a few metres of deliberate GPS-style drift; a
    // moving one should be exact.
    expect(worst, worstLabel).toBeLessThan(0.015)
  }, 60_000)

  it('is exact at the start of a moving leg', () => {
    for (const destination of smallSample) {
      for (const plan of plansFor(destination)) {
        plan.waypoints.forEach((wp, i) => {
          if (wp.dwell || i === plan.waypoints.length - 1) return
          // The start of a journey, not a bend part-way through one.
          if (i > 0 && !plan.waypoints[i - 1].dwell) return
          const p = resolvePosition(plan, wp.minute)
          expect(haversineKm(wp, p), `${destination.id}/${plan.mode}@${wp.minute}`).toBeLessThan(1e-6)
        })
      }
    }
  })

  it('never jumps across a segment boundary', () => {
    let worst = 0
    let worstLabel = ''
    for (const destination of smallSample) {
      for (const plan of plansFor(destination)) {
        for (const wp of plan.waypoints.slice(1, -1)) {
          const jump = haversineKm(
            resolvePosition(plan, wp.minute - 0.01),
            resolvePosition(plan, wp.minute + 0.01),
          )
          if (jump > worst) {
            worst = jump
            worstLabel = `${destination.id}/${plan.mode}@${wp.minute}`
          }
        }
      }
    }
    // 20 m covers the phase change in the stationary-drift term at a boundary.
    expect(worst, worstLabel).toBeLessThan(0.02)
  }, 60_000)

  it('never teleports between one minute and the next', () => {
    let worst = 0
    let worstLabel = ''
    for (const destination of smallSample) {
      for (const plan of plansFor(destination)) {
        let previous = resolvePosition(plan, 0)
        for (let minute = 0.5; minute < MINUTES_PER_DAY; minute += 0.5) {
          const current = resolvePosition(plan, minute)
          const step = haversineKm(previous, current)
          if (step > worst) {
            worst = step
            worstLabel = `${destination.id}/${plan.mode}@${minute}`
          }
          previous = current
        }
      }
    }
    // Half a minute of travel at 50 km/h is 417 m; anything past that is a jump.
    expect(worst, worstLabel).toBeLessThan(0.45)
  }, 60_000)

  it('holds a dwell within a few tens of metres of its waypoint', () => {
    let worst = 0
    let worstLabel = ''
    for (const destination of smallSample) {
      for (const plan of plansFor(destination)) {
        plan.segments.forEach((s, i) => {
          if (s.moving) return
          const anchor = plan.waypoints[i]
          for (let minute = s.startMinute; minute < s.endMinute; minute += 1) {
            const delta = haversineKm(anchor, resolvePosition(plan, minute))
            if (delta > worst) {
              worst = delta
              worstLabel = `${destination.id}/${plan.mode}@${minute}`
            }
          }
        })
      }
    }
    expect(worst, worstLabel).toBeLessThan(0.03)
    // ...but it must not be frozen either: the marker should still breathe.
    const plan = createMovementPlan({ seed: 'breathe', dateKey: '2026-09-18', destination: paris, mode: 'tourist' })
    const dwellSegment = plan.segments.find((s) => !s.moving && s.endMinute - s.startMinute > 30)
    expect(dwellSegment).toBeDefined()
    const a = resolvePosition(plan, dwellSegment!.startMinute + 5)
    const b = resolvePosition(plan, dwellSegment!.startMinute + 25)
    expect(haversineKm(a, b)).toBeGreaterThan(0)
  }, 60_000)

  it('eases in and out of a leg rather than running at a constant pace', () => {
    const { plan, leg } = planWithLongLeg(paris, 'driving')
    // Distance travelled along the journey's own path, which is what easing
    // acts on — a straight line to the marker would undercount any bend.
    const progress = (fraction: number): number => {
      const span = leg.endMinute - leg.startMinute
      const steps = 800
      let walked = 0
      let previous = resolvePosition(plan, leg.startMinute)
      const until = leg.startMinute + span * fraction
      for (let k = 1; k <= steps; k++) {
        const minute = leg.startMinute + (span * k) / steps
        if (minute > until) break
        const here = resolvePosition(plan, minute)
        walked += haversineKm(previous, here)
        previous = here
      }
      return walked / leg.distanceKm
    }
    // Smoothstep: a quarter of the way through the time, less than a quarter
    // of the distance is done.
    expect(progress(0.25)).toBeLessThan(0.25)
    expect(progress(0.5)).toBeCloseTo(0.5, 1)
    expect(progress(0.75)).toBeGreaterThan(0.75)
  })
})

describe('live location fields', () => {
  it('reports heading only while moving, and always in range', () => {
    const problems: string[] = []
    for (const destination of smallSample) {
      for (const plan of plansFor(destination)) {
        for (let minute = 0; minute < MINUTES_PER_DAY; minute += 3) {
          const live = resolvePosition(plan, minute)
          const label = `${destination.id}/${plan.mode}@${minute}`
          if (live.moving) {
            if (live.heading === null) problems.push(`${label}: moving with null heading`)
            else if (!(live.heading >= 0 && live.heading < 360)) problems.push(`${label}: heading ${live.heading}`)
          } else {
            if (live.heading !== null) problems.push(`${label}: stationary with heading ${live.heading}`)
            if (live.speedKmh !== 0) problems.push(`${label}: stationary at ${live.speedKmh} km/h`)
          }
          if (!(live.accuracyMeters > 0 && live.accuracyMeters < 60)) {
            problems.push(`${label}: accuracy ${live.accuracyMeters}`)
          }
          if (live.statusLabel !== 'Now') problems.push(`${label}: status ${live.statusLabel}`)
          if (!Number.isFinite(live.latitude) || !Number.isFinite(live.longitude)) {
            problems.push(`${label}: non-finite position`)
          }
        }
      }
    }
    expect(problems.slice(0, 10)).toEqual([])
  }, 60_000)

  it('points the heading along the leg it is travelling', () => {
    const plan = createMovementPlan({ seed: 'heading', dateKey: '2026-09-18', destination: paris, mode: 'tourist' })
    plan.segments.forEach((s, i) => {
      if (!s.moving || s.distanceKm < 0.2) return
      const live = resolvePosition(plan, (s.startMinute + s.endMinute) / 2)
      const expected = bearingBetween(plan.waypoints[i], plan.waypoints[i + 1])
      // Measured by differencing the real output rather than read off the
      // chord, so it agrees with the marker to a hundredth of a degree rather
      // than exactly.
      expect(live.heading, `segment ${i}`).toBeCloseTo(expected, 1)
    })
  })

  it('echoes the minute it was asked about', () => {
    const plan = createMovementPlan({ seed: 'minute', dateKey: '2026-09-18', destination: paris, mode: 'tourist' })
    for (const minute of [0, 1, 123.4, 719.5, 1439.5]) {
      expect(resolvePosition(plan, minute).localMinuteOfDay).toBeCloseTo(minute, 6)
    }
  })

  it('clamps a minute outside the day instead of throwing', () => {
    const plan = createMovementPlan({ seed: 'clamp', dateKey: '2026-09-18', destination: paris, mode: 'tourist' })
    for (const minute of [-1, -100_000, MINUTES_PER_DAY, MINUTES_PER_DAY + 1, 99_999, NaN]) {
      expect(() => resolvePosition(plan, minute), `minute ${minute}`).not.toThrow()
    }
    expect(resolvePosition(plan, -5).localMinuteOfDay).toBe(0)
    expect(resolvePosition(plan, MINUTES_PER_DAY).localMinuteOfDay).toBeCloseTo(MINUTES_PER_DAY, 3)
    expect(resolvePosition(plan, MINUTES_PER_DAY + 500).localMinuteOfDay).toBeCloseTo(MINUTES_PER_DAY, 3)
  })

  it('joins the end of one day to the start of the next without a hitch', () => {
    const today = createMovementPlan({ seed: 'roll', dateKey: '2026-09-18', destination: paris, mode: 'tourist' })
    const tomorrow = createMovementPlan({ seed: 'roll', dateKey: '2026-09-19', destination: all[7], mode: 'tourist' })
    const lastMinute = resolvePosition(today, MINUTES_PER_DAY - 0.001)
    const firstMinute = resolvePosition(tomorrow, 0)
    for (const live of [lastMinute, firstMinute]) {
      expect(Number.isFinite(live.latitude)).toBe(true)
      expect(Number.isFinite(live.longitude)).toBe(true)
      expect(live.moving).toBe(false)
    }
    expect(haversineKm(today.waypoints[0], lastMinute)).toBeLessThan(0.03)
  })
})

describe('speed', () => {
  /**
   * The per-mode ceiling each profile implies. These are the average speeds
   * the plan is laid out with, plus headroom for the minute-rounding in
   * `travelMinutes` — not the peak the status card prints, which is checked
   * separately below.
   */
  const SEGMENT_CEILING: Record<MovementMode, number> = {
    stationary: 26,
    walking: 7,
    tourist: 32,
    driving: 42,
  }

  it('keeps every segment inside a plausible ceiling for its mode', () => {
    const problems: string[] = []
    const worst: Record<string, number> = {}
    for (const destination of sample) {
      for (const mode of MODES) {
        for (const dateKey of DATES) {
          const plan = createMovementPlan({ seed: 'speed', dateKey, destination, mode })
          for (const s of plan.segments) {
            if (!s.moving) continue
            worst[mode] = Math.max(worst[mode] ?? 0, s.speedKmh)
            if (s.speedKmh > SEGMENT_CEILING[mode]) {
              problems.push(`${destination.id}/${mode}/${dateKey}: ${s.speedKmh.toFixed(1)} km/h over ${s.distanceKm.toFixed(2)} km`)
            }
          }
        }
      }
    }
    expect(problems.slice(0, 10)).toEqual([])
    // A walking day must not read like a bus route.
    expect(worst.walking).toBeLessThan(worst.driving)
  }, 60_000)

  it('never reports a negative or non-finite speed', () => {
    const problems: string[] = []
    for (const destination of smallSample) {
      for (const plan of plansFor(destination)) {
        for (let minute = 0; minute < MINUTES_PER_DAY; minute += 2) {
          const { speedKmh } = resolvePosition(plan, minute)
          if (!Number.isFinite(speedKmh) || speedKmh < 0) {
            problems.push(`${destination.id}/${plan.mode}@${minute}: ${speedKmh}`)
          }
        }
      }
    }
    expect(problems.slice(0, 10)).toEqual([])
  }, 60_000)

  it('reaches zero at both ends of a leg and peaks in the middle', () => {
    const { plan, leg } = planWithLongLeg(paris, 'driving')
    const span = leg.endMinute - leg.startMinute
    const at = (fraction: number): number => resolvePosition(plan, leg.startMinute + span * fraction).speedKmh
    // Not an exact zero: the probe that measures speed reaches a hair past
    // the end of the journey, where the marker is already drifting in place.
    expect(at(0)).toBeLessThan(0.5)
    expect(at(0.5)).toBeGreaterThan(at(0.1))
    expect(at(0.5)).toBeGreaterThan(at(0.9))
    expect(at(0.999)).toBeLessThan(at(0.5))
  })
})

/*
 * ---------------------------------------------------------------------------
 * KNOWN BUG — see the report. Left failing on purpose.
 *
 * src/lib/movementEngine.ts, in resolvePosition:
 *
 *     const instantaneous = averageSpeed * (1.5 * 6 * t * (1 - t)) || 0
 *
 * The position is interpolated with smoothstep, S(t) = 3t^2 - 2t^3. Its
 * derivative is S'(t) = 6t(1 - t), which already peaks at 1.5 times the
 * average — that is what "easing means speed peaks in the middle" refers to.
 * Multiplying by a further literal 1.5 applies the peak twice, so the speed on
 * the status card is exactly 150% of the speed the marker is really moving at.
 *
 * The test below measures the true speed by finite differences of the
 * position, which is implementation-independent: whatever easing curve the
 * engine uses, the number it reports should be the number the dot is doing.
 * ---------------------------------------------------------------------------
 */
describe('KNOWN BUG: reported speed', () => {
  /** Central difference of the interpolated position, in km/h. */
  const trueSpeedKmh = (plan: MovementPlan, minute: number): number => {
    const dt = 0.01
    const before = resolvePosition(plan, minute - dt / 2)
    const after = resolvePosition(plan, minute + dt / 2)
    return haversineKm(before, after) / (dt / 60)
  }

  it('[KNOWN BUG] speedKmh matches the speed the marker is actually moving at', () => {
    const problems: string[] = []
    let worstRatio = 1
    for (const destination of all.filter((_, i) => i % 211 === 0)) {
      for (const mode of MODES) {
        const plan = createMovementPlan({ seed: 'truth', dateKey: '2026-09-18', destination, mode })
        for (const s of plan.segments) {
          if (!s.moving || s.endMinute - s.startMinute < 6 || s.distanceKm < 0.3) continue
          for (let minute = s.startMinute + 1; minute < s.endMinute - 1; minute += 1) {
            const measured = trueSpeedKmh(plan, minute)
            if (measured < 1) continue
            const ratio = resolvePosition(plan, minute).speedKmh / measured
            if (Math.abs(ratio - 1) > Math.abs(worstRatio - 1)) worstRatio = ratio
            if (Math.abs(ratio - 1) > 0.05) {
              problems.push(
                `${destination.id}/${mode}@${minute}: card says ${resolvePosition(plan, minute).speedKmh.toFixed(1)} km/h, marker is doing ${measured.toFixed(1)} km/h`)
            }
          }
        }
      }
    }
    expect(problems.slice(0, 5), `worst reported/true ratio ${worstRatio.toFixed(4)}`).toEqual([])
  }, 60_000)

  it('[KNOWN BUG] the mid-leg peak is 1.5x the segment average, as smoothstep implies', () => {
    const { plan, leg } = planWithLongLeg(paris, 'driving')
    const midpoint = (leg.startMinute + leg.endMinute) / 2
    // The marker itself does hit exactly 1.5x — the interpolation is right.
    expect(trueSpeedKmh(plan, midpoint) / leg.speedKmh).toBeCloseTo(1.5, 2)
    // The number the card prints should agree with it, and does not: it is 2.25x.
    expect(resolvePosition(plan, midpoint).speedKmh / leg.speedKmh).toBeCloseTo(1.5, 2)
  })
})
