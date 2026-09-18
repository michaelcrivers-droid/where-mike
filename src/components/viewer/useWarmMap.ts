/**
 * The map, the marker and the camera.
 *
 * Everything imperative lives in here so the React tree above stays a pure
 * function of `ViewerState`. The map is created once, in an effect with no
 * dependencies, and only ever mutated afterwards — a tick moves the marker and
 * nothing else re-renders.
 *
 * Camera policy, in order of priority:
 *   1. The user is always in charge. Any gesture stops the follow and raises a
 *      "Recenter" affordance instead of arguing.
 *   2. A new destination is a cut, not a journey: jump, never fly across the
 *      planet.
 *   3. While following, only move when the marker actually drifts towards the
 *      edge of a comfort box, and then move slowly.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { INITIAL_ZOOM, PROFILE_IMAGE_URL } from '@/config'
import { configureMapRuntime } from '@/lib/mapRuntime'
import { ATTRIBUTION_HTML, fallbackStyle, mapStyleUrl, type MapTheme } from '@/lib/mapStyle'
import { createMarkerElement, type MarkerHandle } from './markerElement'

/** Web Mercator metres per pixel at zoom 0, for MapLibre's 512px tiles. */
const METRES_PER_PIXEL_Z0 = 78271.5170

/** Don't re-ease more often than this, so a slow walk cannot cause chatter. */
const EASE_COOLDOWN_MS = 2600

/** Never let the loading state outlive a genuinely broken network. */
const READY_TIMEOUT_MS = 7000

const DAMPED = (t: number): number => 1 - Math.pow(1 - t, 4)

export interface WarmMapArgs {
  latitude: number
  longitude: number
  heading: number | null
  accuracyMeters: number
  destinationId: string
  displayName: string
  /**
   * The bottom overlay. Its measured height keeps the marker clear of the card
   * instead of hiding behind it.
   */
  obstructionRef: RefObject<HTMLElement | null>
}

export interface WarmMap {
  containerRef: RefObject<HTMLDivElement | null>
  ready: boolean
  following: boolean
  recenter: () => void
  zoomIn: () => void
  zoomOut: () => void
}

interface MapApi {
  visualOffset: () => number
  snapTo: (lng: number, lat: number) => void
  easeToMarker: (lng: number, lat: number, duration: number, zoom?: number) => void
  syncHalo: () => void
  isDrifting: (lng: number, lat: number) => boolean
  zoomBy: (delta: number) => void
}

