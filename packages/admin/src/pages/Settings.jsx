import { useState, useEffect } from 'react'
import BilingualField from '../components/BilingualField'
import { Toast } from '../components/Toast'
import apiClient from '../lib/api'

function Settings() {
  // Form state
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [addressEn, setAddressEn] = useState('')
  const [addressBn, setAddressBn] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')

  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  // Fetch current settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true)
        const response = await apiClient.get('/api/content/settings')
        const contentMap = {}
        // Flatten the response into a map by fieldKey
        response.data.forEach((item) => {
          const key = item.fieldKey
          contentMap[key] = {
            en: item.valueEn,
            bn: item.valueBn,
          }
        })

        // Populate form from fetched data
        setPhone(contentMap.phone?.en || '')
        setEmail(contentMap.email?.en || '')
        setAddressEn(contentMap.address?.en || '')
        setAddressBn(contentMap.address?.bn || '')
        setFacebookUrl(contentMap.facebook_url?.en || '')
      } catch (error) {
        showToast('Failed to load settings', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    try {
      // Save each field as a separate PATCH call
      const updates = [
        { fieldKey: 'phone', valueEn: phone, valueBn: null },
        { fieldKey: 'email', valueEn: email, valueBn: null },
        { fieldKey: 'address', valueEn: addressEn, valueBn: addressBn },
        { fieldKey: 'facebook_url', valueEn: facebookUrl, valueBn: null },
      ]

      // In production, batch these into one call or use Promise.all
      // For now, send them sequentially
      for (const update of updates) {
        await apiClient.patch(`/api/admin/content/settings/${update.fieldKey}`, {
          valueEn: update.valueEn,
          valueBn: update.valueBn,
        })
      }

      showToast('Settings saved successfully', 'success')
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to save settings'
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section>
        <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
        <p className="text-gray-500">Loading settings...</p>
      </section>
    )
  }

  return (
    <section className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Site Settings</h1>
        <p className="text-gray-600">Manage your NGO's basic contact information and social links.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <fieldset className="space-y-6">
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
              Phone Number*
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+91 xxxxx xxxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">E.g., +91 08420119790</p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address*
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="info@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Address (Bilingual) */}
          <BilingualField
            label="Address"
            enValue={addressEn}
            bnValue={addressBn}
            onEnChange={setAddressEn}
            onBnChange={setAddressBn}
            type="textarea"
            required
          />

          {/* Facebook URL */}
          <div>
            <label htmlFor="facebook_url" className="block text-sm font-semibold text-gray-900 mb-2">
              Facebook Page URL
            </label>
            <input
              id="facebook_url"
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/yourpage"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Full URL starting with https://</p>
          </div>
        </fieldset>

        {/* Save Button */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </section>
  )
}

export default Settings
