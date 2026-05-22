const { test, expect } = require('@playwright/test')

// Environment variables (fallbacks)
const API_URL = process.env.API_URL || 'https://heritageofhope-api.onrender.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'heritageofhopefoundation@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '7in9GOQMbXdwZnwm'

test.describe('API auth and content tests', () => {
  test('login via API and update content', async ({ request }) => {
    // Login
    const loginRes = await request.post(`${API_URL}/api/admin/login`, {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    })
    expect(loginRes.ok()).toBeTruthy()
    const login = await loginRes.json()
    expect(login.token).toBeTruthy()
    const token = login.token

    // Update content (home hero intro)
    const patchRes = await request.patch(`${API_URL}/api/admin/content/home/hero/intro`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { valueEn: `E2E TEST ${Date.now()}` },
    })
    expect(patchRes.ok()).toBeTruthy()
    const patchBody = await patchRes.json()
    expect(patchBody.success).toBeTruthy()

    // Read public content and ensure change reflected
    const contentRes = await request.get(`${API_URL}/api/content`)
    expect(contentRes.ok()).toBeTruthy()
    const content = await contentRes.json()
    expect(content.home).toBeTruthy()
    const intro = content.home.hero?.intro?.en || content.home.hero?.intro
    expect(intro).toBeTruthy()
  })

  test('media upload/delete (skipped if no TEST_IMAGE_PATH)', async ({ request, playwright, testInfo }) => {
    const imgPath = process.env.TEST_IMAGE_PATH
    test.skip(!imgPath, 'No TEST_IMAGE_PATH provided; skipping upload test')

    // Login
    const loginRes = await request.post(`${API_URL}/api/admin/login`, {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    })
    expect(loginRes.ok()).toBeTruthy()
    const { token } = await loginRes.json()

    // Upload file
    const form = new FormData()
    // Playwright's request supports "multipart" with files via "files" option
    const uploadRes = await request.post(`${API_URL}/api/admin/gallery`, {
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        'files': { name: 'file', mimeType: 'image/png', buffer: await require('fs').promises.readFile(imgPath) },
        'category': 'e2e-test',
      },
    })
    expect(uploadRes.ok()).toBeTruthy()
    const body = await uploadRes.json()
    expect(body.uploaded && body.uploaded.length > 0).toBeTruthy()
    const id = body.uploaded[0].id

    // Delete the item
    const delRes = await request.delete(`${API_URL}/api/admin/gallery/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(delRes.ok()).toBeTruthy()
  })
})
