const { test, expect } = require('@playwright/test')

const API_URL = process.env.API_URL || 'https://heritageofhope-api.onrender.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'heritageofhopefoundation@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '7in9GOQMbXdwZnwm'

async function login(request) {
  const res = await request.post(`${API_URL}/api/admin/login`, {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })
  expect(res.ok()).toBeTruthy()
  const { token } = await res.json()
  expect(token).toBeTruthy()
  return token
}

test.describe('Visual CMS integration', () => {
  test('login and verify content structure for preview', async ({ request }) => {
    const token = await login(request)

    // Fetch all content — this is the payload the preview iframe receives
    const contentRes = await request.get(`${API_URL}/api/content`)
    expect(contentRes.ok()).toBeTruthy()
    const content = await contentRes.json()

    // Verify pages used in the visual CMS exist
    const pages = ['home', 'about', 'programs', 'gallery', 'contact', 'donate', 'blog']
    for (const page of pages) {
      expect(content[page]).toBeTruthy()
    }
  })

  test('update content and verify it is readable via public API', async ({ request }) => {
    const token = await login(request)

    const testMarker = `E2E-VCMS-${Date.now()}`
    const patchRes = await request.patch(`${API_URL}/api/admin/content/home/hero/intro`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { valueEn: testMarker },
    })
    expect(patchRes.ok()).toBeTruthy()

    const contentRes = await request.get(`${API_URL}/api/content`)
    expect(contentRes.ok()).toBeTruthy()
    const content = await contentRes.json()

    const intro = content.home?.hero?.intro?.en || content.home?.hero?.intro
    expect(intro).toBe(testMarker)
  })

  test('all pages return valid content structure', async ({ request }) => {
    const contentRes = await request.get(`${API_URL}/api/content`)
    expect(contentRes.ok()).toBeTruthy()
    const content = await contentRes.json()

    // Each page should have a hero with intro and title
    for (const [page, data] of Object.entries(content)) {
      if (typeof data === 'object' && data !== null) {
        expect(data.hero).toBeDefined()
      }
    }
  })
})
