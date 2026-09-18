/**
 * The marker, as plain DOM.
 *
 * MapLibre wants one element it can own for the lifetime of the map, and React
 * would only get in the way of a node that moves once a second, so this builds
 * it by hand and hands back three setters. The element is created exactly once
 * per map; nothing here ever re-creates it.
 *
 * The look is its own: a warm cream ring around a circular photo, a soft
 * contact shadow on the "ground" beneath it, a slow breathing accuracy halo in
 * the accent colour, and — instead of the usual translucent beam — a small
 * arrow pip that orbits the outside of the ring to show which way the person
 * is facing.
 */

export interface MarkerHandle {
  element: HTMLElement
  /** Degrees clockwise from north, or null when stationary. */
  setHeading(heading: number | null): void
  /** Halo diameter in CSS pixels. */
  setAccuracyPx(px: number): void
  /** Drives the monogram shown if the photo fails to load. */
  setName(name: string): void
}

const PIP_SVG =
  '<svg class="wma-marker__pip" width="19" height="17" viewBox="0 0 19 17" aria-hidden="true">' +
  '<path d="M9.5 1.6 L17.4 15.2 H1.6 Z" fill="var(--wma-accent)" ' +
  'stroke="var(--wma-ring)" stroke-width="2.6" stroke-linejoin="round" />' +
  '</svg>'

function initialOf(name: string): string {
  const trimmed = name.trim()
  return trimmed.length > 0 ? trimmed.slice(0, 1).toUpperCase() : '·'
}

export function createMarkerElement(photoUrl: string, name: string): MarkerHandle {
  const root = document.createElement('div')
  root.className = 'wma-marker'
  // The status card already announces where the person is; a second reading of
  // the same fact from the map layer is just noise.
  root.setAttribute('aria-hidden', 'true')
  root.dataset.heading = 'false'

  const halo = document.createElement('div')
  halo.className = 'wma-marker__halo'

  const dir = document.createElement('div')
  dir.className = 'wma-marker__dir'
  dir.innerHTML = PIP_SVG

  const ground = document.createElement('div')
  ground.className = 'wma-marker__ground'

  const puck = document.createElement('div')
  puck.className = 'wma-marker__puck'

  const mono = document.createElement('div')
  mono.className = 'wma-marker__mono'
  mono.textContent = initialOf(name)

  const photo = document.createElement('img')
  photo.className = 'wma-marker__photo'
  photo.src = photoUrl
  photo.alt = ''
  photo.decoding = 'async'
  photo.draggable = false
  // A missing avatar should degrade to the monogram, never to a broken image.
  photo.addEventListener('error', () => {
    photo.style.display = 'none'
  })

  puck.append(mono, photo)
  root.append(halo, dir, ground, puck)

  // Headings wrap at 360; tracking a cumulative angle keeps the pip from
  // spinning the long way round when it crosses north.
  let displayed = 0
  let seeded = false

  return {
    element: root,
    setHeading(heading: number | null) {
      if (heading === null || !Number.isFinite(heading)) {
        root.dataset.heading = 'false'
        return
      }
      if (!seeded) {
        displayed = heading
        seeded = true
      } else {
        const delta = (((heading - displayed) % 360) + 540) % 360 - 180
        displayed += delta
      }
      root.dataset.heading = 'true'
      dir.style.setProperty('--wma-heading', `${displayed.toFixed(1)}deg`)
    },
    setAccuracyPx(px: number) {
      const safe = Number.isFinite(px) ? px : 120
      root.style.setProperty('--wma-halo', `${Math.round(safe)}px`)
    },
    setName(next: string) {
      mono.textContent = initialOf(next)
    },
  }
}
