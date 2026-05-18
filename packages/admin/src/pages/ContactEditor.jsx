import { useState, useEffect } from 'react'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useApi } from '../hooks/useApi'

export default function ContactEditor() {
  const { request } = useApi()
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [formErrors, setFormErrors] = useState({})

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
      setError(error.message)
    } finally {
      setInitialLoading(false)
    }
  }

  const updateField = (section, fieldKey, value) => {
    setFormErrors((current) => ({ ...current, [fieldKey]: '' }))
    setData({
      ...data,
      [section]: {
        ...data[section],
        [fieldKey]: { en: value },
      },
    })
  }

  const validateSection = () => {
    const nextErrors = {}
    const phone = data.contact?.phone?.en?.trim() || ''
    const email = data.contact?.email?.en?.trim() || ''
    const address = data.contact?.address?.en?.trim() || ''
    const facebookUrl = data.contact?.facebookUrl?.en?.trim() || ''

    if (!phone) {
      nextErrors.phone = 'Phone number is required.'
    } else if (!/^[+()\d\s-]{7,}$/.test(phone)) {
      nextErrors.phone = 'Enter a valid phone number.'
    }

    if (!email) {
      nextErrors.email = 'Email address is required.'
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!address) {
      nextErrors.address = 'Address is required.'
    }

    if (facebookUrl && !/^https?:\/\//i.test(facebookUrl)) {
      nextErrors.facebookUrl = 'Facebook URL must start with http:// or https://.'
    }

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const saveSection = async (section) => {
    if (!validateSection()) {
      return
    }

    setSaving(true)
    setError('')
    setStatusMessage('')
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
      setStatusMessage('Saved successfully')
    } catch (error) {
      setError(error.message)
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
    fieldError: { marginTop: '-0.5rem', marginBottom: '1rem', color: '#b91c1c', fontSize: '0.9rem' },
  }

  const successStyle = {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '0.4rem',
    fontSize: '0.9rem',
    background: '#dbeafe',
    color: '#0c4a6e',
  }

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Contact Page Editor</h1>
      <p style={{ marginBottom: '1.25rem', color: '#475569' }}>These values power the public Contact page and footer.</p>

      {initialLoading ? (
        <LoadingSpinner fullPage text="Loading contact settings..." />
      ) : (
        <>
          {error && <ErrorMessage error={error} onClose={() => setError('')} className="mb-4" />}
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
            {formErrors.phone && <div style={styles.fieldError}>{formErrors.phone}</div>}
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={data.contact?.email?.en || ''}
              onChange={(e) => updateField('contact', 'email', e.target.value)}
              placeholder="heritageofhopefoundation@gmail.com"
              style={styles.input}
            />
            {formErrors.email && <div style={styles.fieldError}>{formErrors.email}</div>}
            <label style={styles.label}>Address</label>
            <input
              type="text"
              value={data.contact?.address?.en || ''}
              onChange={(e) => updateField('contact', 'address', e.target.value)}
              placeholder="Sukantapally, Subhas Gram, 700147, South 24 Pgs, WB"
              style={styles.input}
            />
            {formErrors.address && <div style={styles.fieldError}>{formErrors.address}</div>}
            <label style={styles.label}>Facebook Page URL</label>
            <input
              type="url"
              value={data.contact?.facebookUrl?.en || ''}
              onChange={(e) => updateField('contact', 'facebookUrl', e.target.value)}
              placeholder="https://facebook.com/..."
              style={styles.input}
            />
            {formErrors.facebookUrl && <div style={styles.fieldError}>{formErrors.facebookUrl}</div>}

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={styles.title}>Contact Page Copy</div>
              <label style={styles.label}>Page Title</label>
              <input
                type="text"
                value={data.contact?.contact_page_title?.en || ''}
                onChange={(e) => updateField('contact', 'contact_page_title', e.target.value)}
                placeholder="We’d love to hear from you."
                style={styles.input}
              />
              <label style={styles.label}>Page Intro</label>
              <input
                type="text"
                value={data.contact?.contact_page_intro?.en || ''}
                onChange={(e) => updateField('contact', 'contact_page_intro', e.target.value)}
                placeholder="Reach out to us for inquiries, partnerships, or just to say hello."
                style={styles.input}
              />
              <label style={styles.label}>Response Time Label</label>
              <input
                type="text"
                value={data.contact?.contact_response_label?.en || ''}
                onChange={(e) => updateField('contact', 'contact_response_label', e.target.value)}
                placeholder="Response time"
                style={styles.input}
              />
              <label style={styles.label}>Response Time Value</label>
              <input
                type="text"
                value={data.contact?.contact_response_value?.en || ''}
                onChange={(e) => updateField('contact', 'contact_response_value', e.target.value)}
                placeholder="Usually within 2 business days"
                style={styles.input}
              />
              <label style={styles.label}>Form Label</label>
              <input
                type="text"
                value={data.contact?.contact_form_label?.en || ''}
                onChange={(e) => updateField('contact', 'contact_form_label', e.target.value)}
                placeholder="Contact form"
                style={styles.input}
              />
              <label style={styles.label}>Form Heading</label>
              <input
                type="text"
                value={data.contact?.contact_form_heading?.en || ''}
                onChange={(e) => updateField('contact', 'contact_form_heading', e.target.value)}
                placeholder="Send us a direct message"
                style={styles.input}
              />
            </div>

            <button onClick={() => saveSection('contact')} disabled={saving} style={styles.button}>
              {saving ? 'Saving...' : 'Save Contact Info'}
            </button>
            {statusMessage && <div style={successStyle}>{statusMessage}</div>}
          </div>
        </>
      )}
    </div>
  )
}
