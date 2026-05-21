import { defineConfig } from 'vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  plugins: [
    sentryVitePlugin({
      org: 'devcrewx-j0',
      project: 'heritageofhope-web',
      telemetry: false,
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:4010',
    },
  },
  build: {
    sourcemap: true,
  },
})
