/**
 * Only ever visible when the control panel turns `debug` on. Deliberately
 * boring: monospace, top-left, out of the way of everything else, and
 * pointer-transparent so it can never swallow a map gesture.
 */

import type { ViewerState } from '@/types'

interface DebugOverlayProps {
  state: ViewerState
}

export default function DebugOverlay({ state }: DebugOverlayProps) {
  const { live, plan, destination, dateKey, accelerated } = state

  const rows: Array<[string, string]> = [
    ['date', dateKey],
    ['dest', destination.id],
    ['mode', plan.mode],
    ['min', live.localMinuteOfDay.toFixed(1)],
    ['lat', live.latitude.toFixed(5)],
    ['lng', live.longitude.toFixed(5)],
    ['speed', `${live.speedKmh.toFixed(1)} km/h`],
    ['heading', live.heading === null ? '—' : `${Math.round(live.heading)}°`],
    ['accuracy', `${Math.round(live.accuracyMeters)} m`],
    ['fast-day', accelerated ? 'on' : 'off'],
  ]

  return (
    <div
      aria-hidden="true"
      className="wma-glass pointer-events-none absolute top-[calc(var(--safe-top)_+_10px)] left-[calc(var(--safe-left)_+_10px)] z-30 max-w-[min(15rem,calc(100vw_-_5rem))] rounded-[14px] px-3 py-2"
    >
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-[2px] font-mono text-[10px] leading-[1.5]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-[var(--wma-ink-faint)]">{label}</dt>
            <dd className="truncate text-right text-[var(--wma-ink-soft)]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
