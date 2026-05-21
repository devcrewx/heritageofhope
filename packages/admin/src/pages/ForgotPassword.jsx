import { useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../lib/api'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await apiClient.post('/api/admin/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>
        <div style={{ width: 'min(420px, 92vw)', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.2rem 1.2rem 1rem', textAlign: 'center' }}>
          <h1 style={{ marginTop: 0, marginBottom: '0.35rem' }}>Check Your Email</h1>
          <p style={{ marginTop: 0, marginBottom: '1.5rem', color: '#475569', lineHeight: 1.6 }}>
            If an account exists with that email, we&apos;ve sent a password reset link.
            It expires in 1 hour.
          </p>
          <Link to="/login" style={{ color: '#0f172a', fontWeight: 600 }}>Back to Login</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>
      <form
        onSubmit={handleSubmit}
        style={{ width: 'min(420px, 92vw)', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.2rem 1.2rem 1rem' }}
      >
        <h1 style={{ marginTop: 0, marginBottom: '0.35rem' }}>Forgot Password</h1>
        <p style={{ marginTop: 0, marginBottom: '1rem', color: '#475569' }}>
          Enter your email address and we&apos;ll send you a reset link.
        </p>

        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.55rem', padding: '0.65rem 0.7rem' }}
        />

        {error ? (
          <p style={{ color: '#b91c1c', marginBottom: '0.75rem' }}>{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', border: 0, borderRadius: '0.55rem', padding: '0.7rem 0.9rem', background: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer', marginBottom: '0.75rem' }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <Link to="/login" style={{ display: 'block', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>
          Back to Login
        </Link>
      </form>
    </main>
  )
}

export default ForgotPassword
