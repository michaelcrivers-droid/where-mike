/**
 * The control stack. Thumb-first: 44px targets, stacked bottom-right with the
 * one you reach for most — recenter — closest to the sheet.
 *
 * Recenter is always present rather than appearing only when it is needed; a
 * control that comes and goes is a control you cannot rely on. It changes
 * state instead: quiet grey while the camera is following, warm accent with a
 * label beside it once the user has panned away.
 */

import { InfoIcon, MinusIcon, PlusIcon, RecenterIcon } from './icons'

interface MapControlsProps {
  following: boolean
  displayName: string
  onRecenter: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onAbout: () => void
}

const ROUND =
  'wma-glass wma-press pointer-events-auto grid h-11 w-11 place-items-center rounded-full'

export default function MapControls(props: MapControlsProps) {
  const { following, displayName, onRecenter, onZoomIn, onZoomOut, onAbout } = props

  return (
    <div className="pointer-events-none flex shrink-0 flex-col items-end gap-2.5">
      <button
        type="button"
        onClick={onAbout}
        aria-label="About WhereMike"
        className={`${ROUND} text-[var(--wma-ink-soft)] hover:text-[var(--wma-ink)]`}
      >
        <InfoIcon />
      </button>

      <div className="wma-glass pointer-events-auto flex flex-col overflow-hidden rounded-[18px]">
        <button
          type="button"
          onClick={onZoomIn}
          aria-label="Zoom in"
          className="grid h-11 w-11 place-items-center text-[var(--wma-ink)] transition-colors duration-200 active:bg-[var(--wma-accent-wash)]"
        >
          <PlusIcon />
        </button>
        <span aria-hidden="true" className="mx-2.5 h-px bg-[var(--wma-divider)]" />
        <button
          type="button"
          onClick={onZoomOut}
          aria-label="Zoom out"
          className="grid h-11 w-11 place-items-center text-[var(--wma-ink)] transition-colors duration-200 active:bg-[var(--wma-accent-wash)]"
        >
          <MinusIcon />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`wma-glass rounded-full px-3 py-1.5 text-[12px] font-medium whitespace-nowrap text-[var(--wma-ink-soft)] transition-opacity duration-500 ${
            following ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Recenter
        </span>
        <button
          type="button"
          onClick={onRecenter}
          aria-label={`Recentre the map on ${displayName}`}
          className={`${ROUND} ${
            following ? 'text-[var(--wma-ink-soft)]' : 'text-[var(--wma-accent-ink)]'
          }`}
        >
          <RecenterIcon />
        </button>
      </div>
    </div>
  )
}
