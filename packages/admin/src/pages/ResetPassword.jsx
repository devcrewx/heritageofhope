import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import apiClient from '../lib/api'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await apiClient.post('/api/admin/reset-password', { token, newPassword })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>
        <div style={{ width: 'min(420px, 92vw)', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.2rem 1.2rem 1rem', textAlign: 'center' }}>
          <h1 style={{ marginTop: 0, marginBottom: '0.35rem' }}>Invalid Link</h1>
          <p style={{ marginTop: 0, marginBottom: '1.5rem', color: '#475569' }}>
            This reset link is missing a token. Please request a new password reset.
          </p>
          <Link to="/forgot-password" style={{ color: '#0f172a', fontWeight: 600 }}>Request Reset Link</Link>
        </div>
      </main>
    )
  }

  if (done) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>
        <div style={{ width: 'min(420px, 92vw)', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.2rem 1.2rem 1rem', textAlign: 'center' }}>
          <h1 style={{ marginTop: 0, marginBottom: '0.35rem' }}>Password Reset</h1>
          <p style={{ marginTop: 0, marginBottom: '1.5rem', color: '#475569' }}>
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <Link to="/login" style={{ color: '#0f172a', fontWeight: 600 }}>Sign In</Link>
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
        <h1 style={{ marginTop: 0, marginBottom: '0.35rem' }}>Reset Password</h1>
        <p style={{ marginTop: 0, marginBottom: '1rem', color: '#475569' }}>
          Enter your new password.
        </p>

        <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>New Password</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          style={{ width: '100%', marginBottom: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.55rem', padding: '0.65rem 0.7rem' }}
        />

        <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>Confirm New Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
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
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </main>
  )
}

export default ResetPassword
