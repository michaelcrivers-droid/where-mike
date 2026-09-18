/**
 * The fictional-content disclosure.
 *
 * Kept behind the "i" button rather than pasted across the map, but written
 * plainly: no weasel words about "simulated experiences", just a clear
 * statement that none of this is real and nobody is being tracked.
 */

import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

import { APP_NAME } from '@/config'
import { ATTRIBUTION_HTML } from '@/lib/mapStyle'
import { CloseIcon } from './icons'

interface AboutDialogProps {
  open: boolean
  city: string
  displayName: string
  onClose: () => void
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function AboutDialog({ open, city, displayName, onClose }: AboutDialogProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    panel?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const nodes = panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus?.()
    }
  }, [open, onClose])

  const stop = useCallback((event: ReactMouseEvent) => event.stopPropagation(), [])

  if (!open) return null

  return (
    <div
      className="wma-soften fixed inset-0 z-50 flex items-end justify-center bg-[var(--wma-scrim)] p-0 backdrop-blur-[3px] md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wma-about-title"
        tabIndex={-1}
        onClick={stop}
        className="wma-glass wma-rise pointer-events-auto max-h-[86svh] w-full max-w-[460px] overflow-y-auto rounded-t-[26px] px-6 pt-6 pb-[calc(var(--safe-bottom)_+_1.5rem)] outline-none md:rounded-[26px] md:pb-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="wma-about-title"
            className="text-[21px] font-semibold tracking-[-0.02em] text-[var(--wma-ink)]"
          >
            None of this is real
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="wma-press -mt-1 -mr-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[var(--wma-ink-faint)] hover:text-[var(--wma-ink)]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-3 space-y-3 text-[14px] leading-relaxed text-[var(--wma-ink-soft)]">
          <p>
            {APP_NAME} is a work of fiction — a gift, and a joke. {displayName} is not in {city}.
            Nobody is being tracked, no phone is reporting in, and there is no server anywhere that
            knows where anyone is.
          </p>
          <p>
            Every city, every street and every step is invented in your browser from today&rsquo;s
            date, which is why everyone who opens this page sees the same imaginary day. Tomorrow it
            will be somewhere else. It always is.
          </p>
          <p className="text-[var(--wma-ink-faint)]">
            Not affiliated with, or derived from, any real location-sharing product.
          </p>
        </div>

        <p
          className="mt-4 border-t border-[var(--wma-divider)] pt-3 text-[11px] leading-relaxed text-[var(--wma-ink-faint)] [&_a]:text-[var(--wma-ink-soft)] [&_a]:underline"
          // Static licence string from our own map config, never user input.
          dangerouslySetInnerHTML={{ __html: `Map data: ${ATTRIBUTION_HTML}` }}
        />

        <button
          type="button"
          onClick={onClose}
          className="wma-press wma-cta mt-5 h-11 w-full rounded-[16px] text-[14px] font-semibold shadow-[var(--wma-shadow-1)]"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
