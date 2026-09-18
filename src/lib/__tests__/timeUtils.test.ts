/**
 * timeUtils — calendars, clocks and the day-number index the draw is built on.
 *
 * Every instant in here is constructed explicitly. Nothing reads the wall
 * clock, so the suite gives the same answer on any machine at any time. The
 * few assertions that involve the *viewer's* zone are written as differences
 * between two zones, which is invariant to where the test runs.
 */

import { describe, expect, it } from 'vitest'
import {
  MINUTES_PER_DAY,
  MS_PER_DAY,
  addDays,
  dateKeyInZone,
  dateKeyToDayNumber,
  dayNumberToDateKey,
  formatClock,
  formatMinuteOfDay,
  hoursAheadOfViewer,
  isValidDateKey,
  localDateKey,
  minuteOfDayInZone,
  timeOfDayLabel,
  utcDateKey,
  utcOffsetLabel,
  zonedParts,
} from '@/lib/timeUtils'

describe('constants', () => {
  it('are the real numbers, not approximations', () => {
    expect(MINUTES_PER_DAY).toBe(1440)
    expect(MS_PER_DAY).toBe(86_400_000)
    expect(MS_PER_DAY).toBe(MINUTES_PER_DAY * 60 * 1000)
  })
})

describe('isValidDateKey', () => {
  it('accepts well-formed real dates', () => {
    for (const key of [
      '1970-01-01', '2000-02-29', '2024-02-29', '2025-12-31', '2026-09-18',
      '1900-03-01', '9999-12-31', '2026-01-01',
    ]) {
      expect(isValidDateKey(key), key).toBe(true)
    }
  })

  it('rejects dates that do not exist', () => {
    for (const key of [
      '2025-02-30', '2025-02-29', '1900-02-29', '2025-04-31', '2025-06-31',
      '2025-11-31', '2025-13-01', '2025-00-10', '2025-01-32', '2025-01-00',
    ]) {
      expect(isValidDateKey(key), key).toBe(false)
    }
  })

  it('rejects anything that is not exactly YYYY-MM-DD', () => {
    for (const key of [
      'nonsense', '', '2025-1-01', '2025-01-1', '25-01-01', '2025/01/01',
      '2025-01-01T00:00:00Z', ' 2025-01-01', '2025-01-01 ', '10000-01-01',
      '202a-01-01', '2025-01-0a', '-2025-01-01',
    ]) {
      expect(isValidDateKey(key), JSON.stringify(key)).toBe(false)
    }
  })

  it('agrees with a full leap-year sweep', () => {
    const isLeap = (y: number): boolean => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
    for (const year of [1896, 1900, 1996, 2000, 2024, 2025, 2100, 2400]) {
      const key = `${year}-02-29`
      expect(isValidDateKey(key), key).toBe(isLeap(year))
    }
  })
})

