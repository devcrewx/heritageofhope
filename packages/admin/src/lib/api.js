import axios from 'axios'

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''
    : '')

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hoh_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestPath = error.config?.url || ''
    const isLoginRequest = requestPath.includes('/api/admin/login')

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('hoh_admin_token')
      localStorage.removeItem('adminToken')

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export async function request(...args) {
  if (args.length === 1) {
    const [endpoint] = args
    return apiClient.get(endpoint).then((response) => response.data)
  }

  const [methodOrEndpoint, endpointOrOptions, bodyOrUndefined, extraOptions = {}] = args

  if (typeof endpointOrOptions === 'string') {
    const method = String(methodOrEndpoint || 'GET').toUpperCase()
    const endpoint = endpointOrOptions
    const config = {
      method,
      url: endpoint,
      ...extraOptions,
    }

    if (bodyOrUndefined !== undefined) {
      if (bodyOrUndefined instanceof FormData) {
        config.data = bodyOrUndefined
        config.headers = { ...(config.headers || {}), 'Content-Type': 'multipart/form-data' }
      } else {
        config.data = bodyOrUndefined
      }
    }

    return apiClient.request(config).then((response) => response.data)
  }

  const endpoint = methodOrEndpoint
  const options = endpointOrOptions || {}
  return apiClient.request({ url: endpoint, ...options }).then((response) => response.data)
}

export async function apiFetch(path, opts = {}) {
  const response = await request(path, opts)
  return response
}

export default apiClient

