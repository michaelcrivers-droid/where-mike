import { Component, type ErrorInfo, type ReactNode } from 'react'

/**
 * Catches a route that fails to load, and in particular a stale code-split
 * chunk.
 *
 * Routes are lazily imported, and their file names carry a content hash. Deploy
 * a new build while someone has the page open and their tab is still holding
 * the old index.html, so the chunk name it asks for no longer exists. The
 * import rejects, React unwinds the whole tree, and the visitor is left looking
 * at a blank white page with no way back. It is not a hypothetical: it happens
 * to anyone whose tab outlives a deploy.
 *
 * A hard reload fixes it completely, because it re-fetches index.html and with
 * it the current chunk names. So that is what happens — once, guarded by a
 * sessionStorage flag so a genuinely broken build cannot turn into a reload
 * loop. Anything else, or a second failure, gets an honest little screen with a
 * button rather than nothing at all.
 */

const RELOAD_GUARD_KEY = 'wheremike.chunk-reload'

function isStaleChunkError(error: unknown): boolean {
  const message =
    error instanceof Error ? `${error.name} ${error.message}` : String(error ?? '')
  return /dynamically imported module|importing a module script failed|failed to fetch|chunkloaderror/i.test(
    message,
  )
}

function readGuard(): boolean {
  try {
    return sessionStorage.getItem(RELOAD_GUARD_KEY) === '1'
  } catch {
    // Storage can be unavailable; treat that as "already tried" so we never
    // reload in a loop we cannot remember.
    return true
  }
}

function writeGuard(): void {
  try {
    sessionStorage.setItem(RELOAD_GUARD_KEY, '1')
  } catch {
    /* ignore */
  }
}

/** Called once a route has rendered, so a later deploy can reload again. */
export function clearReloadGuard(): void {
  try {
    sessionStorage.removeItem(RELOAD_GUARD_KEY)
  } catch {
    /* ignore */
  }
}

interface State {
  failed: boolean
}

export default class RouteBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (isStaleChunkError(error) && !readGuard()) {
      writeGuard()
      window.location.reload()
      return
    }
    console.error('WhereMike: route failed to render', error, info.componentStack)
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children

    return (
      <div
        className="fixed inset-0 grid place-items-center bg-[#e9ecef] px-8 text-center dark:bg-[#0b0d10]"
        role="alert"
      >
        <div className="max-w-xs">
          <p className="text-[17px] font-semibold text-black/80 dark:text-white/85">
            Lost the signal
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-black/50 dark:text-white/45">
            Something failed to load. Reloading usually sorts it out.
          </p>
          <button
            type="button"
            className="mt-5 rounded-full bg-black/85 px-5 py-2.5 text-[13.5px] font-medium text-white dark:bg-white/90 dark:text-black"
            onClick={() => {
              clearReloadGuard()
              window.location.reload()
            }}
          >
            Reload
          </button>
        </div>
      </div>
    )
  }
}
