/**
 * Points MapLibre at a worker the bundler actually produced.
 *
 * MapLibre v6 works out where its tile-decoding worker lives by taking its own
 * `import.meta.url` and looking for `maplibre-gl-worker.mjs` next to it. That
 * holds for the package's own `dist/` layout and stops holding the moment a
 * bundler renames and rehashes the entry: the lookup resolves to a file that
 * was never emitted, the request 404s, a static host answers with index.html,
 * and the browser refuses it for having the wrong MIME type.
 *
 * The failure is quiet in a way that costs an afternoon. It happens on a
 * worker thread, so nothing reaches the page's error handler; the style,
 * TileJSON and sprites all load over HTTP as normal; the canvas sizes itself
 * correctly and the marker sits where it should. The only symptom is that no
 * tile ever arrives, leaving a blank background that looks like a styling
 * problem rather than a broken worker.
 *
 * `?worker&url` asks Vite to bundle the worker together with the shared chunk
 * it imports and hand back the emitted URL, which `setWorkerUrl` then makes
 * authoritative. Works the same in dev and in a production build, under any
 * base path.
 */

import { setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

// Applied as the module loads rather than from inside an effect. MapLibre
// resolves the worker URL the first time it needs a worker, and a component
// effect is late enough that one request can already have gone out to the
// default path. This module is only reachable from the map chunk, so the cost
// is paid exactly when the map is about to be built anyway.
setWorkerUrl(workerUrl)

/**
 * Explicit no-op-if-already-done entry point, so the call site reads as
 * intentional configuration rather than relying on import order.
 */
export function configureMapRuntime(): void {
  setWorkerUrl(workerUrl)
}
