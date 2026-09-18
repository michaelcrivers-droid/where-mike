import { useEffect, useMemo, useState } from 'react'

import type { ControlOverrides, ViewerState } from '@/types'
import { resolveSimulation } from '@/lib/simulation'
import { TICK_INTERVAL_MS } from '@/config'

/**
 * How often to recompute the position.
 *
 * A one-second tick is plenty for real time — the marker only crawls. Under
 * accelerated testing a whole day can pass in a minute, so the interval
 * shrinks to keep movement smooth, and a pinned time of day needs no timer at
 * all.
 */
function tickInterval(overrides: ControlOverrides): number {
  // A pinned time of day still needs a slow tick. The position is frozen by
  // the override itself, but the calendar date is not: without a tick, a tab
  // left open across midnight would keep resolving yesterday's city.
  if (overrides.timeOfDayOverride !== null) return 60_000
  if (overrides.acceleratedDayMinutes > 0) {
    return Math.max(120, (overrides.acceleratedDayMinutes * 60_000) / 600)
  }
  return TICK_INTERVAL_MS
}

/**
 * The live viewer state, recomputed on a timer.
 *
 * `now` is the only thing that moves; everything downstream is a pure
 * function of it, so this is the single place the app touches the clock.
 */
export function useViewerState(overrides: ControlOverrides): ViewerState {
  const [now, setNow] = useState(() => new Date())
  const interval = tickInterval(overrides)

  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return useMemo(() => resolveSimulation(now, overrides), [now, overrides])
}