describe('dateKeyToDayNumber / dayNumberToDateKey', () => {
  it('anchors on the epoch', () => {
    expect(dateKeyToDayNumber('1970-01-01')).toBe(0)
    expect(dayNumberToDateKey(0)).toBe('1970-01-01')
    expect(dateKeyToDayNumber('1970-01-02')).toBe(1)
    expect(dateKeyToDayNumber('1969-12-31')).toBe(-1)
    expect(dayNumberToDateKey(-1)).toBe('1969-12-31')
    expect(dateKeyToDayNumber('2000-01-01')).toBe(10_957)
    expect(dayNumberToDateKey(10_957)).toBe('2000-01-01')
  })

  it('round-trips densely across four decades either side of the epoch', () => {
    // -25000 to +25000 spans 1901-06 to 2038-06, which is where the product
    // actually lives; the sparse sweep below covers the far ends.
    const broken: number[] = []
    for (let n = -25_000; n <= 25_000; n++) {
      if (dateKeyToDayNumber(dayNumberToDateKey(n)) !== n) broken.push(n)
    }
    expect(broken).toEqual([])
  }, 60_000)

  it('round-trips sparsely from the year 1000 to the year 9999', () => {
    // Below the year 100 Date.UTC reinterprets the year as 19xx, and above
    // 9999 toISOString switches to the expanded six-digit form, so those are
    // outside the supported window by construction.
    const broken: string[] = []
    for (let n = -353_000; n <= 2_932_000; n += 9_973) {
      const key = dayNumberToDateKey(n)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || dateKeyToDayNumber(key) !== n) broken.push(`${n} -> ${key}`)
    }
    expect(broken).toEqual([])
  }, 60_000)

  it('round-trips date keys, not just day numbers', () => {
    for (const key of [
      '1900-01-01', '1969-12-31', '1970-01-01', '1999-12-31', '2000-01-01',
      '2000-02-29', '2024-02-29', '2026-09-18', '2027-10-12', '2100-02-28',
      '2400-02-29', '9999-12-31',
    ]) {
      expect(dayNumberToDateKey(dateKeyToDayNumber(key)), key).toBe(key)
    }
  })

  it('is monotonic', () => {
    let previous = dateKeyToDayNumber('2025-12-20')
    for (let i = 1; i <= 60; i++) {
      const next = dateKeyToDayNumber(addDays('2025-12-20', i))
      expect(next).toBe(previous + 1)
      previous = next
    }
  })

  it('handles the leap day and the day either side of it', () => {
    expect(dateKeyToDayNumber('2024-03-01') - dateKeyToDayNumber('2024-02-28')).toBe(2)
    expect(dateKeyToDayNumber('2025-03-01') - dateKeyToDayNumber('2025-02-28')).toBe(1)
  })
})

describe('addDays', () => {
  it('crosses month ends', () => {
    expect(addDays('2025-01-31', 1)).toBe('2025-02-01')
    expect(addDays('2025-02-28', 1)).toBe('2025-03-01')
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29')
    expect(addDays('2024-02-29', 1)).toBe('2024-03-01')
    expect(addDays('2025-04-30', 1)).toBe('2025-05-01')
  })

  it('crosses year ends in both directions', () => {
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
    expect(addDays('1970-01-01', -1)).toBe('1969-12-31')
    expect(addDays('1969-12-31', 1)).toBe('1970-01-01')
  })

  it('handles zero, large and negative offsets', () => {
    expect(addDays('2026-09-18', 0)).toBe('2026-09-18')
    expect(addDays('2026-09-18', 365)).toBe('2027-09-18')
    expect(addDays('2024-09-18', 366)).toBe('2025-09-19')
    expect(addDays('2026-09-18', -365)).toBe('2025-09-18')
    expect(addDays(addDays('2026-09-18', 1234), -1234)).toBe('2026-09-18')
  })

  it('composes', () => {
    let key = '2025-11-27'
    for (let i = 0; i < 400; i++) key = addDays(key, 1)
    expect(key).toBe(addDays('2025-11-27', 400))
  })
})

