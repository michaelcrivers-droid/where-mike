/**
 * Map tiles.
 *
 * OpenFreeMap serves complete MapLibre vector styles of the full OpenStreetMap
 * planet with no API key, no account and no billing relationship — which is
 * the whole reason this app can run at zero monthly cost. Swapping providers
 * means changing the two URLs below and nothing else.
 *
 * If a provider ever disappears, MapLibre will fire a style error and the app
 * falls back to the raster style defined here, which needs no key either.
 */

import type { StyleSpecification } from 'maplibre-gl'

export type MapTheme = 'light' | 'dark'

const VECTOR_STYLES: Record<MapTheme, string> = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
}

/**
 * Last-resort raster style. Plain OSM tiles, no key required. Only used when
 * the vector style fails to load, so normal traffic never touches it.
 */
const RASTER_FALLBACK: Record<MapTheme, StyleSpecification> = {
  light: rasterStyle('#eef0f2'),
  dark: rasterStyle('#111316'),
}

function rasterStyle(background: string): StyleSpecification {
  return {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        maxzoom: 19,
        attribution: '© OpenStreetMap contributors',
      },
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': background } },
      { id: 'osm', type: 'raster', source: 'osm' },
    ],
  }
}

export function mapStyleUrl(theme: MapTheme): string {
  return VECTOR_STYLES[theme]
}

export function fallbackStyle(theme: MapTheme): StyleSpecification {
  return RASTER_FALLBACK[theme]
}

/** Shown in the corner of the map. Required by the tile licence. */
export const ATTRIBUTION_HTML =
  '<a href="https://openfreemap.org" target="_blank" rel="noreferrer noopener">OpenFreeMap</a> · ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer noopener">© OpenStreetMap</a>'
