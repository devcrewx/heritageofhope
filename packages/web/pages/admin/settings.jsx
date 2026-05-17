import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { API } from '../../lib/api'
import FormField from '../../components/FormField'
import Button from '../../components/Button'
import Toast from '../../components/Toast'

export default function AdminSettings() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    orgName: '',
    phone: '',
    email: '',
    address: '',
    facebookUrl: '',
    registeredBadge: '',
    estYear: '',
    navbarSubtitle: '',
    footerMission: '',
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/admin/settings`)
      const json = await res.json()

      if (json.success && json.data) {
        const data = {}
        Object.keys(formData).forEach((key) => {
          if (json.data[key]) {
            data[key] = json.data[key].en || ''
          }
        })
        setFormData((prev) => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      setToast({ type: 'error', message: 'Failed to load settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Filter out empty values
      const payload = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v.trim() !== ''))

      const res = await fetch(`${API}/admin/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (json.success) {
        setToast({
          type: 'success',
          message: `Updated ${Object.keys(json.data).length} setting(s)`,
        })
      } else {
        setToast({ type: 'error', message: json.error || 'Failed to update settings' })
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      setToast({ type: 'error', message: 'Failed to update settings' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-settings">
      <h1>Site Settings</h1>

      <form onSubmit={handleSubmit} className="settings-form">
        <fieldset>
          <legend>Organization Information</legend>

          <FormField
            label="Organization Name"
            name="orgName"
            value={formData.orgName}
            onChange={handleChange}
            placeholder="Heritage of Hope"
          />

          <FormField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+88 (0) 171 234 5678"
            type="tel"
          />

          <FormField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@heritageofhope.org"
            type="email"
          />

          <FormField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street, City, Country"
            multiline
            rows={3}
          />

          <FormField
            label="Establishment Year"
            name="estYear"
            value={formData.estYear}
            onChange={handleChange}
            placeholder="2020"
          />

          <FormField
            label="Registered Badge/Number"
            name="registeredBadge"
            value={formData.registeredBadge}
            onChange={handleChange}
            placeholder="Registration No. 12345"
          />
        </fieldset>

        <fieldset>
          <legend>Social & Web</legend>

          <FormField
            label="Facebook URL"
            name="facebookUrl"
            value={formData.facebookUrl}
            onChange={handleChange}
            placeholder="https://facebook.com/heritageofhope"
            type="url"
          />
        </fieldset>

        <fieldset>
          <legend>Homepage Content</legend>

          <FormField
            label="Navbar Subtitle"
            name="navbarSubtitle"
            value={formData.navbarSubtitle}
            onChange={handleChange}
            placeholder="Our Mission & Vision"
            maxLength="200"
          />

          <FormField
            label="Footer Mission Statement"
            name="footerMission"
            value={formData.footerMission}
            onChange={handleChange}
            placeholder="Our mission is to preserve cultural heritage..."
            multiline
            rows={4}
          />
        </fieldset>

        <div className="form-actions">
          <Button type="submit" disabled={loading} variant="primary">
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button type="button" onClick={loadSettings} disabled={loading} variant="secondary">
            Reload
          </Button>
        </div>
      </form>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        .admin-settings {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .admin-settings h1 {
          margin-bottom: 30px;
          color: #333;
        }

        .settings-form fieldset {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #fafafa;
        }

        .settings-form fieldset legend {
          padding: 0 10px;
          font-weight: 600;
          color: #333;
        }

        .settings-form label {
          display: block;
          margin-top: 15px;
          font-weight: 500;
          color: #444;
        }

        .settings-form input,
        .settings-form textarea {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-family: inherit;
          font-size: 14px;
        }

        .settings-form textarea {
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 30px;
        }

        .form-actions button {
          padding: 10px 20px;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}