describe('formatMinuteOfDay', () => {
  it('gets the midnight and noon boundaries right', () => {
    expect(formatMinuteOfDay(0)).toBe('12:00 AM')
    expect(formatMinuteOfDay(1)).toBe('12:01 AM')
    expect(formatMinuteOfDay(719)).toBe('11:59 AM')
    expect(formatMinuteOfDay(720)).toBe('12:00 PM')
    expect(formatMinuteOfDay(721)).toBe('12:01 PM')
    expect(formatMinuteOfDay(1439)).toBe('11:59 PM')
  })

  it('formats ordinary times', () => {
    expect(formatMinuteOfDay(16 * 60 + 12)).toBe('4:12 PM')
    expect(formatMinuteOfDay(9 * 60 + 5)).toBe('9:05 AM')
    expect(formatMinuteOfDay(13 * 60)).toBe('1:00 PM')
  })

  it('supports the 24-hour form', () => {
    expect(formatMinuteOfDay(0, false)).toBe('00:00')
    expect(formatMinuteOfDay(719, false)).toBe('11:59')
    expect(formatMinuteOfDay(720, false)).toBe('12:00')
    expect(formatMinuteOfDay(1439, false)).toBe('23:59')
    expect(formatMinuteOfDay(16 * 60 + 12, false)).toBe('16:12')
  })

  it('wraps out-of-range minutes instead of producing nonsense', () => {
    expect(formatMinuteOfDay(1440)).toBe('12:00 AM')
    expect(formatMinuteOfDay(1441)).toBe('12:01 AM')
    expect(formatMinuteOfDay(-1)).toBe('11:59 PM')
    expect(formatMinuteOfDay(-1440)).toBe('12:00 AM')
  })

  it('floors fractional minutes', () => {
    expect(formatMinuteOfDay(719.99)).toBe('11:59 AM')
    expect(formatMinuteOfDay(720.5)).toBe('12:00 PM')
    expect(formatMinuteOfDay(1439.999)).toBe('11:59 PM')
  })

  it('never emits a zero or a 13-plus hour in 12-hour mode', () => {
    for (let m = 0; m < MINUTES_PER_DAY; m++) {
      const text = formatMinuteOfDay(m)
      const hour = Number(text.split(':')[0])
      expect(hour, `minute ${m} -> ${text}`).toBeGreaterThanOrEqual(1)
      expect(hour, `minute ${m} -> ${text}`).toBeLessThanOrEqual(12)
      expect(text.endsWith(m < 720 ? 'AM' : 'PM'), `minute ${m} -> ${text}`).toBe(true)
    }
  }, 60_000)
})

describe('timeOfDayLabel', () => {
  it('switches on the documented hour boundaries', () => {
    const cases: Array<[number, string]> = [
      [0, 'Late night'], [4 * 60 + 59, 'Late night'],
      [5 * 60, 'Morning'], [11 * 60 + 59, 'Morning'],
      [12 * 60, 'Afternoon'], [16 * 60 + 59, 'Afternoon'],
      [17 * 60, 'Evening'], [20 * 60 + 59, 'Evening'],
      [21 * 60, 'Night'], [1439, 'Night'],
    ]
    for (const [minute, expected] of cases) {
      expect(timeOfDayLabel(minute), `minute ${minute}`).toBe(expected)
    }
  })

  it('returns one of the five labels for every minute of the day', () => {
    const labels = new Set<string>()
    for (let m = 0; m < MINUTES_PER_DAY; m += 0.5) labels.add(timeOfDayLabel(m))
    expect([...labels].sort()).toEqual(['Afternoon', 'Evening', 'Late night', 'Morning', 'Night'])
  })
})

describe('zonedParts', () => {
  it('breaks a known instant down correctly in several zones', () => {
    const instant = new Date('2026-06-15T12:34:56Z')
    expect(zonedParts(instant, 'UTC')).toEqual({ year: 2026, month: 6, day: 15, hour: 12, minute: 34, second: 56 })
    // Tokyo is a flat +9 with no daylight saving.
    expect(zonedParts(instant, 'Asia/Tokyo')).toEqual({ year: 2026, month: 6, day: 15, hour: 21, minute: 34, second: 56 })
    // Kiritimati is +14, so it is already the next day.
    expect(zonedParts(instant, 'Pacific/Kiritimati').day).toBe(16)
    // Niue is -11, so it is still the previous day.
    expect(zonedParts(instant, 'Pacific/Niue').day).toBe(15)
    expect(zonedParts(instant, 'Pacific/Niue').hour).toBe(1)
  })

  it('reports midnight as hour 0, not hour 24', () => {
    const midnight = new Date('2026-06-15T00:00:00Z')
    expect(zonedParts(midnight, 'UTC').hour).toBe(0)
    expect(zonedParts(midnight, 'UTC').day).toBe(15)
    // The same instant is 9am in Tokyo; step back nine hours for Tokyo midnight.
    expect(zonedParts(new Date('2026-06-14T15:00:00Z'), 'Asia/Tokyo')).toEqual({
      year: 2026, month: 6, day: 15, hour: 0, minute: 0, second: 0,
    })
  })

  it('follows daylight saving', () => {
    // 2026-01-15 is winter in Paris (+1); 2026-07-15 is summer (+2).
    expect(zonedParts(new Date('2026-01-15T12:00:00Z'), 'Europe/Paris').hour).toBe(13)
    expect(zonedParts(new Date('2026-07-15T12:00:00Z'), 'Europe/Paris').hour).toBe(14)
  })

  it('degrades to UTC for an unknown zone instead of throwing', () => {
    const instant = new Date('2026-06-15T12:34:56Z')
    expect(() => zonedParts(instant, 'Mars/Olympus_Mons')).not.toThrow()
    expect(zonedParts(instant, 'Mars/Olympus_Mons')).toEqual(zonedParts(instant, 'UTC'))
    expect(zonedParts(instant, '')).toEqual(zonedParts(instant, 'UTC'))
  })
})

