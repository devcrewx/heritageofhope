import { useState, useEffect } from 'react'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import MediaUploadField from '../components/MediaUploadField'
import apiClient from '../lib/api'
import { useApi } from '../hooks/useApi'

export default function ContactEditor() {
  const { request } = useApi()
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [mapEmbedUrl, setMapEmbedUrl] = useState('')
  const [mosaicSlots, setMosaicSlots] = useState(
    Array.from({ length: 4 }, () => ({ url: '', labelEn: '', labelBn: '' }))
  )
  const [mosaicUploading, setMosaicUploading] = useState(Array(4).fill(false))

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const [settingsResponse, contactResponse] = await Promise.all([
        request('/api/admin/content/settings'),
        request('/api/admin/content/contact'),
      ])
      if (settingsResponse.success) {
        setData(settingsResponse.sections || {})
      }
      if (contactResponse.success && contactResponse.sections?.pageContent) {
        const p = contactResponse.sections.pageContent
        setData((current) => ({
          ...current,
          pageContent: {
            eyebrow: p.eyebrow || { en: '' },
            facebookLabel: p.facebookLabel || { en: '' },
            facebookHeading: p.facebookHeading || { en: '' },
          },
        }))
        setMapEmbedUrl(contactResponse.sections?.map?.embedUrl?.en || '')
      }
      if (contactResponse.success && contactResponse.sections?.mosaic) {
        const m = contactResponse.sections.mosaic
        setMosaicSlots((prev) => prev.map((slot, i) => ({
          url: m[`img${i + 1}_url`]?.en || '',
          labelEn: m[`img${i + 1}_labelEn`]?.en || '',
          labelBn: m[`img${i + 1}_labelBn`]?.en || '',
        })))
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setInitialLoading(false)
    }
  }

  const updateField = (section, fieldKey, langOrValue, maybeValue) => {
    setFormErrors((current) => ({ ...current, [fieldKey]: '' }))
    const lang = maybeValue !== undefined ? langOrValue : 'en'
    const value = maybeValue !== undefined ? maybeValue : langOrValue
    setData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [fieldKey]: { ...current[section]?.[fieldKey], [lang]: value },
      },
    }))
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

  async function uploadMosaicImage(file, index) {
    setMosaicUploading((prev) => prev.map((v, i) => (i === index ? true : v)))
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('page', 'contact')
      formData.append('section', 'mosaic')
      formData.append('fieldKey', `img${index + 1}_url`)

      const response = await apiClient.post('/api/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMosaicSlots((prev) => prev.map((slot, i) =>
        i === index ? { ...slot, url: response.data?.data?.url || '' } : slot
      ))
      setStatusMessage(`Mosaic image ${index + 1} updated`)
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setMosaicUploading((prev) => prev.map((v, i) => (i === index ? false : v)))
    }
  }

  async function deleteMosaicImage(index) {
    setMosaicUploading((prev) => prev.map((v, i) => (i === index ? true : v)))
    try {
      await apiClient.delete(`/api/admin/media/contact/mosaic/img${index + 1}_url`)
      setMosaicSlots((prev) => prev.map((slot, i) =>
        i === index ? { url: '', labelEn: slot.labelEn, labelBn: slot.labelBn } : slot
      ))
      setStatusMessage(`Mosaic image ${index + 1} removed`)
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setMosaicUploading((prev) => prev.map((v, i) => (i === index ? false : v)))
    }
  }

  function updateMosaicLabel(index, field, value) {
    setMosaicSlots((prev) => prev.map((slot, i) =>
      i === index ? { ...slot, [field]: value } : slot
    ))
  }

  function updateFormLabel(fieldKey, lang, value) {
    setData((current) => ({
      ...current,
      contact: {
        ...current.contact,
        formLabels: {
          ...current.contact?.formLabels,
          [fieldKey]: {
            ...current.contact?.formLabels?.[fieldKey],
            [lang]: value,
          },
        },
      },
    }))
  }

  async function saveMosaicLabels() {
    setSaving(true)
    setError('')
    setStatusMessage('')
    try {
      await Promise.all(
        mosaicSlots.flatMap((slot, i) => [
          request(`/api/admin/content/contact/mosaic/img${i + 1}_labelEn`, {
            method: 'PATCH',
            body: JSON.stringify({ valueEn: slot.labelEn }),
          }),
          request(`/api/admin/content/contact/mosaic/img${i + 1}_labelBn`, {
            method: 'PATCH',
            body: JSON.stringify({ valueEn: slot.labelBn }),
          }),
        ])
      )
      setStatusMessage('Mosaic labels saved')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function saveContactFormLabels() {
    setSaving(true)
    setError('')
    setStatusMessage('')
    try {
      const fl = data.contact?.formLabels || {}
      const fields = [
        'nameLabel', 'namePlaceholder', 'emailLabel', 'emailPlaceholder',
        'subjectLabel', 'messageLabel', 'messagePlaceholder',
        'submitLabel', 'submittingLabel', 'errorMessage',
      ]
      await Promise.all(
        fields.map((key) =>
          request(`/api/admin/content/contact/formLabels/${key}`, {
            method: 'PATCH',
            body: JSON.stringify({ valueEn: fl[key]?.en || '', valueBn: fl[key]?.bn || '' }),
          })
        )
      )
      setStatusMessage('Form labels saved')
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div>
                  <label style={styles.label}>Page Title (EN)</label>
                  <input type="text" value={data.contact?.contact_page_title?.en || ''} onChange={(e) => updateField('contact', 'contact_page_title', 'en', e.target.value)} placeholder="We’d love to hear from you." style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Page Title (BN)</label>
                  <input type="text" value={data.contact?.contact_page_title?.bn || ''} onChange={(e) => updateField('contact', 'contact_page_title', 'bn', e.target.value)} placeholder="আমরা আপনার কথা শুনতে চাই।" style={styles.input} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div>
                  <label style={styles.label}>Page Intro (EN)</label>
                  <input type="text" value={data.contact?.contact_page_intro?.en || ''} onChange={(e) => updateField('contact', 'contact_page_intro', 'en', e.target.value)} placeholder="Reach out to us for inquiries, partnerships, or just to say hello." style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Page Intro (BN)</label>
                  <input type="text" value={data.contact?.contact_page_intro?.bn || ''} onChange={(e) => updateField('contact', 'contact_page_intro', 'bn', e.target.value)} placeholder="যে কোনো প্রশ্ন, অংশীদারিত্ব বা শুভেচ্ছা জানাতে যোগাযোগ করুন।" style={styles.input} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div>
                  <label style={styles.label}>Response Time Label (EN)</label>
                  <input type="text" value={data.contact?.contact_response_label?.en || ''} onChange={(e) => updateField('contact', 'contact_response_label', 'en', e.target.value)} placeholder="Response time" style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Response Time Label (BN)</label>
                  <input type="text" value={data.contact?.contact_response_label?.bn || ''} onChange={(e) => updateField('contact', 'contact_response_label', 'bn', e.target.value)} placeholder="প্রতিক্রিয়া সময়" style={styles.input} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div>
                  <label style={styles.label}>Response Time Value (EN)</label>
                  <input type="text" value={data.contact?.contact_response_value?.en || ''} onChange={(e) => updateField('contact', 'contact_response_value', 'en', e.target.value)} placeholder="Usually within 2 business days" style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Response Time Value (BN)</label>
                  <input type="text" value={data.contact?.contact_response_value?.bn || ''} onChange={(e) => updateField('contact', 'contact_response_value', 'bn', e.target.value)} placeholder="সাধারণত ২ কার্যদিবসের মধ্যে" style={styles.input} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div>
                  <label style={styles.label}>Form Label (EN)</label>
                  <input type="text" value={data.contact?.contact_form_label?.en || ''} onChange={(e) => updateField('contact', 'contact_form_label', 'en', e.target.value)} placeholder="Contact form" style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Form Label (BN)</label>
                  <input type="text" value={data.contact?.contact_form_label?.bn || ''} onChange={(e) => updateField('contact', 'contact_form_label', 'bn', e.target.value)} placeholder="যোগাযোগ ফর্ম" style={styles.input} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div>
                  <label style={styles.label}>Form Heading (EN)</label>
                  <input type="text" value={data.contact?.contact_form_heading?.en || ''} onChange={(e) => updateField('contact', 'contact_form_heading', 'en', e.target.value)} placeholder="Send us a direct message" style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Form Heading (BN)</label>
                  <input type="text" value={data.contact?.contact_form_heading?.bn || ''} onChange={(e) => updateField('contact', 'contact_form_heading', 'bn', e.target.value)} placeholder="সরাসরি বার্তা পাঠান" style={styles.input} />
                </div>
              </div>
            </div>

            <button onClick={() => saveSection('contact')} disabled={saving} style={styles.button}>
              {saving ? 'Saving...' : 'Save Contact Info'}
            </button>
          </div>

          <div style={styles.section}>
            <div style={styles.title}>Contact Form Labels</div>
            <p style={{ color: '#475569', marginBottom: '1rem' }}>
              These labels appear inside the contact form on the public page.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Name Label (EN)</label>
                <input type="text" value={data.contact?.formLabels?.nameLabel?.en || ''} onChange={(e) => updateFormLabel('nameLabel', 'en', e.target.value)} placeholder="Name" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Name Label (BN)</label>
                <input type="text" value={data.contact?.formLabels?.nameLabel?.bn || ''} onChange={(e) => updateFormLabel('nameLabel', 'bn', e.target.value)} placeholder="নাম" style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Name Placeholder (EN)</label>
                <input type="text" value={data.contact?.formLabels?.namePlaceholder?.en || ''} onChange={(e) => updateFormLabel('namePlaceholder', 'en', e.target.value)} placeholder="Your name" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Name Placeholder (BN)</label>
                <input type="text" value={data.contact?.formLabels?.namePlaceholder?.bn || ''} onChange={(e) => updateFormLabel('namePlaceholder', 'bn', e.target.value)} placeholder="আপনার নাম" style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Email Label (EN)</label>
                <input type="text" value={data.contact?.formLabels?.emailLabel?.en || ''} onChange={(e) => updateFormLabel('emailLabel', 'en', e.target.value)} placeholder="Email" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Email Label (BN)</label>
                <input type="text" value={data.contact?.formLabels?.emailLabel?.bn || ''} onChange={(e) => updateFormLabel('emailLabel', 'bn', e.target.value)} placeholder="ইমেল" style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Email Placeholder (EN)</label>
                <input type="text" value={data.contact?.formLabels?.emailPlaceholder?.en || ''} onChange={(e) => updateFormLabel('emailPlaceholder', 'en', e.target.value)} placeholder="you@example.com" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Email Placeholder (BN)</label>
                <input type="text" value={data.contact?.formLabels?.emailPlaceholder?.bn || ''} onChange={(e) => updateFormLabel('emailPlaceholder', 'bn', e.target.value)} style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Subject Label (EN)</label>
                <input type="text" value={data.contact?.formLabels?.subjectLabel?.en || ''} onChange={(e) => updateFormLabel('subjectLabel', 'en', e.target.value)} placeholder="Subject" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Subject Label (BN)</label>
                <input type="text" value={data.contact?.formLabels?.subjectLabel?.bn || ''} onChange={(e) => updateFormLabel('subjectLabel', 'bn', e.target.value)} placeholder="বিষয়" style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Message Label (EN)</label>
                <input type="text" value={data.contact?.formLabels?.messageLabel?.en || ''} onChange={(e) => updateFormLabel('messageLabel', 'en', e.target.value)} placeholder="Message" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Message Label (BN)</label>
                <input type="text" value={data.contact?.formLabels?.messageLabel?.bn || ''} onChange={(e) => updateFormLabel('messageLabel', 'bn', e.target.value)} placeholder="বার্তা" style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Message Placeholder (EN)</label>
                <input type="text" value={data.contact?.formLabels?.messagePlaceholder?.en || ''} onChange={(e) => updateFormLabel('messagePlaceholder', 'en', e.target.value)} placeholder="Tell us how you want to help" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Message Placeholder (BN)</label>
                <input type="text" value={data.contact?.formLabels?.messagePlaceholder?.bn || ''} onChange={(e) => updateFormLabel('messagePlaceholder', 'bn', e.target.value)} style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Submit Button (EN)</label>
                <input type="text" value={data.contact?.formLabels?.submitLabel?.en || ''} onChange={(e) => updateFormLabel('submitLabel', 'en', e.target.value)} placeholder="Send message" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Submit Button (BN)</label>
                <input type="text" value={data.contact?.formLabels?.submitLabel?.bn || ''} onChange={(e) => updateFormLabel('submitLabel', 'bn', e.target.value)} placeholder="বার্তা পাঠান" style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Submitting Text (EN)</label>
                <input type="text" value={data.contact?.formLabels?.submittingLabel?.en || ''} onChange={(e) => updateFormLabel('submittingLabel', 'en', e.target.value)} placeholder="Sending..." style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Submitting Text (BN)</label>
                <input type="text" value={data.contact?.formLabels?.submittingLabel?.bn || ''} onChange={(e) => updateFormLabel('submittingLabel', 'bn', e.target.value)} placeholder="পাঠানো হচ্ছে..." style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Error Message (EN)</label>
                <input type="text" value={data.contact?.formLabels?.errorMessage?.en || ''} onChange={(e) => updateFormLabel('errorMessage', 'en', e.target.value)} placeholder="Failed to submit form. Please try again." style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Error Message (BN)</label>
                <input type="text" value={data.contact?.formLabels?.errorMessage?.bn || ''} onChange={(e) => updateFormLabel('errorMessage', 'bn', e.target.value)} placeholder="ফর্ম জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" style={styles.input} />
              </div>
            </div>
            <button onClick={saveContactFormLabels} disabled={saving} style={styles.button}>
              {saving ? 'Saving...' : 'Save Contact Form Labels'}
            </button>
          </div>

          <div style={styles.section}>
            <div style={styles.title}>Mosaic Images</div>
            <p style={{ color: '#475569', marginBottom: '1rem' }}>
              These images appear in the photo strip at the bottom of the Contact page.
            </p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {mosaicSlots.map((slot, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a', fontSize: '0.95rem' }}>
                    Image {i + 1}
                  </div>
                  <MediaUploadField
                    label={`Image ${i + 1}`}
                    helperText="Upload an image for this mosaic slot."
                    currentUrl={slot.url}
                    currentAlt={slot.labelEn || `Mosaic ${i + 1}`}
                    onUpload={(file) => uploadMosaicImage(file, i)}
                    onDelete={slot.url ? () => deleteMosaicImage(i) : undefined}
                    uploading={mosaicUploading[i]}
                    previewClassName="h-32 w-full object-cover"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <div>
                      <label style={{ ...styles.label, marginBottom: '0.25rem' }}>Label (EN)</label>
                      <input
                        type="text"
                        value={slot.labelEn}
                        onChange={(e) => updateMosaicLabel(i, 'labelEn', e.target.value)}
                        placeholder="In Action"
                        style={{ ...styles.input, marginBottom: 0 }}
                      />
                    </div>
                    <div>
                      <label style={{ ...styles.label, marginBottom: '0.25rem' }}>Label (BN)</label>
                      <input
                        type="text"
                        value={slot.labelBn}
                        onChange={(e) => updateMosaicLabel(i, 'labelBn', e.target.value)}
                        placeholder="সক্রিয় অবস্থায়"
                        style={{ ...styles.input, marginBottom: 0 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={saveMosaicLabels} disabled={saving} style={styles.button}>
              {saving ? 'Saving...' : 'Save Mosaic Labels'}
            </button>
          </div>

          <div style={styles.section}>
            <div style={styles.title}>Page Content Labels</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Page Eyebrow (EN)</label>
                <input type="text" value={data.pageContent?.eyebrow?.en || ''} onChange={(e) => setData((c) => ({ ...c, pageContent: { ...c.pageContent, eyebrow: { ...c.pageContent?.eyebrow, en: e.target.value } } }))} placeholder="Contact" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Page Eyebrow (BN)</label>
                <input type="text" value={data.pageContent?.eyebrow?.bn || ''} onChange={(e) => setData((c) => ({ ...c, pageContent: { ...c.pageContent, eyebrow: { ...c.pageContent?.eyebrow, bn: e.target.value } } }))} placeholder="যোগাযোগ" style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Facebook Section Eyebrow (EN)</label>
                <input type="text" value={data.pageContent?.facebookLabel?.en || ''} onChange={(e) => setData((c) => ({ ...c, pageContent: { ...c.pageContent, facebookLabel: { ...c.pageContent?.facebookLabel, en: e.target.value } } }))} placeholder="Featured from Facebook" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Facebook Section Eyebrow (BN)</label>
                <input type="text" value={data.pageContent?.facebookLabel?.bn || ''} onChange={(e) => setData((c) => ({ ...c, pageContent: { ...c.pageContent, facebookLabel: { ...c.pageContent?.facebookLabel, bn: e.target.value } } }))} placeholder="ফেসবুক থেকে" style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Facebook Section Heading (EN)</label>
                <input type="text" value={data.pageContent?.facebookHeading?.en || ''} onChange={(e) => setData((c) => ({ ...c, pageContent: { ...c.pageContent, facebookHeading: { ...c.pageContent?.facebookHeading, en: e.target.value } } }))} placeholder="Recent moments from the page" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Facebook Section Heading (BN)</label>
                <input type="text" value={data.pageContent?.facebookHeading?.bn || ''} onChange={(e) => setData((c) => ({ ...c, pageContent: { ...c.pageContent, facebookHeading: { ...c.pageContent?.facebookHeading, bn: e.target.value } } }))} placeholder="সাম্প্রতিক মুহূর্ত" style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Visit Facebook Button Label (EN)</label>
                <input type="text" value={data.pageContent?.visitFacebookLabel?.en || ''} onChange={(e) => setData((c) => ({ ...c, pageContent: { ...c.pageContent, visitFacebookLabel: { ...c.pageContent?.visitFacebookLabel, en: e.target.value } } }))} placeholder="Visit Official Facebook Page →" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Visit Facebook Button Label (BN)</label>
                <input type="text" value={data.pageContent?.visitFacebookLabel?.bn || ''} onChange={(e) => setData((c) => ({ ...c, pageContent: { ...c.pageContent, visitFacebookLabel: { ...c.pageContent?.visitFacebookLabel, bn: e.target.value } } }))} placeholder="অফিসিয়াল ফেসবুক পেজ দেখুন →" style={styles.input} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={styles.label}>Map Iframe Title (EN)</label>
                <input type="text" value={data.pageContent?.mapTitle?.en || ''} onChange={(e) => setData((c) => ({ ...c, pageContent: { ...c.pageContent, mapTitle: { ...c.pageContent?.mapTitle, en: e.target.value } } }))} placeholder="Heritage of Hope Foundation location" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Map Iframe Title (BN)</label>
                <input type="text" value={data.pageContent?.mapTitle?.bn || ''} onChange={(e) => setData((c) => ({ ...c, pageContent: { ...c.pageContent, mapTitle: { ...c.pageContent?.mapTitle, bn: e.target.value } } }))} placeholder="হেরিটেজ অফ হোপ ফাউন্ডেশনের অবস্থান" style={styles.input} />
              </div>
            </div>
            <label style={styles.label}>Google Maps Embed URL</label>
            <input type="url" value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)} placeholder="https://www.google.com/maps?q=..." style={styles.input} />
            <button onClick={async () => {
              setSaving(true)
              setError('')
              setStatusMessage('')
              try {
                const pc = data.pageContent || {}
                await Promise.all([
                  request('/api/admin/content/contact/pageContent/eyebrow', { method: 'PATCH', body: JSON.stringify({ valueEn: pc.eyebrow?.en || '', valueBn: pc.eyebrow?.bn || '' }) }),
                  request('/api/admin/content/contact/pageContent/facebookLabel', { method: 'PATCH', body: JSON.stringify({ valueEn: pc.facebookLabel?.en || '', valueBn: pc.facebookLabel?.bn || '' }) }),
                  request('/api/admin/content/contact/pageContent/facebookHeading', { method: 'PATCH', body: JSON.stringify({ valueEn: pc.facebookHeading?.en || '', valueBn: pc.facebookHeading?.bn || '' }) }),
                  request('/api/admin/content/contact/pageContent/visitFacebookLabel', { method: 'PATCH', body: JSON.stringify({ valueEn: pc.visitFacebookLabel?.en || '', valueBn: pc.visitFacebookLabel?.bn || '' }) }),
                  request('/api/admin/content/contact/pageContent/mapTitle', { method: 'PATCH', body: JSON.stringify({ valueEn: pc.mapTitle?.en || '', valueBn: pc.mapTitle?.bn || '' }) }),
                  request('/api/admin/content/contact/map/embedUrl', { method: 'PATCH', body: JSON.stringify({ valueEn: mapEmbedUrl }) }),
                ])
                setStatusMessage('Page labels saved')
              } catch (error) { setError(error.message) }
              finally { setSaving(false) }
            }} disabled={saving} style={styles.button}>
              {saving ? 'Saving...' : 'Save Page Labels'}
            </button>
          </div>

          {statusMessage && <div style={successStyle}>{statusMessage}</div>}
        </>
      )}
    </div>
  )
}
