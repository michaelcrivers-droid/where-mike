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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
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