export function useWarmMap(args: WarmMapArgs): WarmMap {
  const {
    latitude, longitude, heading, accuracyMeters, destinationId, displayName, obstructionRef,
  } = args

  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const handleRef = useRef<MarkerHandle | null>(null)
  const apiRef = useRef<MapApi | null>(null)

  const positionRef = useRef({ lat: latitude, lng: longitude })
  const accuracyRef = useRef(accuracyMeters)
  const followingRef = useRef(true)
  const destinationRef = useRef<string | null>(null)
  const lastEaseRef = useRef(0)

  const [ready, setReady] = useState(false)
  const [following, setFollowing] = useState(true)

  // ------------------------------------------------------------------ setup

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    configureMapRuntime()

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    let theme: MapTheme = media.matches ? 'dark' : 'light'
    let fallbackAppliedFor: MapTheme | null = null
    let disposed = false

    const map = new maplibregl.Map({
      container,
      style: mapStyleUrl(theme),
      center: [positionRef.current.lng, positionRef.current.lat],
      zoom: INITIAL_ZOOM,
      // Added by hand below so it can sit top-right, clear of the card.
      attributionControl: false,
      // A tilted, spun map is not what this app is for; keeping north up also
      // means the heading pip can be read straight off the compass.
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      fadeDuration: 240,
    })
    mapRef.current = map

    map.addControl(
      new maplibregl.AttributionControl({ compact: true, customAttribution: ATTRIBUTION_HTML }),
      'top-right',
    )

    const handle = createMarkerElement(PROFILE_IMAGE_URL, displayName)
    handleRef.current = handle
    const marker = new maplibregl.Marker({
      element: handle.element,
      anchor: 'center',
      rotationAlignment: 'viewport',
      pitchAlignment: 'viewport',
    })
      .setLngLat([positionRef.current.lng, positionRef.current.lat])
      .addTo(map)
    markerRef.current = marker

    // --------------------------------------------------------------- camera

    const obstructionPx = (): number => {
      const el = obstructionRef.current
      const height = el ? el.getBoundingClientRect().height + 16 : 0
      const containerHeight = container.clientHeight || window.innerHeight || 720
      return Math.min(height, containerHeight * 0.48)
    }

    /**
     * The band of the viewport the marker is allowed to sit in: clear of the
     * edges, and clear of the card along the bottom. Null when the viewport is
     * too short for any such band to exist.
     */
    const comfortBand = (): { top: number; bottom: number } | null => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (width <= 0 || height <= 0) return null
      const padTop = Math.max(56, Math.min(170, height * 0.2))
      const padBottom = Math.min(height * 0.62, obstructionPx() + 56)
      if (padTop >= height - padBottom) return null
      return { top: padTop, bottom: height - padBottom }
    }

    /**
     * How far above the geometric centre to place the marker.
     *
     * Derived from the comfort band rather than guessed from the card height.
     * The two used to be worked out independently, and on a short viewport
     * they disagreed: the ease parked the marker a few pixels below the band's
     * lower edge, the drift check immediately declared it adrift, and the map
     * re-eased every 2.6 seconds for as long as the page stayed open. Aiming
     * at a point inside the band makes that impossible by construction.
     */
    const visualOffset = (): number => {
      const height = container.clientHeight || window.innerHeight || 720
      const band = comfortBand()
      if (!band) return 0
      // Slightly above the middle of the band, which reads better than dead
      // centre without risking the lower edge.
      const resting = band.top + (band.bottom - band.top) * 0.45
      return Math.round(height / 2 - resting)
    }

    const snapTo = (lng: number, lat: number) => {
      if (disposed) return
      map.jumpTo({ center: [lng, lat], zoom: INITIAL_ZOOM })
      const dy = visualOffset()
      if (dy <= 0) return
      // Re-centre on the point currently `dy` below the marker, which lifts the
      // marker the same distance above the geometric centre of the viewport.
      const screen = map.project([lng, lat])
      map.jumpTo({ center: map.unproject([screen.x, screen.y + dy]) })
    }

    const easeToMarker = (lng: number, lat: number, duration: number, zoom?: number) => {
      if (disposed) return
      map.easeTo({
        center: [lng, lat],
        zoom,
        offset: [0, -visualOffset()],
        duration,
        easing: DAMPED,
      })
    }

    const isDrifting = (lng: number, lat: number): boolean => {
      const width = container.clientWidth
      const band = comfortBand()
      // Nowhere comfortable to put it: better to sit still than to re-ease
      // every few seconds and never settle.
      if (!band || width <= 0) return false
      const padX = Math.max(48, Math.min(140, width * 0.24))
      if (padX >= width - padX) return false
      const screen = map.project([lng, lat])
      return (
        screen.x < padX || screen.x > width - padX || screen.y < band.top || screen.y > band.bottom
      )
    }

    const syncHalo = () => {
      const metresPerPixel =
        (METRES_PER_PIXEL_Z0 * Math.cos((positionRef.current.lat * Math.PI) / 180)) /
        Math.pow(2, map.getZoom())
      const diameter = metresPerPixel > 0 ? (2 * accuracyRef.current) / metresPerPixel : 120
      handle.setAccuracyPx(Math.min(240, Math.max(76, diameter)))
    }

    const zoomBy = (delta: number) => {
      if (disposed) return
      const { lat, lng } = positionRef.current
      const next = Math.min(20, Math.max(2, map.getZoom() + delta))
      // Zooming around the marker keeps it pinned under the thumb; when the
      // user has wandered off, zoom around whatever they are looking at.
      map.easeTo(
        followingRef.current
          ? { zoom: next, around: [lng, lat], duration: 340, easing: DAMPED }
          : { zoom: next, duration: 340, easing: DAMPED },
      )
    }

    apiRef.current = { visualOffset, snapTo, easeToMarker, syncHalo, isDrifting, zoomBy }

    // --------------------------------------------------------------- events

    let readyMarked = false
    const markReady = () => {
      if (disposed || readyMarked) return
      readyMarked = true
      setReady(true)
    }

    const onError = (event: maplibregl.ErrorEvent) => {
      if (disposed) return
      // Tile and source errors surface here too, carrying the tile or source
      // they came from. Only a style document that never parsed is worth
      // swapping the whole map for, and only once per theme.
      const detail = event as unknown as { tile?: unknown; sourceId?: unknown }
      if (detail.tile !== undefined || detail.sourceId !== undefined) return
      let styleLoaded = false
      try {
        styleLoaded = map.isStyleLoaded() === true
      } catch {
        styleLoaded = false
      }
      if (styleLoaded || fallbackAppliedFor === theme) return
      fallbackAppliedFor = theme
      try {
        map.setStyle(fallbackStyle(theme))
      } catch {
        /* nothing else to try; the warm page colour stays behind the overlay */
      }
    }

    const onUserMove = (event: maplibregl.MapMovementEvent) => {
      // Programmatic camera moves arrive without an originating DOM event.
      if (!event.originalEvent) return
      followingRef.current = false
      setFollowing(false)
    }

    const onZoom = () => syncHalo()

    const onScheme = (event: MediaQueryListEvent) => {
      const next: MapTheme = event.matches ? 'dark' : 'light'
      if (next === theme || disposed) return
      theme = next
      fallbackAppliedFor = null
      try {
        map.setStyle(mapStyleUrl(next))
      } catch {
        /* keep whatever style is already up */
      }
    }

    map.on('load', markReady)
    map.on('idle', markReady)
    map.on('error', onError)
    map.on('movestart', onUserMove)
    map.on('zoomstart', onUserMove)
    map.on('zoom', onZoom)
    media.addEventListener('change', onScheme)

    const readyTimer = window.setTimeout(markReady, READY_TIMEOUT_MS)

    syncHalo()

    return () => {
      disposed = true
      window.clearTimeout(readyTimer)
      media.removeEventListener('change', onScheme)
      map.off('load', markReady)
      map.off('idle', markReady)
      map.off('error', onError)
      map.off('movestart', onUserMove)
      map.off('zoomstart', onUserMove)
      map.off('zoom', onZoom)
      marker.remove()
      map.remove()
      mapRef.current = null
      markerRef.current = null
      handleRef.current = null
      apiRef.current = null
      destinationRef.current = null
      followingRef.current = true
      setFollowing(true)
      setReady(false)
    }
    // Created once. Everything that changes is pushed in through the refs and
    // the update effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ----------------------------------------------------------------- ticks

  useEffect(() => {
    positionRef.current = { lat: latitude, lng: longitude }
    accuracyRef.current = accuracyMeters

    const marker = markerRef.current
    const handle = handleRef.current
    const api = apiRef.current
    if (!marker || !handle || !api) return

    marker.setLngLat([longitude, latitude])
    handle.setHeading(heading)
    api.syncHalo()

    if (destinationRef.current !== destinationId) {
      // A new city. Cut to it rather than animating across an ocean, and take
      // the follow back — the user's old pan belonged to a different place.
      destinationRef.current = destinationId
      followingRef.current = true
      setFollowing(true)
      lastEaseRef.current = Date.now()
      api.snapTo(longitude, latitude)
      return
    }

    if (!followingRef.current) return

    const now = Date.now()
    if (now - lastEaseRef.current < EASE_COOLDOWN_MS) return
    if (!api.isDrifting(longitude, latitude)) return
    lastEaseRef.current = now
    api.easeToMarker(longitude, latitude, 1400)
  }, [latitude, longitude, heading, accuracyMeters, destinationId])

  useEffect(() => {
    handleRef.current?.setName(displayName)
  }, [displayName])

  // --------------------------------------------------------------- controls

  const recenter = useCallback(() => {
    const map = mapRef.current
    const api = apiRef.current
    if (!map || !api) return
    followingRef.current = true
    setFollowing(true)
    lastEaseRef.current = Date.now()
    const { lat, lng } = positionRef.current
    // If they zoomed out to look at the country, come back to street level.
    const zoom = map.getZoom() < 12.5 ? INITIAL_ZOOM : undefined
    api.easeToMarker(lng, lat, 900, zoom)
  }, [])

  const zoomIn = useCallback(() => apiRef.current?.zoomBy(0.9), [])
  const zoomOut = useCallback(() => apiRef.current?.zoomBy(-0.9), [])

  return { containerRef, ready, following, recenter, zoomIn, zoomOut }
}
