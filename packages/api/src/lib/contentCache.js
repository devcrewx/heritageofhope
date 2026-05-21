let cachedContent = null
let cacheTime = null
const CACHE_TTL = 60 * 1000
let lastSyncTime = 0
const SYNC_DEBOUNCE = 60 * 1000

const GITHUB_REPO = 'devcrewx/heritageofhope'

export function setCachedContent(content) {
  cachedContent = content
  cacheTime = Date.now()
}

export function getCachedContent() {
  if (!cachedContent || !cacheTime) return null
  const now = Date.now()
  if (now - cacheTime > CACHE_TTL) {
    cachedContent = null
    cacheTime = null
    return null
  }
  return cachedContent
}

function triggerSyncFallback() {
  const now = Date.now()
  if (now - lastSyncTime < SYNC_DEBOUNCE) return
  lastSyncTime = now

  const token = process.env.GITHUB_PAT
  if (!token) return

  fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'heritageofhope-api',
    },
    body: JSON.stringify({ event_type: 'sync-fallback' }),
  }).catch(() => {})
}

export function invalidateCache() {
  cachedContent = null
  cacheTime = null
  triggerSyncFallback()
}
