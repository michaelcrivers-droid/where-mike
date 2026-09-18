/**
 * The bottom sheet.
 *
 * Collapsed it answers the only question that matters — who, where, and what
 * time is it there. Pulled up (or tapped) it adds the quieter detail: the local
 * clock in words, the offset from wherever you are, how far he is wandering,
 * and a tease about tomorrow that gives nothing away.
 *
 * The grab handle is real: dragging it drives `grid-template-rows` directly, so
 * the sheet follows the finger and then settles with the same damped curve it
 * uses for a tap.
 */

import { useCallback, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react'

import type { ViewerState } from '@/types'
import { PROFILE_IMAGE_URL } from '@/config'
import { formatMinuteOfDay, timeOfDayLabel } from '@/lib/timeUtils'
import {
  movementPhrase, offsetPhrase, placeLines, roamingPhrase, tomorrowTease, weekdayFrom,
} from './copy'

interface StatusSheetProps {
  state: ViewerState
  /** Today's roaming radius in km, after every multiplier. */
  radiusKm: number
  /** `GMT+2` style label for the destination. */
  offsetLabel: string
  /** Whole hours the destination is ahead of the viewer. */
  hoursAhead: number
  sheetRef: RefObject<HTMLElement | null>
}

const DRAG_SLOP_PX = 6

export default function StatusSheet(props: StatusSheetProps) {
  const { state, radiusKm, offsetLabel, hoursAhead, sheetRef } = props
  const { destination, live, displayName, dateKey } = state

  const [open, setOpen] = useState(false)
  const detailsRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{ startY: number; height: number; base: number; moved: number } | null>(null)
  const suppressClickRef = useRef(false)

  const place = placeLines(destination)
  const clock = formatMinuteOfDay(live.localMinuteOfDay)

  const toggle = useCallback(() => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    setOpen((value) => !value)
  }, [])

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      // A gesture that never produced a click must not swallow the next tap.
      suppressClickRef.current = false
      const details = detailsRef.current
      const inner = details?.firstElementChild as HTMLElement | null
      const height = inner ? inner.scrollHeight : 0
      if (!details || height <= 0) return
      dragRef.current = { startY: event.clientY, height, base: open ? 1 : 0, moved: 0 }
      details.dataset.dragging = 'true'
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [open],
  )

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    const details = detailsRef.current
    if (!drag || !details) return
    const dy = event.clientY - drag.startY
    drag.moved = Math.max(drag.moved, Math.abs(dy))
    const progress = Math.min(1, Math.max(0, drag.base - dy / drag.height))
    details.style.gridTemplateRows = `${progress}fr`
    details.style.opacity = String(Math.min(1, progress * 1.7))
  }, [])

  const endDrag = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    const details = detailsRef.current
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (!drag || !details) return
    const dy = event.clientY - drag.startY
    const progress = Math.min(1, Math.max(0, drag.base - dy / drag.height))
    details.style.removeProperty('grid-template-rows')
    details.style.removeProperty('opacity')
    delete details.dataset.dragging
    if (drag.moved > DRAG_SLOP_PX) {
      suppressClickRef.current = true
      setOpen(progress > 0.5)
    }
  }, [])

  return (
    <section
      ref={sheetRef}
      aria-label={`Where ${displayName} is`}
      className="wma-sheet wma-glass wma-rise pointer-events-auto w-full overflow-hidden rounded-[24px] md:w-[368px] md:shrink-0"
    >
      <button
        type="button"
        onClick={toggle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        aria-expanded={open}
        aria-controls="wma-sheet-details"
        aria-label={open ? 'Hide details' : 'Show details'}
        className="wma-handle flex h-10 w-full touch-none items-center justify-center"
      >
        <span className="wma-grab" />
      </button>

      <div className="px-5">
        <div className="flex items-center gap-2.5">
          {/* A swapped-out avatar that 404s should leave a gap, not a broken
              image icon in the middle of the card. */}
          <img
            src={PROFILE_IMAGE_URL}
            alt=""
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden'
            }}
            className="h-7 w-7 shrink-0 rounded-full object-cover shadow-[0_1px_2px_rgba(41,27,18,0.22)] ring-1 ring-[var(--wma-hairline)]"
          />
          <span className="truncate text-[13px] font-medium tracking-[-0.005em] text-[var(--wma-ink-soft)]">
            {displayName}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--wma-accent-wash)] px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--wma-accent-ink)]">
            <span className="wma-blip" />
            {live.statusLabel}
          </span>
          <span className="ml-auto shrink-0 text-[13px] font-medium tabular-nums text-[var(--wma-ink-soft)]">
            {clock}
          </span>
        </div>

        <div aria-live="polite" aria-atomic="true">
          <h1
            className="mt-2.5 truncate text-[30px] font-semibold leading-[1.06] tracking-[-0.028em] text-[var(--wma-ink)]"
          >
            {place.primary}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-[14px] leading-tight">
            <span className="truncate text-[var(--wma-ink-soft)]">{place.secondary}</span>
            <span
              aria-hidden="true"
              className="shrink-0 rounded-md bg-[var(--wma-accent-wash)] px-1.5 py-px text-[10px] font-semibold tracking-[0.08em] text-[var(--wma-accent-ink)]"
            >
              {destination.countryCode.toUpperCase()}
            </span>
          </p>
        </div>

        {/*
          * Permanent, not tucked behind the info button.
          *
          * Everything else on the collapsed card — a name, a live dot, a local
          * clock, a city — reads exactly like a real location share, and
          * someone who is simply sent the link has no reason to open a dialog
          * or drag a sheet. One quiet line is the difference between a joke
          * and a thing that misleads people.
          */}
        <p className="mt-2 text-[11px] leading-tight text-[var(--wma-ink-faint)]">
          Made up. {displayName} is not really here.
        </p>
      </div>

      <div
        id="wma-sheet-details"
        ref={detailsRef}
        className="wma-sheet-details"
        data-open={open ? 'true' : 'false'}
        // Collapsed content is hidden by a grid-row transition rather than
        // `display`, so without this it stays in the accessibility tree and the
        // tab order while `aria-expanded` reports false.
        inert={!open}
      >
        <div>
          <dl className="mt-3.5 px-5">
            <Row label="Time there" value={timeOfDayLabel(live.localMinuteOfDay)} note={weekdayFrom(dateKey)} />
            <Row label="Time zone" value={offsetLabel || '—'} note={offsetPhrase(hoursAhead)} />
            <Row label="Movement" value={movementPhrase(live.moving, live.speedKmh)} />
            <Row label="Roaming" value={roamingPhrase(radiusKm)} />
          </dl>

          <div className="mx-5 mt-3.5 rounded-[16px] bg-[var(--wma-accent-wash)] px-3.5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--wma-accent-ink)]">
              Where tomorrow?
            </p>
            <p className="mt-1 text-[13px] leading-snug text-[var(--wma-ink-soft)]">
              {tomorrowTease(dateKey)}
            </p>
          </div>

          <p className="px-5 pt-3 text-[11px] leading-relaxed text-[var(--wma-ink-faint)]">
            A fictional journey, generated in your browser. Nobody is being tracked.
          </p>
        </div>
      </div>

      <div className="h-5" />
    </section>
  )
}

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-[var(--wma-divider)] py-2.5">
      <dt className="shrink-0 text-[12px] font-medium text-[var(--wma-ink-faint)]">{label}</dt>
      <dd className="min-w-0 text-right">
        <span className="text-[13px] font-medium text-[var(--wma-ink)]">{value}</span>
        {note ? <span className="ml-1.5 text-[12px] text-[var(--wma-ink-soft)]">{note}</span> : null}
      </dd>
    </div>
  )
}
