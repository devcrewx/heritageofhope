import { useState, useEffect } from 'react'
import BilingualField from '../components/BilingualField'
import { useApi } from '../hooks/useApi'

export default function ContactEditor() {
  const { request } = useApi()
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await request('/api/admin/content/settings')
      if (response.success) {
        setData(response.sections || {})
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    }
  }

  const updateField = (section, fieldKey, value) => {
    setData({
      ...data,
      [section]: {
        ...data[section],
        [fieldKey]: { en: value },
      },
    })
  }

  const saveSection = async (section) => {
    setSaving(true)
    try {
      const updates = data[section] || {}
      await Promise.all(
        Object.entries(updates).map(([fieldKey, values]) =>
          request(`/api/admin/content/settings/${fieldKey}`, {
            method: 'PATCH',
            body: JSON.stringify(values),
          })
        )
      )
      setMessage('✓ Saved successfully')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const styles = {
    container: { maxWidth: '900px' },
    section: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' },
    title: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' },
    label: { display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' },
    input: { padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem', width: '100%', fontSize: '0.95rem', marginBottom: '1rem' },
    button: { padding: '0.6rem 1.25rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600, marginTop: '1.25rem' },
  }

  const messageStyle = {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '0.4rem',
    fontSize: '0.9rem',
    background: message.includes('✗') ? '#fee2e2' : '#dbeafe',
    color: message.includes('✗') ? '#991b1b' : '#0c4a6e',
  }

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Contact Page Editor</h1>
      <p style={{ marginBottom: '1.25rem', color: '#475569' }}>These values power the public Contact page and footer.</p>

      <div style={styles.section}>
        <div style={styles.title}>Contact Information</div>
        <label style={styles.label}>Phone Number</label>
        <input
          type="tel"
          value={data.contact?.phone?.en || ''}
          onChange={(e) => updateField('contact', 'phone', e.target.value)}
          placeholder="+91 08420119790"
          style={styles.input}
        />
        <label style={styles.label}>Email Address</label>
        <input
          type="email"
          value={data.contact?.email?.en || ''}
          onChange={(e) => updateField('contact', 'email', e.target.value)}
          placeholder="heritageofhopefoundation@gmail.com"
          style={styles.input}
        />
        <label style={styles.label}>Address</label>
        <input
          type="text"
          value={data.contact?.address?.en || ''}
          onChange={(e) => updateField('contact', 'address', e.target.value)}
          placeholder="Sukantapally, Subhas Gram, 700147, South 24 Pgs, WB"
          style={styles.input}
        />
        <label style={styles.label}>Facebook Page URL</label>
        <input
          type="url"
          value={data.contact?.facebookUrl?.en || ''}
          onChange={(e) => updateField('contact', 'facebookUrl', e.target.value)}
          placeholder="https://facebook.com/..."
          style={styles.input}
        />
        <button onClick={() => saveSection('contact')} disabled={saving} style={styles.button}>
          {saving ? 'Saving...' : 'Save Contact Info'}
        </button>
        {message && <div style={messageStyle}>{message}</div>}
      </div>
    </div>
  )
}
