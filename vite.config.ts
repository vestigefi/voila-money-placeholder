import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    nodePolyfills({
      exclude: [],
      protocolImports: true
    })
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}']
  },
  root: './',
  build: {
    outDir: 'dist'
  },
  publicDir: 'src/public'
})
