import { useCallback } from 'react'
import { useAuth } from './useAuth'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export function useApi() {
  const { token } = useAuth()

  const request = useCallback(
    async (endpoint, options = {}) => {
      const url = `${API_BASE}${endpoint}`
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      }

      const config = {
        ...options,
        headers,
      }

      const response = await fetch(url, config)

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || `HTTP ${response.status}`)
      }

      return response.json()
    },
    [token]
  )

  return {
    request,
    get: (endpoint) => request(endpoint, { method: 'GET' }),
    post: (endpoint, data) =>
      request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    patch: (endpoint, data) =>
      request(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
  }
}
