#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const API_URL = process.env.API_URL || 'http://localhost:4010'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@heritageofhope.org'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Welcome@123'
const TEST_IMAGE_PATH = process.env.TEST_IMAGE_PATH || ''

async function main() {
  try {
    console.log('Logging in...')
    const loginRes = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    })

    if (!loginRes.ok) {
      const t = await loginRes.text()
      throw new Error(`Login failed: ${loginRes.status} ${t}`)
    }

    const login = await loginRes.json()
    const token = login.token
    console.log('Login successful, token received')

    console.log('Patching content...')
    const patchRes = await fetch(`${API_URL}/api/admin/content/home/hero/intro`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ valueEn: `AUTOTEST ${new Date().toISOString()}` }),
    })
    if (!patchRes.ok) {
      const t = await patchRes.text()
      throw new Error(`Patch failed: ${patchRes.status} ${t}`)
    }
    console.log('Content patched')

    console.log('Verifying public content...')
    const contentRes = await fetch(`${API_URL}/api/content`)
    if (!contentRes.ok) throw new Error(`Failed fetching content: ${contentRes.status}`)
    const content = await contentRes.json()
    console.log('Public content fetched')

    if (TEST_IMAGE_PATH) {
      console.log('Uploading test image via curl:', TEST_IMAGE_PATH)
      // Use curl to upload multipart file with explicit MIME type for webp
      const ext = path.extname(TEST_IMAGE_PATH).toLowerCase()
      const mimeType = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg'
      const curlCmd = `curl -s -X POST '${API_URL}/api/admin/gallery' \
        -H 'Authorization: Bearer ${token}' \
        -F 'files=@${path.resolve(TEST_IMAGE_PATH)};type=${mimeType}' \
        -F 'category=e2e-test' | jq .`
      
      try {
        const output = execSync(curlCmd, { encoding: 'utf-8', shell: '/bin/bash' })
        const body = JSON.parse(output)
        if (!body.uploaded || body.uploaded.length === 0) {
          throw new Error(`Upload returned no items: ${output}`)
        }
        console.log('Upload successful, got', body.uploaded.length, 'item(s)')
        const id = body.uploaded[0].id

        console.log('Deleting uploaded item id', id)
        const delRes = await fetch(`${API_URL}/api/admin/gallery/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!delRes.ok) {
          const t = await delRes.text()
          throw new Error(`Delete failed: ${delRes.status} ${t}`)
        }
        console.log('Delete successful')
      } catch (curlErr) {
        throw new Error(`Upload failed: ${curlErr.message}`)
      }
    } else {
      console.log('No TEST_IMAGE_PATH provided — skipping upload/delete')
    }

    console.log('All checks passed')
    process.exit(0)
  } catch (err) {
    console.error('E2E tests failed:', err.message)
    process.exit(2)
  }
}

// Node 18+ has global fetch
if (typeof fetch === 'undefined') {
  global.fetch = (...args) => import('node-fetch').then(m => m.default(...args))
}

main()
