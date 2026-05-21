import { useEffect, useState } from 'react'
import BilingualField from '../components/BilingualField'
import MediaUploadField from '../components/MediaUploadField'
import { Toast } from '../components/Toast'
import apiClient from '../lib/api'

const fieldConfig = [
  { fieldKey: 'org_name', label: 'NGO Name', type: 'text', helper: 'Shown in the public header and footer.' },
  { fieldKey: 'navbar_subtitle', label: 'Navbar Subtitle', type: 'bilingual', helper: 'Short line under the brand name in the public header.' },
  { fieldKey: 'footer_mission', label: 'Footer Mission Line', type: 'bilingual', helper: 'Short mission statement used in the public footer.' },
  { fieldKey: 'donate_button_label', label: 'Donate Button Label', type: 'bilingual', helper: 'Text for the header donate button.' },
  { fieldKey: 'facebook_label', label: 'Facebook Link Text', type: 'bilingual', helper: 'Text for the footer Facebook follow link.' },
  { fieldKey: 'phone', label: 'Phone Number', type: 'text', helper: 'Displayed on the contact page and footer.' },
  { fieldKey: 'email', label: 'Email Address', type: 'text', helper: 'Displayed on the contact page and footer.' },
  { fieldKey: 'address', label: 'Address', type: 'bilingual', helper: 'Displayed on the contact page and footer.' },
  { fieldKey: 'facebook_url', label: 'Facebook Page URL', type: 'text', helper: 'Button target for the official Facebook page.' },
  { fieldKey: 'contact_phone_label', label: 'Contact Card Phone Label', type: 'bilingual', helper: 'The word "Phone" shown above the phone number on contact page.' },
  { fieldKey: 'contact_email_label', label: 'Contact Card Email Label', type: 'bilingual', helper: 'The word "Email" shown above the email address on contact page.' },
  { fieldKey: 'contact_address_label', label: 'Contact Card Address Label', type: 'bilingual', helper: 'The word "Address" shown above the address on contact page.' },
]

