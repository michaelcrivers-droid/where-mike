/**
 * Local developer overrides, via the URL-parameter path.
 *
 * `localStorage` does not exist in the node test environment. The module is
 * written to tolerate that (`typeof localStorage === 'undefined'` short-
 * circuits the read), which means `readOverrides(search)` here is exactly
 * defaults-plus-query — the layer worth testing adversarially, because it is
 * the one a stranger can put anything into.
 *
 * The search string is always passed in explicitly; nothing touches
 * `location`.
 */

import { describe, expect, it } from 'vitest'
import { DEFAULT_OVERRIDES, hasActiveOverrides, readOverrides, readStoredOverrides } from '@/lib/overrides'
import type { ControlOverrides, MovementMode } from '@/types'

const read = (search: string): ControlOverrides => readOverrides(search)

describe('defaults', () => {
  it('is the neutral, no-overrides state', () => {
    expect(DEFAULT_OVERRIDES).toEqual({
      dateOverride: null,
      seedOverride: null,
      destinationIdOverride: null,
      modeOverride: null,
      timeOfDayOverride: null,
      radiusMultiplier: 1,
      acceleratedDayMinutes: 0,
      planVariant: 0,
      debug: false,
      displayNameOverride: null,
    })
  })

  it('is what an empty search returns', () => {
    expect(read('')).toEqual(DEFAULT_OVERRIDES)
    expect(read('?')).toEqual(DEFAULT_OVERRIDES)
    expect(read('?unrelated=1&utm_source=x')).toEqual(DEFAULT_OVERRIDES)
  })

  it('is not the same object each call, so a caller cannot corrupt it', () => {
    const a = read('')
    a.radiusMultiplier = 99
    expect(read('').radiusMultiplier).toBe(1)
    expect(DEFAULT_OVERRIDES.radiusMultiplier).toBe(1)
  })

  it('matches readStoredOverrides when there is no storage', () => {
    // No localStorage in node, so the persisted layer is empty by definition.
    expect(readStoredOverrides()).toEqual(DEFAULT_OVERRIDES)
  })

  it('accepts a search string with or without the leading question mark', () => {
    expect(read('?date=2026-09-18').dateOverride).toBe('2026-09-18')
    expect(read('date=2026-09-18').dateOverride).toBe('2026-09-18')
  })
})

describe('date', () => {
  it('accepts a real date', () => {
    expect(read('?date=2026-09-18').dateOverride).toBe('2026-09-18')
    expect(read('?date=2024-02-29').dateOverride).toBe('2024-02-29')
    expect(read('?date=1970-01-01').dateOverride).toBe('1970-01-01')
  })

  it('rejects anything that is not a real date', () => {
    for (const value of [
      '2025-02-30', '2025-13-01', '2025-02-29', 'nonsense', '', '2025-1-1',
      'today', '2025/01/01', '2025-01-01T12:00', '99999-01-01',
    ]) {
      expect(read(`?date=${encodeURIComponent(value)}`).dateOverride, value).toBeNull()
    }
  })

  it('does not throw on a hostile value', () => {
    for (const value of ['%%%', '../../etc/passwd', '<script>', 'a'.repeat(5000)]) {
      expect(() => read(`?date=${encodeURIComponent(value)}`), value).not.toThrow()
    }
  })
})

describe('seed and city', () => {
  it('takes a trimmed seed', () => {
    expect(read('?seed=hello').seedOverride).toBe('hello')
    expect(read('?seed=%20%20spaced%20%20').seedOverride).toBe('spaced')
  })

  it('ignores an empty or whitespace-only seed', () => {
    expect(read('?seed=').seedOverride).toBeNull()
    expect(read('?seed=%20%20').seedOverride).toBeNull()
  })

  it('takes a trimmed city id without validating it here', () => {
    // Validation is the simulation layer's job: an unknown id falls back to
    // the daily draw rather than being rejected at parse time.
    expect(read('?city=fr-paris').destinationIdOverride).toBe('fr-paris')
    expect(read('?city=%20fr-paris%20').destinationIdOverride).toBe('fr-paris')
    expect(read('?city=made-up').destinationIdOverride).toBe('made-up')
    expect(read('?city=').destinationIdOverride).toBeNull()
  })
})

