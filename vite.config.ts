import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  // Relative paths keep a build host-agnostic: the same `dist/` works on any
  // static host and from the filesystem. GitHub Pages project sites live under
  // a repo-name prefix and need deep links like /where-mike/control to resolve
  // assets correctly, so CI sets VITE_BASE=/where-mike/ for an absolute base.
  base: process.env.VITE_BASE || './',
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    // MapLibre spins up a web worker to decode vector tiles. Running it
    // through Vite's dependency pre-bundler breaks that worker in dev: the
    // style, TileJSON and sprites all load, the canvas sizes correctly, and
    // then no tile ever finishes — a blank map with nothing in the console,
    // because the failure happens off the main thread. Serving the package's
    // own ESM build keeps the worker intact.
    exclude: ['maplibre-gl'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  worker: {
    // MapLibre asks for its worker with `{ type: 'module' }`, so the emitted
    // worker bundle has to be an ES module too.
    format: 'es',
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        // MapLibre is by far the heaviest dependency. Splitting it out lets
        // the shell paint and stay cached while the map engine streams in.
        manualChunks(id) {
          if (id.includes('node_modules/maplibre-gl')) return 'maplibre'
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
