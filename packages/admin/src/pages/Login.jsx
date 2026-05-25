import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

function Login({ onLogin, isAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onLogin(email, password)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>
      <form
        onSubmit={handleSubmit}
        style={{ width: 'min(420px, 92vw)', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.2rem 1.2rem 1rem' }}
      >
        <h1 style={{ marginTop: 0, marginBottom: '0.35rem' }}>Admin Login</h1>
        <p style={{ marginTop: 0, marginBottom: '1rem', color: '#475569' }}>Sign in to manage website content.</p>

        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.55rem', padding: '0.65rem 0.7rem' }}
        />

        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.55rem', padding: '0.65rem 0.7rem' }}
        />

        {error ? (
          <p style={{ color: '#b91c1c', marginBottom: '0.75rem' }}>{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', border: 0, borderRadius: '0.55rem', padding: '0.7rem 0.9rem', background: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <Link to="/forgot-password" style={{ display: 'block', textAlign: 'center', marginTop: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
          Forgot Password?
        </Link>
      </form>
    </main>
  )
}

export default Login