describe('mode', () => {
  it('accepts the four known modes', () => {
    for (const mode of ['stationary', 'walking', 'tourist', 'driving'] as MovementMode[]) {
      expect(read(`?mode=${mode}`).modeOverride, mode).toBe(mode)
    }
  })

  it('rejects anything else', () => {
    for (const value of ['teleport', 'TOURIST', 'Walking', '', 'flying', '1', 'null']) {
      expect(read(`?mode=${encodeURIComponent(value)}`).modeOverride, value).toBeNull()
    }
  })
})

describe('time', () => {
  it('parses a clock time', () => {
    expect(read('?time=00:00').timeOfDayOverride).toBe(0)
    expect(read('?time=0:00').timeOfDayOverride).toBe(0)
    expect(read('?time=09:30').timeOfDayOverride).toBe(570)
    expect(read('?time=9:30').timeOfDayOverride).toBe(570)
    expect(read('?time=12:00').timeOfDayOverride).toBe(720)
    expect(read('?time=23:59').timeOfDayOverride).toBe(1439)
  })

  it('parses a raw minute count', () => {
    expect(read('?time=0').timeOfDayOverride).toBe(0)
    expect(read('?time=720').timeOfDayOverride).toBe(720)
    expect(read('?time=1439').timeOfDayOverride).toBe(1439)
    expect(read('?time=1439.5').timeOfDayOverride).toBe(1439.5)
  })

  it('rejects out-of-range and malformed times rather than clamping them', () => {
    for (const value of [
      '24:00', '23:60', '25:70', '-1', '1440', '1440.1', '99999', 'abc',
      'noon', '12:0', '12:000', '1:2:3', 'NaN', 'Infinity', '-0:30',
    ]) {
      expect(read(`?time=${encodeURIComponent(value)}`).timeOfDayOverride, value).toBeNull()
    }
  })

  it('leaves the override alone for an empty value', () => {
    expect(read('?time=').timeOfDayOverride).toBeNull()
  })
})

describe('radius', () => {
  it('takes a plain multiplier', () => {
    expect(read('?radius=1').radiusMultiplier).toBe(1)
    expect(read('?radius=2.5').radiusMultiplier).toBe(2.5)
    expect(read('?radius=0.5').radiusMultiplier).toBe(0.5)
  })

  it('clamps to the documented 0.1 to 4 range', () => {
    expect(read('?radius=0').radiusMultiplier).toBe(0.1)
    expect(read('?radius=-100').radiusMultiplier).toBe(0.1)
    expect(read('?radius=0.001').radiusMultiplier).toBe(0.1)
    expect(read('?radius=4').radiusMultiplier).toBe(4)
    expect(read('?radius=999').radiusMultiplier).toBe(4)
    expect(read('?radius=1e9').radiusMultiplier).toBe(4)
  })

  it('falls back to the default for junk', () => {
    for (const value of ['abc', 'NaN', 'Infinity', '-Infinity', '1,5', '2px', '']) {
      expect(read(`?radius=${encodeURIComponent(value)}`).radiusMultiplier, value).toBe(1)
    }
  })

  it('never produces a value that would break roamArea', () => {
    for (const value of ['0', '-5', '999', 'abc', '0.1', '4']) {
      const multiplier = read(`?radius=${encodeURIComponent(value)}`).radiusMultiplier
      expect(Number.isFinite(multiplier), value).toBe(true)
      expect(multiplier, value).toBeGreaterThan(0)
      expect(multiplier, value).toBeLessThanOrEqual(4)
    }
  })
})

