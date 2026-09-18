/**
 * WhereMike — viewer design variant "a": "Warm & native".
 *
 * A full-bleed map with one warm glass sheet sitting on it. The map is the
 * product; the chrome is three pieces of furniture and nothing else. Light
 * first, with a night mode that is the same product after dark rather than an
 * inverted copy of the day one.
 *
 * Self-contained by design: it reads the overrides and the simulation itself
 * and takes no props, so it can be dropped behind any route.
 */

import { useCallback, useMemo, useRef, useState } from 'react'

import { ROAMING_RADIUS_SCALE } from '@/config'
import { useOverrides } from '@/hooks/useOverrides'
import { useViewerState } from '@/hooks/useViewerState'
import { roamArea } from '@/lib/geoUtils'
import { hoursAheadOfViewer, utcOffsetLabel } from '@/lib/timeUtils'

import AboutDialog from './AboutDialog'
import DebugOverlay from './DebugOverlay'
import MapControls from './MapControls'
import StatusSheet from './StatusSheet'
import { useWarmMap } from './useWarmMap'
import './viewer.css'

export default function Viewer() {
  const { overrides } = useOverrides()
  const state = useViewerState(overrides)

  const sheetRef = useRef<HTMLElement | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)

  const openAbout = useCallback(() => setAboutOpen(true), [])
  const closeAbout = useCallback(() => setAboutOpen(false), [])

  const { destination, live, displayName } = state

  const { containerRef, ready, following, recenter, zoomIn, zoomOut } = useWarmMap({
    latitude: live.latitude,
    longitude: live.longitude,
    heading: live.heading,
    accuracyMeters: live.accuracyMeters,
    destinationId: destination.id,
    displayName,
    obstructionRef: sheetRef,
  })

  const radiusKm = useMemo(
    () => roamArea(destination, ROAMING_RADIUS_SCALE * overrides.radiusMultiplier).radiusKm,
    [destination, overrides.radiusMultiplier],
  )

  // Zone offsets only move at a DST boundary, so recomputing once an hour of
  // destination-local time is plenty — and keeps two `Intl` formatters off the
  // once-a-second render path.
  const hourBucket = Math.floor(live.localMinuteOfDay / 60)
  const zone = useMemo(() => {
    const now = new Date()
    return {
      offsetLabel: utcOffsetLabel(now, destination.timezone),
      hoursAhead: hoursAheadOfViewer(now, destination.timezone),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination.timezone, state.dateKey, hourBucket])

  return (
    <div className="wma-root">
      <div
        ref={containerRef}
        className="wma-fade absolute inset-0"
        style={{ opacity: ready ? 1 : 0 }}
      />

      {/* Calm first paint, cross-faded out once the style and first tiles land. */}
      <div
        role="status"
        aria-live="polite"
        aria-hidden={ready}
        className={`wma-fade pointer-events-none absolute inset-0 z-40 grid place-items-center bg-[var(--wma-page)] ${
          ready ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-center gap-5">
          <span className="relative grid h-14 w-14 place-items-center">
            <span className="wma-boot__ring" />
            <span className="wma-boot__dot" />
          </span>
          <span className="text-[13px] font-medium tracking-[-0.005em] text-[var(--wma-ink-faint)]">
            Finding {displayName}…
          </span>
        </div>
      </div>

      {overrides.debug ? <DebugOverlay state={state} /> : null}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-end gap-3 pr-[calc(var(--safe-right)_+_0.75rem)] pb-[calc(var(--safe-bottom)_+_0.75rem)] pl-[calc(var(--safe-left)_+_0.75rem)] md:flex-row-reverse md:items-end md:justify-between md:gap-4 md:pr-[calc(var(--safe-right)_+_1.25rem)] md:pb-[calc(var(--safe-bottom)_+_1.25rem)] md:pl-[calc(var(--safe-left)_+_1.25rem)]"
      >
        <MapControls
          following={following}
          displayName={displayName}
          onRecenter={recenter}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onAbout={openAbout}
        />
        <StatusSheet
          state={state}
          radiusKm={radiusKm}
          offsetLabel={zone.offsetLabel}
          hoursAhead={zone.hoursAhead}
          sheetRef={sheetRef}
        />
      </div>

      <AboutDialog
        open={aboutOpen}
        city={destination.city}
        displayName={displayName}
        onClose={closeAbout}
      />
    </div>
  )
}
