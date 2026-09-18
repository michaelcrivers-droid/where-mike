import { useCallback, useSyncExternalStore } from 'react'

import type { ControlOverrides } from '@/types'
import {
  readOverrides, resetOverrides, subscribeToOverrides, writeOverrides,
} from '@/lib/overrides'
import { DEFAULT_OVERRIDES } from '@/lib/overrides'

let snapshot: ControlOverrides = DEFAULT_OVERRIDES
let snapshotStale = true

subscribeToOverrides(() => {
  snapshotStale = true
})

/**
 * useSyncExternalStore demands a referentially stable snapshot, so the value
 * is cached and only rebuilt when the store announces a change.
 */
function getSnapshot(): ControlOverrides {
  if (snapshotStale) {
    snapshot = readOverrides()
    snapshotStale = false
  }
  return snapshot
}

function subscribe(onChange: () => void): () => void {
  return subscribeToOverrides(() => {
    snapshotStale = true
    onChange()
  })
}

/** Current overrides plus the two writers, wired to re-render on change. */
export function useOverrides(): {
  overrides: ControlOverrides
  setOverrides: (patch: Partial<ControlOverrides>) => void
  reset: () => void
} {
  const overrides = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_OVERRIDES)
  const setOverrides = useCallback((patch: Partial<ControlOverrides>) => {
    writeOverrides(patch)
  }, [])
  const reset = useCallback(() => {
    resetOverrides()
  }, [])
  return { overrides, setOverrides, reset }
}