describe('accelerated day', () => {
  it('maps speed to the length of a simulated day', () => {
    // The documented example: ?speed=60 means a day goes by in 24 minutes.
    expect(read('?speed=60').acceleratedDayMinutes).toBe(24)
    expect(read('?speed=2').acceleratedDayMinutes).toBe(720)
    expect(read('?speed=24').acceleratedDayMinutes).toBe(60)
    expect(read('?speed=1440').acceleratedDayMinutes).toBe(1)
  })

  it('ignores a speed that is not an actual speed-up', () => {
    for (const value of ['1', '0', '0.5', '-60', 'abc', '', 'NaN']) {
      expect(read(`?speed=${encodeURIComponent(value)}`).acceleratedDayMinutes, value).toBe(0)
    }
  })

  it('floors an absurd speed at a quarter of a minute per day', () => {
    expect(read('?speed=99999').acceleratedDayMinutes).toBe(0.25)
    expect(read('?speed=1e12').acceleratedDayMinutes).toBe(0.25)
  })

  it('takes dayMinutes directly, and lets it win over speed', () => {
    expect(read('?dayMinutes=30').acceleratedDayMinutes).toBe(30)
    expect(read('?dayMinutes=0.1').acceleratedDayMinutes).toBe(0.25)
    expect(read('?dayMinutes=99999').acceleratedDayMinutes).toBe(1440)
    expect(read('?speed=60&dayMinutes=5').acceleratedDayMinutes).toBe(5)
  })

  it('ignores a nonsense dayMinutes', () => {
    for (const value of ['0', '-3', 'abc', '', 'NaN']) {
      expect(read(`?dayMinutes=${encodeURIComponent(value)}`).acceleratedDayMinutes, value).toBe(0)
    }
  })
})

describe('variant, debug and name', () => {
  it('takes a non-negative plan variant', () => {
    expect(read('?variant=0').planVariant).toBe(0)
    expect(read('?variant=3').planVariant).toBe(3)
    expect(read('?variant=-5').planVariant).toBe(0)
  })

  it('does not round a fractional variant, unlike the storage path', () => {
    // Worth pinning: `coerce` (the localStorage path) does
    // `Math.max(0, Math.round(v))`, but `readQuery` only does `Math.max(0, v)`.
    // A fractional variant is harmless — it just becomes part of the plan key —
    // but the two paths disagree, so `?variant=1.5` and a stored 1.5 give
    // different days.
    expect(read('?variant=1.5').planVariant).toBe(1.5)
    expect(read('?variant=0.4').planVariant).toBe(0.4)
  })

  it('ignores a non-numeric variant', () => {
    for (const value of ['abc', 'NaN', '', 'one']) {
      expect(read(`?variant=${encodeURIComponent(value)}`).planVariant, value).toBe(0)
    }
  })

  it('turns debug on only for the documented values', () => {
    expect(read('?debug=1').debug).toBe(true)
    expect(read('?debug=true').debug).toBe(true)
    for (const value of ['0', 'false', 'yes', 'TRUE', '', 'on']) {
      expect(read(`?debug=${encodeURIComponent(value)}`).debug, value).toBe(false)
    }
    expect(read('?debug').debug).toBe(false)
  })

  it('trims and caps the display name', () => {
    expect(read('?name=Mike').displayNameOverride).toBe('Mike')
    expect(read('?name=%20Mike%20').displayNameOverride).toBe('Mike')
    expect(read('?name=').displayNameOverride).toBeNull()
    expect(read('?name=%20%20').displayNameOverride).toBeNull()
    const long = read(`?name=${'x'.repeat(200)}`).displayNameOverride
    expect(long).toHaveLength(32)
  })
})

