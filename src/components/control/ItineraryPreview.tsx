/**
 * The next fortnight of the draw, as a scrollable table.
 *
 * When a seed override is in play the rows are diffed against the built-in
 * seed so the operator can see at a glance how much of the sequence actually
 * moved — a seed that changes nothing is almost always a typo'd field that
 * never committed.
 */

import { useMemo } from 'react'

import type { Destination } from '@/types'
import { itineraryFrom } from '@/lib/dailyDestination'
import { INSET, LABEL, MUTED, flagEmoji, placeLine } from './ui'
import './control.css'

export interface ItineraryRow {
  dateKey: string
  destination: Destination
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

/** Builds the run once per (start, seed, count). Exported for the diff count. */
export function useItinerary(startDateKey: string, count: number, seed: string): ItineraryRow[] {
  return useMemo(() => itineraryFrom(startDateKey, count, { seed }), [startDateKey, count, seed])
}

export default function ItineraryPreview({
  rows,
  baseline,
  anchorDate,
  onPickDate,
}: {
  rows: ItineraryRow[]
  /** The same run under the built-in seed, or null when no seed override. */
  baseline: ItineraryRow[] | null
  anchorDate: string
  onPickDate: (dateKey: string) => void
}) {
  return (
    <div className={`${INSET} overflow-hidden`}>
      <div className="wm-scroll max-h-[26rem] overflow-y-auto">
        <table className="w-full border-collapse text-[12px]">
          <caption className="sr-only">
            Generated destinations for the {rows.length} days from {anchorDate}
          </caption>
          <thead className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur dark:bg-[#14171c]/95">
            <tr className={LABEL}>
              <th scope="col" className="px-3 py-2 text-left font-semibold">
                Date
              </th>
              <th scope="col" className="px-3 py-2 text-left font-semibold">
                City
              </th>
              <th scope="col" className="px-3 py-2 text-left font-semibold">
                Region / country
              </th>
              <th scope="col" className="hidden px-3 py-2 text-left font-semibold sm:table-cell">
                Continent
              </th>
              <th scope="col" className="hidden px-3 py-2 text-left font-semibold sm:table-cell">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const changed =
                baseline !== null && baseline[index]?.destination.id !== row.destination.id
              const current = row.dateKey === anchorDate
              return (
                <tr
                  key={row.dateKey}
                  className={
                    'border-t border-black/[0.05] dark:border-white/[0.06] ' +
                    (current ? 'bg-sky-500/10' : '')
                  }
                >
                  <td className="whitespace-nowrap px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => onPickDate(row.dateKey)}
                      title={`Pin ${row.dateKey}`}
                      className="rounded font-mono tabular-nums text-slate-600 underline-offset-2 hover:text-sky-600 hover:underline dark:text-slate-400 dark:hover:text-sky-400"
                    >
                      <span className={MUTED}>{weekday(row.dateKey)}</span> {row.dateKey}
                    </button>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true">{flagEmoji(row.destination.countryCode)}</span>
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {row.destination.city}
                      </span>
                      {changed ? (
                        <span
                          title="Differs from the built-in seed"
                          className="rounded bg-amber-500/20 px-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200"
                        >
                          diff
                        </span>
                      ) : null}
                    </span>
                  </td>
                  <td className={`px-3 py-1.5 ${MUTED}`}>
                    {placeLine(row.destination.region, row.destination.country)}
                  </td>
                  <td className={`hidden px-3 py-1.5 sm:table-cell ${MUTED}`}>
                    {row.destination.continent}
                  </td>
                  <td className={`hidden px-3 py-1.5 sm:table-cell ${MUTED}`}>
                    {row.destination.category}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
