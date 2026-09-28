import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

// Multi-page app: every static HTML page in the repo must be declared as a
// Rollup input, otherwise `vite build` only emits `index.html` and the
// sub-pages (which are linked from the footer) end up as 404s in production.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        vagusExercises: resolve(root, 'vagusnerv-uebungen/index.html'),
        tavnsStudies: resolve(root, 'tavns-studien/index.html'),
        faqVagusStimulation: resolve(root, 'faq-vagusnerv-stimulation/index.html'),
      },
    },
  },
})
