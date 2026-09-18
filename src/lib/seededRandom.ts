/**
 * Deterministic pseudorandom numbers.
 *
 * Nothing that has to look the same in two browsers may use Math.random().
 * Every draw in this app — the day's city, the day's waypoints, the jitter
 * while standing still — comes from a generator seeded with a string, so the
 * same string always replays the same sequence.
 */

/** xmur3: string -> well-mixed 32-bit seed. */
export function hashString(input: string): number {
  let h = 1779033703 ^ input.length
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507)
  h = Math.imul(h ^ (h >>> 13), 3266489909)
  return (h ^= h >>> 16) >>> 0
}

export interface Rng {
  /** Uniform float in [0, 1). */
  next(): number
  /** Uniform float in [min, max). */
  range(min: number, max: number): number
  /** Uniform integer in [min, max], inclusive. */
  int(min: number, max: number): number
  /** Uniform element of a non-empty array. */
  pick<T>(items: readonly T[]): T
  /** True with probability `p`. */
  chance(p: number): boolean
  /** Roughly normal, mean 0, standard deviation 1, clamped to ±3. */
  gaussian(): number
}

/**
 * mulberry32 — small, fast, and statistically fine for cosmetic randomness.
 * Full period 2^32, which is far more than a lifetime of daily draws needs.
 */
export function createRng(seed: string | number): Rng {
  let state = (typeof seed === 'string' ? hashString(seed) : seed >>> 0) || 0x9e3779b9

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  return {
    next,
    range: (min, max) => min + next() * (max - min),
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: <T,>(items: readonly T[]): T => items[Math.floor(next() * items.length)],
    chance: (p) => next() < p,
    gaussian() {
      // Irwin–Hall with n = 6: cheap, bounded, and plenty normal enough for
      // nudging dwell times around.
      let sum = 0
      for (let i = 0; i < 6; i++) sum += next()
      return Math.max(-3, Math.min(3, (sum - 3) * 1.4142))
    },
  }
}

/**
 * Fisher–Yates, driven by an Rng. Returns a new array; the input is untouched.
 */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