describe('combined and hostile inputs', () => {
  it('applies several overrides at once', () => {
    const o = read('?date=2026-12-25&seed=xmas&city=fr-paris&mode=walking&time=08:15&radius=2&variant=3&debug=1&name=Santa')
    expect(o).toEqual({
      dateOverride: '2026-12-25',
      seedOverride: 'xmas',
      destinationIdOverride: 'fr-paris',
      modeOverride: 'walking',
      timeOfDayOverride: 495,
      radiusMultiplier: 2,
      acceleratedDayMinutes: 0,
      planVariant: 3,
      debug: true,
      displayNameOverride: 'Santa',
    })
  })

  it('keeps every field of the right type whatever the input', () => {
    const searches = [
      '', '?', '?date=&seed=&city=&mode=&time=&radius=&speed=&variant=&debug=&name=',
      '?date=junk&radius=junk&time=junk&speed=junk&variant=junk&dayMinutes=junk',
      '?radius=NaN&time=Infinity&speed=-Infinity&variant=NaN',
      '?date=2026-02-30&mode=teleport&time=99:99',
      `?${'a=1&'.repeat(500)}`,
      '?date=2026-09-18&date=2026-09-19',
      '?radius=2&radius=abc',
      '?time=%00%01%02',
      '?name=%F0%9F%8C%8D%F0%9F%8C%8E%F0%9F%8C%8F',
    ]
    for (const search of searches) {
      const o = read(search)
      const label = JSON.stringify(search).slice(0, 60)
      expect(typeof o.radiusMultiplier, label).toBe('number')
      expect(Number.isFinite(o.radiusMultiplier), label).toBe(true)
      expect(typeof o.acceleratedDayMinutes, label).toBe('number')
      expect(Number.isFinite(o.acceleratedDayMinutes), label).toBe(true)
      expect(typeof o.planVariant, label).toBe('number')
      expect(Number.isFinite(o.planVariant), label).toBe(true)
      expect(typeof o.debug, label).toBe('boolean')
      expect(o.dateOverride === null || typeof o.dateOverride === 'string', label).toBe(true)
      expect(o.timeOfDayOverride === null || Number.isFinite(o.timeOfDayOverride), label).toBe(true)
      expect(Object.keys(o).sort(), label).toEqual(Object.keys(DEFAULT_OVERRIDES).sort())
    }
  })

  it('never throws, whatever it is handed', () => {
    for (const search of ['?%', '?a=%', '?=', '?&&&', '?a', '?a=b=c', '?' + '%FF'.repeat(100)]) {
      expect(() => read(search), JSON.stringify(search)).not.toThrow()
    }
  })

  it('takes the first value when a parameter is repeated', () => {
    expect(read('?date=2026-09-18&date=2026-09-19').dateOverride).toBe('2026-09-18')
    expect(read('?radius=2&radius=3').radiusMultiplier).toBe(2)
  })
})

describe('hasActiveOverrides', () => {
  it('is false for the defaults', () => {
    expect(hasActiveOverrides(DEFAULT_OVERRIDES)).toBe(false)
    expect(hasActiveOverrides(read(''))).toBe(false)
    expect(hasActiveOverrides(read('?unknown=1'))).toBe(false)
  })

  it('is true as soon as any single field moves', () => {
    const searches = [
      '?date=2026-09-18', '?seed=x', '?city=fr-paris', '?mode=walking',
      '?time=12:00', '?radius=2', '?speed=60', '?dayMinutes=10',
      '?variant=1', '?debug=1', '?name=Mike',
    ]
    for (const search of searches) {
      expect(hasActiveOverrides(read(search)), search).toBe(true)
    }
  })

  it('is false when a parameter is present but rejected', () => {
    expect(hasActiveOverrides(read('?date=2026-02-30'))).toBe(false)
    expect(hasActiveOverrides(read('?mode=teleport'))).toBe(false)
    expect(hasActiveOverrides(read('?radius=abc'))).toBe(false)
  })

  it('notices a time override of zero, which is falsy but not the default', () => {
    expect(hasActiveOverrides(read('?time=0'))).toBe(true)
    expect(hasActiveOverrides(read('?time=00:00'))).toBe(true)
  })
})
