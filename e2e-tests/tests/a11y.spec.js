const { test, expect } = require('@playwright/test')
const AxeBuilder = require('@axe-core/playwright').default

const WEB_URL = process.env.WEB_URL || 'https://web-peach-six-y2ufgnodmc.vercel.app'
const ADMIN_URL = process.env.ADMIN_URL || 'https://admin-nine-beige-85.vercel.app'

test.describe('Web — Accessibility audit', () => {
  const pages = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/programs', name: 'Programs' },
    { path: '/gallery', name: 'Gallery' },
    { path: '/contact', name: 'Contact' },
    { path: '/get-involved', name: 'Get Involved' },
  ]

  for (const { path, name } of pages) {
    test(`${name} page has no critical a11y violations`, async ({ page }) => {
      await page.goto(`${WEB_URL}${path}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)

      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')).toEqual([])
    })
  }
})

test.describe('Admin — Accessibility audit', () => {
  test('Login page has no critical a11y violations', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/login`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')).toEqual([])
  })
})
