import { useEffect, useState } from 'react'
import BilingualField from '../components/BilingualField'
import { Toast } from '../components/Toast'
import apiClient from '../lib/api'

const fieldConfig = [
  { fieldKey: 'org_name', label: 'NGO Name', type: 'text', helper: 'Shown in the public header and footer.' },
  { fieldKey: 'navbar_subtitle', label: 'Navbar Subtitle', type: 'bilingual', helper: 'Short line under the brand name in the public header.' },
  { fieldKey: 'registered_badge', label: 'Registered Badge', type: 'bilingual', helper: 'Trust badge text shown on the home page.' },
  { fieldKey: 'est_year', label: 'Established Year', type: 'text', helper: 'Used in the trust strip on the home page.' },
  { fieldKey: 'footer_mission', label: 'Footer Mission Line', type: 'bilingual', helper: 'Short mission statement used in the public footer.' },
  { fieldKey: 'phone', label: 'Phone Number', type: 'text', helper: 'Displayed on the contact page and footer.' },
  { fieldKey: 'email', label: 'Email Address', type: 'text', helper: 'Displayed on the contact page and footer.' },
  { fieldKey: 'address', label: 'Address', type: 'bilingual', helper: 'Displayed on the contact page and footer.' },
  { fieldKey: 'facebook_url', label: 'Facebook Page URL', type: 'text', helper: 'Button target for the official Facebook page.' },
]

function Settings() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true)
        const response = await apiClient.get('/api/content/settings')
        const nextForm = response.data.reduce((accumulator, item) => {
          accumulator[item.fieldKey] = { en: item.valueEn ?? '', bn: item.valueBn ?? '' }
          return accumulator
        }, {})
        setForm(nextForm)
      } catch (error) {
        showToast(error.response?.data?.error || error.message || 'Failed to load settings', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  function updateField(fieldKey, language, value) {
    setForm((current) => ({
      ...current,
      [fieldKey]: {
        ...(current[fieldKey] || { en: '', bn: '' }),
        [language]: value,
      },
    }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    try {
      await Promise.all(
        fieldConfig.map((field) =>
          apiClient.patch(`/api/admin/content/settings/${field.fieldKey}`, {
            valueEn: form[field.fieldKey]?.en ?? '',
            valueBn: field.type === 'bilingual' ? form[field.fieldKey]?.bn ?? '' : null,
          }),
        ),
      )

      showToast('Settings saved successfully', 'success')
    } catch (error) {
      showToast(error.response?.data?.error || error.message || 'Failed to save settings', 'error')
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
    <section className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Site Settings</h1>
        <p className="text-gray-600">Manage the shared site identity, contact details, and footer copy used across the public site.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Brand Identity</p>
            <p className="text-sm text-gray-500">These values drive the header subtitle, trust badges, and footer line.</p>
          </div>

          {fieldConfig.slice(0, 5).map((field) => (
            <div key={field.fieldKey}>
              {field.type === 'bilingual' ? (
                <BilingualField
                  labelEn={field.label}
                  labelBn={field.label}
                  valueEn={form[field.fieldKey]?.en || ''}
                  valueBn={form[field.fieldKey]?.bn || ''}
                  onChangeEn={(value) => updateField(field.fieldKey, 'en', value)}
                  onChangeBn={(value) => updateField(field.fieldKey, 'bn', value)}
                  type="text"
                  isTextArea={false}
                  required={field.fieldKey === 'navbar_subtitle'}
                  />
              ) : (
                <div>
                  <label htmlFor={field.fieldKey} className="block text-sm font-semibold text-gray-900 mb-2">
                    {field.label}
                  </label>
                  <input
                    id={field.fieldKey}
                    type="text"
                    value={form[field.fieldKey]?.en || ''}
                    onChange={(event) => updateField(field.fieldKey, 'en', event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">{field.helper}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Contact Details</p>
            <p className="text-sm text-gray-500">These values power the Contact page and footer contact block.</p>
          </div>

          {fieldConfig.slice(5).map((field) => (
            <div key={field.fieldKey}>
              {field.type === 'bilingual' ? (
                <BilingualField
                  labelEn={field.label}
                  labelBn={field.label}
                  valueEn={form[field.fieldKey]?.en || ''}
                  valueBn={form[field.fieldKey]?.bn || ''}
                  onChangeEn={(value) => updateField(field.fieldKey, 'en', value)}
                  onChangeBn={(value) => updateField(field.fieldKey, 'bn', value)}
                  isTextArea={true}
                  required={field.fieldKey === 'address'}
                />
              ) : (
                <div>
                  <label htmlFor={field.fieldKey} className="block text-sm font-semibold text-gray-900 mb-2">
                    {field.label}
                  </label>
                  <input
                    id={field.fieldKey}
                    type={field.fieldKey === 'email' ? 'email' : field.fieldKey === 'facebook_url' ? 'url' : 'tel'}
                    value={form[field.fieldKey]?.en || ''}
                    onChange={(event) => updateField(field.fieldKey, 'en', event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={field.fieldKey === 'facebook_url' ? 'https://facebook.com/yourpage' : ''}
                  />
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">{field.helper}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-between items-center pt-2">
          <p className="text-sm text-gray-500">Changes are saved field-by-field to keep the editor resilient.</p>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

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
