/**
 * seededRandom — the determinism floor of the whole app.
 *
 * If anything here is non-reproducible then every downstream guarantee (same
 * city for every viewer, same dot at the same second) collapses, so these
 * tests are paranoid about replay and about the exact bounds each helper
 * advertises.
 */

import { describe, expect, it } from 'vitest'
import { createRng, hashString, shuffle } from '@/lib/seededRandom'

const draw = (seed: string | number, n: number): number[] => {
  const rng = createRng(seed)
  return Array.from({ length: n }, () => rng.next())
}

describe('hashString', () => {
  it('is a pure function of the input', () => {
    for (const s of ['', 'a', 'wheremike-v1-8f3a92', 'accented Uni code', '2026-09-18|fr-paris|3']) {
      expect(hashString(s)).toBe(hashString(s))
    }
  })

  it('always returns a uint32', () => {
    for (const s of ['', 'a', 'b', 'zzzzzzzzzzzzzzzz', 'x'.repeat(5000)]) {
      const h = hashString(s)
      expect(Number.isInteger(h)).toBe(true)
      expect(h).toBeGreaterThanOrEqual(0)
      expect(h).toBeLessThanOrEqual(0xffffffff)
    }
  })

  it('separates similar inputs', () => {
    // Adjacent ids are used as plan seeds and as the stationary-drift phase,
    // so near-neighbours colliding would show up as visibly identical days.
    const inputs = Array.from({ length: 4000 }, (_, i) => `2026-09-18|dest-${i}`)
    expect(new Set(inputs.map(hashString)).size).toBeGreaterThan(inputs.length * 0.99)
    expect(hashString('a')).not.toBe(hashString('b'))
    expect(hashString('ab')).not.toBe(hashString('ba'))
  })
})

