/**
 * The day's movement plan as a 24-hour strip plus a segment table.
 *
 * `plan.segments` is already contiguous from minute 0 to minute 1440, so the
 * strip is a straight percentage projection — no gap handling required.
 */

import { useMemo } from 'react'

import type { MovementPlan, MovementSegment } from '@/types'
import { MINUTES_PER_DAY, formatMinuteOfDay } from '@/lib/timeUtils'
import { INSET, LABEL, MUTED, Stat } from './ui'
import './control.css'

function pct(minutes: number): string {
  return `${(minutes / MINUTES_PER_DAY) * 100}%`
}

function durationLabel(minutes: number): string {
  const total = Math.round(minutes)
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

interface Totals {
  distanceKm: number
  movingCount: number
  movingMinutes: number
  longestStop: MovementSegment | null
  topSpeedKmh: number
}

function summarise(segments: MovementSegment[]): Totals {
  let distanceKm = 0
  let movingCount = 0
  let movingMinutes = 0
  let topSpeedKmh = 0
  let longestStop: MovementSegment | null = null

  for (const segment of segments) {
    const duration = segment.endMinute - segment.startMinute
    if (segment.moving) {
      distanceKm += segment.distanceKm
      movingCount++
      movingMinutes += duration
      topSpeedKmh = Math.max(topSpeedKmh, segment.speedKmh)
    } else if (
      !longestStop ||
      duration > longestStop.endMinute - longestStop.startMinute
    ) {
      longestStop = segment
    }
  }

  return { distanceKm, movingCount, movingMinutes, longestStop, topSpeedKmh }
}

export default function PlanTimeline({
  plan,
  nowMinute,
  pinned,
}: {
  plan: MovementPlan
  /** Minutes since local midnight for the marker. */
  nowMinute: number
  /** True when the time of day is pinned rather than following real time. */
  pinned: boolean
}) {
  const totals = useMemo(() => summarise(plan.segments), [plan])

  return (
    <div className="space-y-4">
      {/* ---- the strip ---------------------------------------------------- */}
      <div>
        <div
          aria-hidden="true"
          className="relative h-10 w-full overflow-hidden rounded-xl bg-slate-200 ring-1 ring-black/[0.06] dark:bg-white/[0.07] dark:ring-white/[0.08]"
        >
          {plan.segments.map((segment) => (
            <div
              key={`${segment.startMinute}-${segment.endMinute}-${segment.label}`}
              title={`${formatMinuteOfDay(segment.startMinute)} – ${formatMinuteOfDay(segment.endMinute)} · ${segment.label}`}
              style={{ left: pct(segment.startMinute), width: pct(segment.endMinute - segment.startMinute) }}
              className={
                'absolute inset-y-0 ' +
                (segment.moving
                  ? 'wm-hatch bg-sky-500 dark:bg-sky-500/90'
                  : 'bg-slate-400/55 dark:bg-slate-400/25')
              }
            />
          ))}

          {[6, 12, 18].map((hour) => (
            <div
              key={hour}
              style={{ left: pct(hour * 60) }}
              className="absolute inset-y-0 w-px bg-black/15 dark:bg-white/20"
            />
          ))}

          <div
            style={{ left: pct(Math.max(0, Math.min(MINUTES_PER_DAY, nowMinute))) }}
            className={
              'absolute inset-y-0 -ml-[1.5px] w-[3px] rounded-full bg-rose-500 shadow-[0_0_0_1px_rgba(255,255,255,0.6)] ' +
              (pinned ? '' : 'wm-pulse')
            }
          />
        </div>

        <div className={`mt-1.5 flex justify-between font-mono text-[10.5px] tabular-nums ${MUTED}`}>
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>

        <div className={`mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] ${MUTED}`}>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="wm-hatch inline-block h-2.5 w-4 rounded-sm bg-sky-500" />
            Moving
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-2.5 w-4 rounded-sm bg-slate-400/55 dark:bg-slate-400/25" />
            Stopped
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-2.5 w-[3px] rounded-full bg-rose-500" />
            {pinned ? 'Pinned time' : 'Local time now'}
          </span>
        </div>
      </div>

      {/* ---- totals -------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat
          label="Distance"
          value={`${totals.distanceKm.toFixed(1)} km`}
          sub="straight-line, whole day"
        />
        <Stat
          label="Moving periods"
          value={totals.movingCount}
          sub={`${durationLabel(totals.movingMinutes)} in motion`}
        />
        <Stat
          label="Longest stop"
          value={
            totals.longestStop
              ? durationLabel(totals.longestStop.endMinute - totals.longestStop.startMinute)
              : '—'
          }
          sub={totals.longestStop ? totals.longestStop.label : 'no stationary span'}
        />
        <Stat
          label="Top speed"
          value={`${totals.topSpeedKmh.toFixed(1)} km/h`}
          sub={`${plan.segments.length} segments`}
        />
      </div>

      {/* ---- the table ----------------------------------------------------- */}
      <div className={`${INSET} overflow-hidden`}>
        <div className="wm-scroll max-h-72 overflow-auto">
          <table className="w-full border-collapse text-[12px]">
            <caption className="sr-only">
              Movement segments for {plan.dateKey} in {plan.destination.city}
            </caption>
            <thead className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur dark:bg-[#14171c]/95">
              <tr className={LABEL}>
                <th scope="col" className="px-3 py-2 text-left font-semibold">
                  Window
                </th>
                <th scope="col" className="px-3 py-2 text-left font-semibold">
                  Activity
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  km
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  km/h
                </th>
              </tr>
            </thead>
            <tbody>
              {plan.segments.map((segment) => {
                const active = nowMinute >= segment.startMinute && nowMinute < segment.endMinute
                return (
                  <tr
                    key={`${segment.startMinute}-${segment.endMinute}-${segment.label}`}
                    className={
                      'border-t border-black/[0.05] dark:border-white/[0.06] ' +
                      (active ? 'bg-sky-500/10' : '')
                    }
                  >
                    <td className="whitespace-nowrap px-3 py-1.5 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {formatMinuteOfDay(segment.startMinute, false)}–
                      {formatMinuteOfDay(segment.endMinute, false)}
                      <span className={`ml-2 ${MUTED}`}>
                        {durationLabel(segment.endMinute - segment.startMinute)}
                      </span>
                    </td>
                    <td className="px-3 py-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className={
                            'inline-block h-1.5 w-1.5 rounded-full ' +
                            (segment.moving ? 'bg-sky-500' : 'bg-slate-400')
                          }
                        />
                        <span className="text-slate-800 dark:text-slate-200">{segment.label}</span>
                        <span className="sr-only">
                          {segment.moving ? ' (moving)' : ' (stopped)'}
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {segment.moving ? segment.distanceKm.toFixed(2) : '—'}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {segment.moving ? segment.speedKmh.toFixed(1) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
