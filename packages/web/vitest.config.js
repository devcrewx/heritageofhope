import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'import.meta.env.VITE_ADMIN_ORIGIN': JSON.stringify('http://localhost:5174'),
    'import.meta.env.VITE_API_BASE': JSON.stringify('http://localhost:4010'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