describe('dateKeyInZone / minuteOfDayInZone', () => {
  it('agrees with zonedParts', () => {
    const instant = new Date('2026-06-15T12:34:56Z')
    expect(dateKeyInZone(instant, 'UTC')).toBe('2026-06-15')
    expect(dateKeyInZone(instant, 'Pacific/Kiritimati')).toBe('2026-06-16')
    expect(dateKeyInZone(instant, 'Pacific/Niue')).toBe('2026-06-15')
    expect(minuteOfDayInZone(instant, 'UTC')).toBeCloseTo(12 * 60 + 34 + 56 / 60, 9)
    expect(minuteOfDayInZone(instant, 'Asia/Tokyo')).toBeCloseTo(21 * 60 + 34 + 56 / 60, 9)
  })

  it('zero-pads the date key', () => {
    expect(dateKeyInZone(new Date('2026-01-05T12:00:00Z'), 'UTC')).toBe('2026-01-05')
    expect(isValidDateKey(dateKeyInZone(new Date('2026-01-05T12:00:00Z'), 'UTC'))).toBe(true)
  })

  it('stays inside [0, 1440) for every hour of a day, in every sampled zone', () => {
    const zones = ['UTC', 'Asia/Tokyo', 'Europe/Paris', 'America/New_York', 'Pacific/Kiritimati', 'Asia/Kathmandu']
    for (const zone of zones) {
      for (let h = 0; h < 24; h++) {
        const minute = minuteOfDayInZone(new Date(Date.UTC(2026, 5, 15, h, 30)), zone)
        expect(minute, `${zone} @${h}`).toBeGreaterThanOrEqual(0)
        expect(minute, `${zone} @${h}`).toBeLessThan(MINUTES_PER_DAY)
      }
    }
  })

  it('handles a half-hour and a three-quarter-hour offset', () => {
    const instant = new Date('2026-06-15T12:00:00Z')
    // India is +5:30, Nepal +5:45.
    expect(minuteOfDayInZone(instant, 'Asia/Kolkata')).toBeCloseTo(17 * 60 + 30, 6)
    expect(minuteOfDayInZone(instant, 'Asia/Kathmandu')).toBeCloseTo(17 * 60 + 45, 6)
  })
})

describe('localDateKey / utcDateKey', () => {
  it('reads a locally-constructed date in the local calendar', () => {
    // Built from local components, so this is 2026-09-18 wherever it runs.
    expect(localDateKey(new Date(2026, 8, 18, 12, 0, 0))).toBe('2026-09-18')
    expect(localDateKey(new Date(2026, 0, 5, 0, 0, 1))).toBe('2026-01-05')
    expect(localDateKey(new Date(2026, 11, 31, 23, 59, 59))).toBe('2026-12-31')
  })

  it('reads an instant in the UTC calendar', () => {
    expect(utcDateKey(new Date('2026-09-18T23:59:59Z'))).toBe('2026-09-18')
    expect(utcDateKey(new Date('2026-09-19T00:00:00Z'))).toBe('2026-09-19')
  })

  it('always produces a valid, round-trippable key', () => {
    for (let i = 0; i < 400; i += 7) {
      const local = localDateKey(new Date(2026, 0, 1 + i, 9, 30))
      expect(isValidDateKey(local), local).toBe(true)
      expect(dayNumberToDateKey(dateKeyToDayNumber(local))).toBe(local)
    }
  })
})

