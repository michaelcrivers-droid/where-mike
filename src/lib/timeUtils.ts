/**
 * Calendar and clock helpers.
 *
 * Two different clocks matter here:
 *
 *   - The *viewer's* calendar day decides which city the day resolves to.
 *   - The *destination's* local time decides where in the day's movement plan
 *     the marker currently sits, so 8am errands happen at 8am local.
 */

const MINUTES_PER_DAY = 1440
const MS_PER_DAY = 86_400_000

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let fmt = formatterCache.get(timeZone)
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
    formatterCache.set(timeZone, fmt)
  }
  return fmt
}

export interface ZonedParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

/** Break an instant down into wall-clock fields for a given IANA zone. */
export function zonedParts(date: Date, timeZone: string): ZonedParts {
  let parts: Intl.DateTimeFormatPart[]
  try {
    parts = partsFormatter(timeZone).formatToParts(date)
  } catch {
    // An unknown zone should degrade to UTC rather than blank the whole app.
    parts = partsFormatter('UTC').formatToParts(date)
  }
  const read = (type: Intl.DateTimeFormatPartTypes): number => {
    const found = parts.find((p) => p.type === type)
    return found ? Number(found.value) : 0
  }
  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour') % 24,
    minute: read('minute'),
    second: read('second'),
  }
}

export function partsToDateKey(parts: ZonedParts): string {
  const pad = (n: number, width = 2) => String(n).padStart(width, '0')
  return `${pad(parts.year, 4)}-${pad(parts.month)}-${pad(parts.day)}`
}

/** `YYYY-MM-DD` for an instant, in a given zone. */
export function dateKeyInZone(date: Date, timeZone: string): string {
  return partsToDateKey(zonedParts(date, timeZone))
}

/** Minutes since local midnight, including fractional seconds. */
export function minuteOfDayInZone(date: Date, timeZone: string): number {
  const p = zonedParts(date, timeZone)
  return p.hour * 60 + p.minute + p.second / 60
}

/** `YYYY-MM-DD` in the viewer's own zone. */
export function localDateKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  if (m < 1 || m > 12 || d < 1 || d > 31) return false
  const probe = new Date(Date.UTC(y, m - 1, d))
  return probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d
}

/** Whole days since 1970-01-01. The canonical index for the daily draw. */
export function dateKeyToDayNumber(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number)
  return Math.floor(Date.UTC(y, m - 1, d) / MS_PER_DAY)
}

export function dayNumberToDateKey(dayNumber: number): string {
  return new Date(dayNumber * MS_PER_DAY).toISOString().slice(0, 10)
}

export function addDays(dateKey: string, days: number): string {
  return dayNumberToDateKey(dateKeyToDayNumber(dateKey) + days)
}

/** "4:12 PM" in the destination's zone. */
export function formatClock(date: Date, timeZone: string, hour12 = true): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12,
    }).format(date)
  } catch {
    return '--:--'
  }
}

/** "4:12 PM" from a raw minute-of-day, without needing a real instant. */
export function formatMinuteOfDay(minute: number, hour12 = true): string {
  const total = ((Math.floor(minute) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY
  const h24 = Math.floor(total / 60)
  const m = total % 60
  if (!hour12) return `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  const suffix = h24 < 12 ? 'AM' : 'PM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

/** "GMT+2" style label for the destination's current offset. */
export function utcOffsetLabel(date: Date, timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(date)
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
  } catch {
    return ''
  }
}

/**
 * How far ahead or behind the destination is, in whole hours, relative to the
 * viewer. Positive means the destination is ahead.
 */
export function hoursAheadOfViewer(date: Date, timeZone: string): number {
  const there = zonedParts(date, timeZone)
  const thereMs = Date.UTC(there.year, there.month - 1, there.day, there.hour, there.minute)
  const hereMs = Date.UTC(
    date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(),
  )
  return Math.round((thereMs - hereMs) / 3_600_000)
}

/** A friendly bucket for the destination's local time, used in copy. */
export function timeOfDayLabel(minute: number): string {
  const h = Math.floor(minute / 60)
  if (h < 5) return 'Late night'
  if (h < 12) return 'Morning'
  if (h < 17) return 'Afternoon'
  if (h < 21) return 'Evening'
  return 'Night'
}

export { MINUTES_PER_DAY, MS_PER_DAY }
