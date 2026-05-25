import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(viteConfig, defineConfig({
  define: {
    'import.meta.env.VITE_WEB_ORIGIN': JSON.stringify('http://localhost:5173'),
    'import.meta.env.VITE_API_BASE': JSON.stringify('http://localhost:4010'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
    include: ['src/**/*.test.{js,jsx}'],
  },
}))