describe('formatClock', () => {
  it('formats the destination clock', () => {
    const instant = new Date('2026-06-15T12:00:00Z')
    expect(formatClock(instant, 'UTC')).toBe('12:00 PM')
    expect(formatClock(instant, 'Asia/Tokyo')).toBe('9:00 PM')
    expect(formatClock(new Date('2026-06-15T16:12:00Z'), 'UTC')).toBe('4:12 PM')
  })

  it('supports 24-hour output', () => {
    expect(formatClock(new Date('2026-06-15T16:12:00Z'), 'UTC', false)).toBe('16:12')
    expect(formatClock(new Date('2026-06-15T00:05:00Z'), 'UTC', false)).toBe('00:05')
  })

  it('returns a placeholder rather than throwing on a bad zone', () => {
    expect(formatClock(new Date('2026-06-15T12:00:00Z'), 'Nowhere/Nothing')).toBe('--:--')
  })
})

describe('utcOffsetLabel', () => {
  it('labels known offsets', () => {
    const winter = new Date('2026-01-15T12:00:00Z')
    const summer = new Date('2026-07-15T12:00:00Z')
    // ICU renders zero offset as either 'GMT' or 'GMT+0' depending on build.
    expect(utcOffsetLabel(winter, 'UTC')).toMatch(/^(GMT|UTC)(\+0)?$/)
    expect(utcOffsetLabel(winter, 'Asia/Tokyo')).toBe('GMT+9')
    expect(utcOffsetLabel(winter, 'Europe/Paris')).toBe('GMT+1')
    expect(utcOffsetLabel(summer, 'Europe/Paris')).toBe('GMT+2')
    expect(utcOffsetLabel(winter, 'America/New_York')).toBe('GMT-5')
  })

  it('returns an empty string rather than throwing on a bad zone', () => {
    expect(utcOffsetLabel(new Date('2026-01-15T12:00:00Z'), 'Nowhere/Nothing')).toBe('')
  })
})

describe('hoursAheadOfViewer', () => {
  const viewerZone = new Intl.DateTimeFormat().resolvedOptions().timeZone

  it('is zero for the viewer against their own zone', () => {
    for (const instant of ['2026-01-15T12:00:00Z', '2026-07-15T12:00:00Z', '2026-09-18T03:00:00Z']) {
      expect(hoursAheadOfViewer(new Date(instant), viewerZone), instant).toBe(0)
    }
  })

  it('reports the right gap between two zones, whatever the viewer zone is', () => {
    const winter = new Date('2026-01-15T12:00:00Z')
    const summer = new Date('2026-07-15T12:00:00Z')
    // Differences cancel the viewer's own offset out of the answer.
    expect(hoursAheadOfViewer(winter, 'Asia/Tokyo') - hoursAheadOfViewer(winter, 'UTC')).toBe(9)
    expect(hoursAheadOfViewer(winter, 'America/New_York') - hoursAheadOfViewer(winter, 'UTC')).toBe(-5)
    expect(hoursAheadOfViewer(winter, 'Europe/Paris') - hoursAheadOfViewer(winter, 'UTC')).toBe(1)
    expect(hoursAheadOfViewer(summer, 'Europe/Paris') - hoursAheadOfViewer(summer, 'UTC')).toBe(2)
    expect(hoursAheadOfViewer(winter, 'Pacific/Kiritimati') - hoursAheadOfViewer(winter, 'Pacific/Niue')).toBe(25)
  })

  it('returns a whole number of hours', () => {
    const instant = new Date('2026-06-15T12:00:00Z')
    for (const zone of ['UTC', 'Asia/Kolkata', 'Asia/Kathmandu', 'Australia/Eucla', 'Pacific/Chatham']) {
      expect(Number.isInteger(hoursAheadOfViewer(instant, zone)), zone).toBe(true)
    }
  })
})
