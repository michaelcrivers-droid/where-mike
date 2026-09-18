import { useEffect, useMemo, useRef, useState } from 'react'

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
  if (overrides.timeOfDayOverride !== null) return 0
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
  const frozen = useRef(now)

  useEffect(() => {
    if (interval <= 0) return
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), interval)
    return () => window.clearInterval(id)
  }, [interval])

  // Pinning the time of day should not leave the state stuck on whatever
  // instant the last timer tick happened to fire at.
  const instant = interval > 0 ? now : frozen.current

  return useMemo(() => resolveSimulation(instant, overrides), [instant, overrides])
}