describe('createRng', () => {
  it('replays the same sequence for the same seed', () => {
    expect(draw('seed-a', 64)).toEqual(draw('seed-a', 64))
    expect(draw(12345, 64)).toEqual(draw(12345, 64))
  })

  it('diverges for different seeds', () => {
    const a = draw('seed-a', 64)
    const b = draw('seed-b', 64)
    expect(a).not.toEqual(b)
    expect(a.filter((x, i) => x === b[i]).length).toBe(0)
  })

  it('seeds a string through hashString', () => {
    expect(draw('abc', 8)).toEqual(draw(hashString('abc'), 8))
  })

  it('falls back to a fixed constant for a zero seed', () => {
    // `(seed >>> 0) || 0x9e3779b9` — zero would otherwise degenerate.
    expect(draw(0, 8)).toEqual(draw(0x9e3779b9, 8))
  })

  it('keeps next() inside [0, 1) and uses the whole interval', () => {
    const rng = createRng('bounds')
    let min = Infinity
    let max = -Infinity
    let outOfRange = 0
    for (let i = 0; i < 200_000; i++) {
      const v = rng.next()
      if (!(v >= 0 && v < 1)) outOfRange++
      if (v < min) min = v
      if (v > max) max = v
    }
    expect(outOfRange).toBe(0)
    // A generator stuck in a narrow band would still satisfy the bounds above.
    expect(min).toBeLessThan(0.001)
    expect(max).toBeGreaterThan(0.999)
  }, 60_000)

  it('is roughly uniform across deciles', () => {
    const rng = createRng('uniform')
    const buckets = new Array(10).fill(0)
    const n = 200_000
    for (let i = 0; i < n; i++) buckets[Math.floor(rng.next() * 10)]++
    for (const count of buckets) {
      expect(count).toBeGreaterThan((n / 10) * 0.94)
      expect(count).toBeLessThan((n / 10) * 1.06)
    }
  }, 60_000)

  it('does not fall into a short cycle', () => {
    const rng = createRng('period')
    const seen = new Set<number>()
    for (let i = 0; i < 100_000; i++) seen.add(rng.next())
    expect(seen.size).toBeGreaterThan(99_000)
  }, 60_000)

  it('range() stays within [min, max)', () => {
    const rng = createRng('range')
    let outOfRange = 0
    for (let i = 0; i < 50_000; i++) {
      const v = rng.range(-3.5, 7.25)
      if (!(v >= -3.5 && v < 7.25)) outOfRange++
    }
    expect(outOfRange).toBe(0)
    expect(createRng('deg').range(5, 5)).toBe(5)
  })

  it('int() is inclusive at both ends and never escapes them', () => {
    const rng = createRng('int')
    let sawMin = false
    let sawMax = false
    let bad = 0
    for (let i = 0; i < 50_000; i++) {
      const v = rng.int(3, 9)
      if (!Number.isInteger(v) || v < 3 || v > 9) bad++
      if (v === 3) sawMin = true
      if (v === 9) sawMax = true
    }
    expect(bad).toBe(0)
    expect(sawMin).toBe(true)
    expect(sawMax).toBe(true)
    expect(createRng('one').int(4, 4)).toBe(4)
  })

  it('int() handles a wholly negative range', () => {
    const rng = createRng('negint')
    let bad = 0
    for (let i = 0; i < 10_000; i++) {
      const v = rng.int(-5, -1)
      if (v < -5 || v > -1) bad++
    }
    expect(bad).toBe(0)
  })

  it('pick() only returns members, and reaches every one', () => {
    const items = ['a', 'b', 'c', 'd', 'e'] as const
    const rng = createRng('pick')
    const seen = new Set<string>()
    for (let i = 0; i < 5_000; i++) seen.add(rng.pick(items))
    expect([...seen].sort()).toEqual([...items].sort())
    expect(createRng('solo').pick(['only'])).toBe('only')
  })

  it('chance() honours its probability, including the degenerate ends', () => {
    const rng = createRng('chance')
    let hits = 0
    const n = 100_000
    for (let i = 0; i < n; i++) if (rng.chance(0.25)) hits++
    expect(hits / n).toBeGreaterThan(0.24)
    expect(hits / n).toBeLessThan(0.26)
    const edges = createRng('edges')
    let zeroHits = 0
    let oneMisses = 0
    for (let i = 0; i < 1_000; i++) {
      if (edges.chance(0)) zeroHits++
      if (!edges.chance(1)) oneMisses++
    }
    expect(zeroHits).toBe(0)
    expect(oneMisses).toBe(0)
  })

  it('gaussian() is centred, clamped and spread as documented', () => {
    const rng = createRng('gauss')
    const n = 100_000
    let sum = 0
    let sumSq = 0
    let unclamped = 0
    for (let i = 0; i < n; i++) {
      const v = rng.gaussian()
      if (v < -3 || v > 3) unclamped++
      sum += v
      sumSq += v * v
    }
    expect(unclamped).toBe(0)
    const mean = sum / n
    const sd = Math.sqrt(sumSq / n - mean * mean)
    expect(Math.abs(mean)).toBeLessThan(0.02)
    expect(sd).toBeGreaterThan(0.9)
    expect(sd).toBeLessThan(1.1)
  }, 60_000)
})

describe('shuffle', () => {
  const source = Array.from({ length: 200 }, (_, i) => i)

  it('returns a permutation and leaves the input untouched', () => {
    const input = source.slice()
    const out = shuffle(input, createRng('shuffle'))
    expect(input).toEqual(source)
    expect(out).not.toBe(input)
    expect(out.slice().sort((a, b) => a - b)).toEqual(source)
  })

  it('is deterministic for a given seed and differs across seeds', () => {
    expect(shuffle(source, createRng('s1'))).toEqual(shuffle(source, createRng('s1')))
    expect(shuffle(source, createRng('s1'))).not.toEqual(shuffle(source, createRng('s2')))
  })

  it('actually reorders', () => {
    const fixedPoints = shuffle(source, createRng('reorder')).filter((v, i) => v === i).length
    // The expected number of fixed points in a uniform shuffle is 1, whatever
    // the length, so anything in double figures means it barely moved.
    expect(fixedPoints).toBeLessThan(10)
  })

  it('handles degenerate inputs', () => {
    expect(shuffle([], createRng('e'))).toEqual([])
    expect(shuffle(['x'], createRng('e'))).toEqual(['x'])
  })

  it('reaches every position over many seeds', () => {
    const positionsOfZero = new Set<number>()
    for (let s = 0; s < 400; s++) {
      positionsOfZero.add(shuffle([0, 1, 2, 3, 4], createRng(`seed${s}`)).indexOf(0))
    }
    expect(positionsOfZero.size).toBe(5)
  })
})