function Settings() {
  const [form, setForm] = useState({})
  const [trustBadges, setTrustBadges] = useState([])
  const [navItems, setNavItems] = useState({})
  const [ariaLabels, setAriaLabels] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true)
        const response = await apiClient.get('/api/admin/content/settings')
        const sections = response.data?.sections || {}

        // Flatten general + contact sections into form
        const nextForm = {}
        for (const [sectionKey, section] of Object.entries(sections)) {
          if (sectionKey === 'trustBadges' || sectionKey === 'navItems') continue
          for (const [fieldKey, value] of Object.entries(section)) {
            nextForm[fieldKey] = { en: value.en ?? '', bn: value.bn ?? '' }
          }
        }
        setForm(nextForm)

        // Load trust badges from trustBadges section
        if (sections.trustBadges) {
          const items = Object.entries(sections.trustBadges)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, value]) => ({ en: value.en || '', bn: value.bn || '' }))
            .filter((badge) => badge.en || badge.bn)
          setTrustBadges(items)
        }

        // Load aria labels from the general section
        const ariaForm = {}
        for (const key of ['hamburger_aria_label', 'nav_aria_label']) {
          if (sections.general?.[key]) {
            ariaForm[key] = { en: sections.general[key].en ?? '', bn: sections.general[key].bn ?? '' }
          }
        }
        setAriaLabels(ariaForm)

        // Load nav items
        if (sections.navItems) {
          const navForm = {}
          for (const [fieldKey, value] of Object.entries(sections.navItems)) {
            navForm[fieldKey] = { en: value.en ?? '', bn: value.bn ?? '' }
          }
          setNavItems(navForm)
        }
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

  function updateNavItem(fieldKey, language, value) {
    setNavItems((current) => ({
      ...current,
      [fieldKey]: {
        ...(current[fieldKey] || { en: '', bn: '' }),
        [language]: value,
      },
    }))
  }

  async function uploadLogo(file) {
    setLogoUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('page', 'settings')
      formData.append('section', 'general')
      formData.append('fieldKey', 'logo_url')

      const response = await apiClient.post('/api/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (response.data?.data?.url) {
        setForm((current) => ({
          ...current,
          logo_url: { en: response.data.data.url, bn: '' },
        }))
      }
      showToast('Logo updated', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to upload logo'
      showToast(msg, 'error')
    } finally {
      setLogoUploading(false)
    }
  }

  async function deleteLogo() {
    setLogoUploading(true)
    try {
      await apiClient.delete('/api/admin/media/settings/general/logo_url')
      setForm((current) => ({
        ...current,
        logo_url: { en: '', bn: '' },
      }))
      showToast('Logo removed', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to remove logo'
      showToast(msg, 'error')
    } finally {
      setLogoUploading(false)
    }
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

      // Save trust badges: fetch existing keys, save current, delete orphans
      const existingResp = await apiClient.get('/api/admin/content/settings')
      const existingKeys = existingResp.data?.sections?.trustBadges
        ? Object.keys(existingResp.data.sections.trustBadges).sort()
        : []

      await Promise.all(
        trustBadges.map((badge, i) =>
          apiClient.patch(`/api/admin/content/settings/trustBadges/item_${i}`, {
            valueEn: badge.en,
            valueBn: badge.bn,
          }),
        ),
      )

      // Delete orphaned badge rows
      const deletePromises = existingKeys
        .filter((key) => {
          const idx = parseInt(key.replace('item_', ''), 10)
          return idx >= trustBadges.length
        })
        .map((key) => apiClient.delete(`/api/admin/content/settings/trustBadges/${key}`))
      await Promise.all(deletePromises)

      // Save nav items
      await Promise.all(
        Object.entries(navItems).map(([fieldKey, value]) =>
          apiClient.patch(`/api/admin/content/settings/navItems/${fieldKey}`, {
            valueEn: value.en ?? '',
            valueBn: value.bn ?? '',
          }),
        ),
      )

      // Save aria labels
      if (ariaLabels.hamburger_aria_label?.en || ariaLabels.hamburger_aria_label?.bn) {
        await apiClient.patch('/api/admin/content/settings/hamburger_aria_label', {
          valueEn: ariaLabels.hamburger_aria_label.en,
          valueBn: ariaLabels.hamburger_aria_label.bn,
        })
      }
      if (ariaLabels.nav_aria_label?.en || ariaLabels.nav_aria_label?.bn) {
        await apiClient.patch('/api/admin/content/settings/nav_aria_label', {
          valueEn: ariaLabels.nav_aria_label.en,
          valueBn: ariaLabels.nav_aria_label.bn,
        })
      }

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
        <p className="text-gray-600">Manage the shared site identity, trust badges, contact details, and footer copy used across the public site.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Brand Identity</p>
            <p className="text-sm text-gray-500">These values drive the header subtitle and footer line.</p>
          </div>

          <MediaUploadField
            label="NGO Logo"
            helperText="Upload the organization logo. Shown in the public header and footer."
            currentUrl={form.logo_url?.en || ''}
            currentAlt="NGO logo"
            onUpload={uploadLogo}
            onDelete={form.logo_url?.en ? deleteLogo : undefined}
            uploading={logoUploading}
            previewClassName="h-24 w-auto object-contain"
          />

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

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Trust Badges</p>
            <p className="text-sm text-gray-500">Bilingual badges shown in the trust strip on the home page. Add or remove as needed. Each badge is fully customizable — type exactly what you want to display.</p>
          </div>

          <div className="space-y-3">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  type="text"
                  value={badge.en}
                  onChange={(e) => {
                    const next = [...trustBadges]
                    next[i] = { ...next[i], en: e.target.value }
                    setTrustBadges(next)
                  }}
                  placeholder="English (e.g., Est. 2005)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={badge.bn}
                  onChange={(e) => {
                    const next = [...trustBadges]
                    next[i] = { ...next[i], bn: e.target.value }
                    setTrustBadges(next)
                  }}
                  placeholder="Bangla (e.g., প্রতিষ্ঠিত ২০০৫)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setTrustBadges(trustBadges.filter((_, j) => j !== i))}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setTrustBadges([...trustBadges, { en: '', bn: '' }])}
            className="px-4 py-2 border border-dashed border-gray-400 text-gray-600 rounded-md hover:bg-gray-50 text-sm font-medium"
          >
            + Add Badge
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Navigation Labels</p>
            <p className="text-sm text-gray-500">Bilingual text for each link in the public site header navigation.</p>
          </div>
          {[
            { fieldKey: 'home', label: 'Home' },
            { fieldKey: 'about', label: 'About' },
            { fieldKey: 'ourWork', label: 'Our Work' },
            { fieldKey: 'impact', label: 'Impact' },
            { fieldKey: 'gallery', label: 'Gallery' },
            { fieldKey: 'getInvolved', label: 'Get Involved' },
            { fieldKey: 'contact', label: 'Contact' },
          ].map((item) => (
            <BilingualField
              key={item.fieldKey}
              labelEn={item.label}
              labelBn={item.label + ' (Bangla)'}
              valueEn={navItems[item.fieldKey]?.en || ''}
              valueBn={navItems[item.fieldKey]?.bn || ''}
              onChangeEn={(value) => updateNavItem(item.fieldKey, 'en', value)}
              onChangeBn={(value) => updateNavItem(item.fieldKey, 'bn', value)}
              type="text"
            />
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Accessibility Labels</p>
            <p className="text-sm text-gray-500">Aria labels for the public site navigation elements.</p>
          </div>
          <BilingualField
            labelEn="Hamburger Menu Aria Label"
            labelBn="মোবাইল মেনু লেবেল"
            valueEn={ariaLabels.hamburger_aria_label?.en || ''}
            valueBn={ariaLabels.hamburger_aria_label?.bn || ''}
            onChangeEn={(value) => setAriaLabels((p) => ({ ...p, hamburger_aria_label: { ...p.hamburger_aria_label, en: value } }))}
            onChangeBn={(value) => setAriaLabels((p) => ({ ...p, hamburger_aria_label: { ...p.hamburger_aria_label, bn: value } }))}
            type="text"
          />
          <BilingualField
            labelEn="Navigation Aria Label"
            labelBn="নেভিগেশন লেবেল"
            valueEn={ariaLabels.nav_aria_label?.en || ''}
            valueBn={ariaLabels.nav_aria_label?.bn || ''}
            onChangeEn={(value) => setAriaLabels((p) => ({ ...p, nav_aria_label: { ...p.nav_aria_label, en: value } }))}
            onChangeBn={(value) => setAriaLabels((p) => ({ ...p, nav_aria_label: { ...p.nav_aria_label, bn: value } }))}
            type="text"
          />
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