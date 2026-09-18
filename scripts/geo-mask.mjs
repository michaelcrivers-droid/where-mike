/**
 * Point-in-land / point-in-lake testing against Natural Earth 10m polygons.
 *
 * This runs at data-build time only — nothing here ships to the browser. The
 * output is a 16-bit "which compass sectors around this city are dry land"
 * mask baked into the destination dataset, which is how the runtime roaming
 * engine guarantees it never drops the marker in the sea.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const CACHE_DIR = join(HERE, '.cache')

const SOURCES = {
  land: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_land.geojson',
  lakes: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson',
}

/** Latitude band height, in degrees, for the per-polygon edge index. */
const BAND = 0.5
/** Cell size, in degrees, for the coarse polygon lookup grid. */
const CELL = 5

async function loadGeoJson(kind) {
  await mkdir(CACHE_DIR, { recursive: true })
  const path = join(CACHE_DIR, `${kind}.geojson`)
  if (!existsSync(path)) {
    process.stdout.write(`  downloading ${kind} polygons…\n`)
    const res = await fetch(SOURCES[kind])
    if (!res.ok) throw new Error(`${kind}: HTTP ${res.status}`)
    await writeFile(path, Buffer.from(await res.arrayBuffer()))
  }
  return JSON.parse(await readFile(path, 'utf8'))
}

/** Flatten a GeoJSON feature collection into a list of `[outerRing, ...holes]`. */
function collectPolygons(geojson) {
  const polys = []
  for (const feature of geojson.features) {
    const g = feature.geometry
    if (!g) continue
    if (g.type === 'Polygon') polys.push(g.coordinates)
    else if (g.type === 'MultiPolygon') polys.push(...g.coordinates)
  }
  return polys
}

/**
 * Index one polygon so a horizontal ray cast only has to look at the edges
 * that actually span the query latitude.
 */
function indexPolygon(rings) {
  let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90
  const indexedRings = rings.map((ring) => {
    const bands = new Map()
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [x1, y1] = ring[j]
      const [x2, y2] = ring[i]
      if (y1 === y2) continue // horizontal edges never toggle a crossing
      const edge = [x1, y1, x2, y2]
      const lo = Math.floor(Math.min(y1, y2) / BAND)
      const hi = Math.floor(Math.max(y1, y2) / BAND)
      for (let b = lo; b <= hi; b++) {
        let bucket = bands.get(b)
        if (!bucket) bands.set(b, (bucket = []))
        bucket.push(edge)
      }
    }
    for (const [x, y] of ring) {
      if (x < minLng) minLng = x
      if (x > maxLng) maxLng = x
      if (y < minLat) minLat = y
      if (y > maxLat) maxLat = y
    }
    return bands
  })
  return { rings: indexedRings, bbox: [minLng, minLat, maxLng, maxLat] }
}

/** Odd-even ray cast to the east, using only the band the point sits in. */
function inRing(bands, lng, lat) {
  const bucket = bands.get(Math.floor(lat / BAND))
  if (!bucket) return false
  let inside = false
  for (let k = 0; k < bucket.length; k++) {
    const e = bucket[k]
    const y1 = e[1], y2 = e[3]
    if (y1 > lat !== y2 > lat) {
      const x1 = e[0], x2 = e[2]
      if (lng < ((x2 - x1) * (lat - y1)) / (y2 - y1) + x1) inside = !inside
    }
  }
  return inside
}

function inPolygon(poly, lng, lat) {
  const [minLng, minLat, maxLng, maxLat] = poly.bbox
  if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) return false
  if (!inRing(poly.rings[0], lng, lat)) return false
  for (let i = 1; i < poly.rings.length; i++) {
    if (inRing(poly.rings[i], lng, lat)) return false // inside a hole
  }
  return true
}

function buildGrid(polys) {
  const grid = new Map()
  polys.forEach((poly, idx) => {
    const [minLng, minLat, maxLng, maxLat] = poly.bbox
    for (let x = Math.floor(minLng / CELL); x <= Math.floor(maxLng / CELL); x++) {
      for (let y = Math.floor(minLat / CELL); y <= Math.floor(maxLat / CELL); y++) {
        const key = `${x}:${y}`
        let cell = grid.get(key)
        if (!cell) grid.set(key, (cell = []))
        cell.push(idx)
      }
    }
  })
  return grid
}

export async function createLandOracle() {
  const [landGeo, lakesGeo] = await Promise.all([loadGeoJson('land'), loadGeoJson('lakes')])

  const land = collectPolygons(landGeo).map(indexPolygon)
  const lakes = collectPolygons(lakesGeo).map(indexPolygon)
  const landGrid = buildGrid(land)
  const lakeGrid = buildGrid(lakes)

  const hits = (grid, polys, lng, lat) => {
    const cell = grid.get(`${Math.floor(lng / CELL)}:${Math.floor(lat / CELL)}`)
    if (!cell) return false
    for (const idx of cell) if (inPolygon(polys[idx], lng, lat)) return true
    return false
  }

  return {
    landPolygonCount: land.length,
    lakePolygonCount: lakes.length,
    /** True when the coordinate is on dry land and not inside a mapped lake. */
    isLand: (lat, lng) => hits(landGrid, land, lng, lat) && !hits(lakeGrid, lakes, lng, lat),
  }
}
