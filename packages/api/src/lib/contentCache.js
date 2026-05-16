/**
 * Simple in-memory cache for site content
 * Reduces strain on Supabase free tier connection pool (max 15)
 */

let cachedContent = null
let cacheTime = null
const CACHE_TTL = 60 * 1000 // 1 minute

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

export function invalidateCache() {
  cachedContent = null
  cacheTime = null
}
