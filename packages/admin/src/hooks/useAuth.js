import { useEffect, useState } from 'react'
import apiClient from '../lib/api'

const TOKEN_KEY = 'hoh_admin_token'
const USER_KEY = 'hoh_admin_user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(readStoredUser())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!token) {
        if (!cancelled) setReady(true)
        return
      }

      try {
        const result = await apiClient.get('/api/admin/me')
        if (!cancelled) {
          setUser(result.data.user)
          localStorage.setItem(USER_KEY, JSON.stringify(result.data.user))
        }
      } catch {
        if (!cancelled) {
          setToken('')
          setUser(null)
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [token])

  async function login(email, password) {
    const result = await apiClient.post('/api/admin/login', { email, password })

    setToken(result.data.token)
    setUser(result.data.user)
    localStorage.setItem(TOKEN_KEY, result.data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.data.user))

    return result.data
  }

  function logout() {
    setToken('')
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    token,
    user,
    ready,
    isAuthenticated: Boolean(token),
    login,
    logout,
  }
}
