/**
 * The draw, three days at a time.
 *
 * These cards always show what the *generator* produces for a date — a forced
 * city override is deliberately not folded in here, because the whole point
 * of the panel is to be able to see the underlying sequence while a force is
 * in effect. The middle card calls the difference out when one is active.
 */

import { useMemo } from 'react'

import type { Destination } from '@/types'
import { destinationForDate } from '@/lib/dailyDestination'
import { addDays, dateKeyToDayNumber } from '@/lib/timeUtils'
import { Badge, INSET, MUTED, flagEmoji, placeLine } from './ui'

/** "Today" / "Yesterday" / "+4 days", relative to the real calendar day. */
function relativeLabel(dateKey: string, today: string): string {
  const diff = dateKeyToDayNumber(dateKey) - dateKeyToDayNumber(today)
  if (diff === 0) return 'Today'
  if (diff === -1) return 'Yesterday'
  if (diff === 1) return 'Tomorrow'
  return diff > 0 ? `+${diff} days` : `${Math.abs(diff)} days ago`
}

function weekday(dateKey: string): string {
  try {
    return new Date(`${dateKey}T00:00:00Z`).toLocaleDateString('en-US', {
      weekday: 'short',
      timeZone: 'UTC',
    })
  } catch {
    return ''
  }
}

function Card({
  dateKey,
  destination,
  today,
  focused,
  forced,
  onSelect,
}: {
  dateKey: string
  destination: Destination
  today: string
  focused: boolean
  forced: Destination | null
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={focused ? 'date' : undefined}
      className={
        'group flex h-full flex-col rounded-xl p-3 text-left transition-colors ' +
        (focused
          ? 'bg-sky-500/10 ring-2 ring-sky-500/60'
          : 'bg-slate-100/80 ring-1 ring-black/[0.04] hover:bg-slate-100 dark:bg-black/25 dark:ring-white/[0.06] dark:hover:bg-black/40')
      }
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
          {relativeLabel(dateKey, today)}
        </span>
        <span className={`font-mono text-[10.5px] tabular-nums ${MUTED}`}>
          {weekday(dateKey)} {dateKey}
        </span>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span aria-hidden="true" className="text-[18px] leading-none">
          {flagEmoji(destination.countryCode)}
        </span>
        <span className="truncate text-[17px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {destination.city}
        </span>
      </div>

      <div className={`mt-0.5 truncate text-[12px] ${MUTED}`}>
        {placeLine(destination.region, destination.country)}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge>{destination.continent}</Badge>
        <Badge>{destination.category}</Badge>
      </div>

      <div className={`mt-2 font-mono text-[10.5px] tabular-nums ${MUTED}`}>
        {destination.latitude.toFixed(3)}, {destination.longitude.toFixed(3)} ·{' '}
        {destination.safeRoamingRadiusKm} km · {destination.timezone}
      </div>

      {focused && forced ? (
        <div className="mt-2 rounded-lg bg-amber-500/15 px-2 py-1.5 text-[11px] leading-snug text-amber-800 dark:text-amber-200">
          Viewer is forced to <strong className="font-semibold">{forced.city}</strong>, so the drawn
          city above is not what the map shows.
        </div>
      ) : null}
    </button>
  )
}

export default function DestinationCards({
  anchorDate,
  today,
  seed,
  forced,
  onPickDate,
}: {
  /** The date the panel is centred on. */
  anchorDate: string
  /** The real calendar day, for the relative labels. */
  today: string
  seed: string
  /** The forced destination, when `destinationIdOverride` is set. */
  forced: Destination | null
  onPickDate: (dateKey: string) => void
}) {
  const days = useMemo(() => {
    return [-1, 0, 1].map((offset) => {
      const dateKey = addDays(anchorDate, offset)
      return { dateKey, offset, destination: destinationForDate(dateKey, { seed }) }
    })
  }, [anchorDate, seed])

  return (
    <div className={`${INSET} grid gap-2 p-2 sm:grid-cols-3`}>
      {days.map((day) => (
        <Card
          key={day.dateKey}
          dateKey={day.dateKey}
          destination={day.destination}
          today={today}
          focused={day.offset === 0}
          forced={forced}
          onSelect={() => onPickDate(day.dateKey)}
        />
      ))}
    </div>
  )
}
