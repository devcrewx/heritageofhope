export async function apiFetch(path, opts = {}) {
  const base = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:4010'
  const headers = opts.headers || {}
  const token = (typeof localStorage !== 'undefined' && localStorage.getItem('token')) || null
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${base}${path}`, { ...opts, headers })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`API ${res.status} ${errText}`)
  }
  return res.json()
}
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4010'

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hoh_admin_token') || localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hoh_admin_token')
      localStorage.removeItem('adminToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient

