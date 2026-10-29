import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vitest/config'

// GitHub Pages has no SPA fallback: it serves 404.html for unknown paths, so a copy of
// index.html there lets the client router handle deep links and refreshes.
function spaFallback(): Plugin {
  return {
    name: 'spa-fallback',
    enforce: 'post',
    generateBundle(_, bundle) {
      const index = bundle['index.html']
      if (index?.type === 'asset') {
        this.emitFile({
          type: 'asset',
          fileName: '404.html',
          source: index.source,
        })
      }
    },
  }
}

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/quantum_simulator/' : '/',
  build: {
    // Three.js (~540 kB) lives only in lazy simulator chunks; the main bundle is the one to keep small.
    chunkSizeWarningLimit: 700,
  },
  plugins: [react(), tailwindcss(), spaFallback()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/shared/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
}))
