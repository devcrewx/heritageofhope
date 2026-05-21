import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'devcrewx-j0',
      project: 'heritageofhope-admin',
      telemetry: false,
    }),
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:4010',
    },
  },
  build: {
    sourcemap: true,
  },
})
