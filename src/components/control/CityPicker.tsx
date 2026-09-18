/**
 * Force one of the 1,319 destinations.
 *
 * The dataset is small enough to keep in memory and large enough that
 * rendering all of it on every keystroke is noticeable, so the search index
 * is built once and the rendered list is capped. The match count is reported
 * separately from the rendered count, so a capped list never reads as "that
 * is all there is".
 */

import { useId, useMemo, useState } from 'react'

import type { Destination } from '@/types'
import { getDestinations } from '@/data/destinations'
import { Badge, Button, INPUT, INSET, LABEL, MUTED, flagEmoji, placeLine } from './ui'
import './control.css'

/** How many rows to paint. Everything beyond this is counted, not rendered. */
const MAX_ROWS = 60

interface IndexEntry {
  destination: Destination
  haystack: string
}

export default function CityPicker({
  value,
  onChange,
}: {
  /** The forced destination id, or null when the daily draw is in charge. */
  value: string | null
  onChange: (id: string | null) => void
}) {
  const inputId = useId()
  const [query, setQuery] = useState('')

  const index = useMemo<IndexEntry[]>(
    () =>
      getDestinations().map((destination) => ({
        destination,
        haystack: (
          `${destination.city} ${destination.region} ${destination.country} ` +
          `${destination.countryCode} ${destination.id}`
        ).toLowerCase(),
      })),
    [],
  )

  const { rows, total } = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) {
      return { rows: index.slice(0, MAX_ROWS).map((e) => e.destination), total: index.length }
    }
    const matched: Destination[] = []
    let count = 0
    for (const entry of index) {
      if (!entry.haystack.includes(needle)) continue
      count++
      if (matched.length < MAX_ROWS) matched.push(entry.destination)
    }
    return { rows: matched, total: count }
  }, [index, query])

  const selected = useMemo(
    () => (value ? (index.find((e) => e.destination.id === value)?.destination ?? null) : null),
    [index, value],
  )

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1 space-y-1.5">
          <label htmlFor={inputId} className={LABEL}>
            Search destinations
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            placeholder="City, region, country or code…"
            onChange={(event) => setQuery(event.target.value)}
            className={INPUT}
          />
        </div>
        <Button onClick={() => onChange(null)} disabled={value === null} title="Clear the forced city">
          Clear force
        </Button>
      </div>

      <div className={`flex items-center justify-between gap-3 text-[11.5px] ${MUTED}`}>
        <span>
          {query.trim() ? (
            <>
              <span className="font-mono tabular-nums">{total}</span> match
              {total === 1 ? '' : 'es'}
              {total > rows.length ? (
                <>
                  {' '}
                  · showing first <span className="font-mono tabular-nums">{rows.length}</span>
                </>
              ) : null}
            </>
          ) : (
            <>
              <span className="font-mono tabular-nums">{total}</span> destinations · showing first{' '}
              <span className="font-mono tabular-nums">{rows.length}</span>
            </>
          )}
        </span>
        {selected ? (
          <span className="truncate">
            Forced: <strong className="font-semibold text-slate-700 dark:text-slate-200">
              {selected.city}
            </strong>
          </span>
        ) : (
          <span>Following the daily draw</span>
        )}
      </div>

      <div className={`${INSET} overflow-hidden`}>
        <ul className="wm-scroll max-h-72 overflow-y-auto" aria-label="Destinations">
          {rows.length === 0 ? (
            <li className={`px-3 py-6 text-center text-[12px] ${MUTED}`}>
              Nothing matches “{query.trim()}”.
            </li>
          ) : (
            rows.map((destination) => {
              const active = destination.id === value
              return (
                <li key={destination.id} className="border-t border-black/[0.04] first:border-t-0 dark:border-white/[0.05]">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onChange(active ? null : destination.id)}
                    className={
                      'flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] transition-colors ' +
                      (active
                        ? 'bg-sky-500/15 text-slate-900 dark:text-slate-50'
                        : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.05]')
                    }
                  >
                    <span aria-hidden="true">{flagEmoji(destination.countryCode)}</span>
                    <span className="min-w-0 flex-1 truncate">
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {destination.city}
                      </span>
                      <span className={`ml-2 ${MUTED}`}>
                        {placeLine(destination.region, destination.country)}
                      </span>
                    </span>
                    <span className="hidden shrink-0 sm:block">
                      <Badge tone={active ? 'pinned' : 'neutral'}>
                        {active ? 'forced' : destination.category}
                      </Badge>
                    </span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}
