import { useState, useEffect, useRef, useContext } from 'react'
import BilingualField from '../components/BilingualField'
import { useApi } from '../hooks/useApi'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import SplitLayout from '../components/SplitLayout'
import { usePreviewSync } from '../hooks/usePreviewSync'
import { SiteContentContext } from '../App'

const fields = [
  { fieldKey: 'eyebrow', labelEn: 'Page Eyebrow', labelBn: 'Page Eyebrow (Bangla)' },
  { fieldKey: 'heading', labelEn: 'Page Heading', labelBn: 'Page Heading (Bangla)' },
  { fieldKey: 'body', labelEn: 'Page Body', labelBn: 'Page Body (Bangla)' },
  { fieldKey: 'buttonLabel', labelEn: 'Button Label', labelBn: 'Button Label (Bangla)' },
]

export default function ThankYouEditor() {
  const iframeRef = useRef(null)
  const fullContent = useContext(SiteContentContext)
  const { request } = useApi()
  const [data, setData] = useState({})
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const loadContent = async () => {
    try {
      const response = await request('/api/admin/content/thankYou')
      if (response.success && response.sections?.pageContent) {
        setData(response.sections.pageContent)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [])

  const updateField = (fieldKey, lang, value) => {
    setData((current) => ({
      ...current,
      [fieldKey]: { ...current[fieldKey], [lang]: value },
    }))
  }

  const saveAll = async () => {
    setSaving(true)
    setError('')
    setStatusMessage('')
    try {
      await Promise.all(
        fields.map((field) =>
          request(`/api/admin/content/thankYou/pageContent/${field.fieldKey}`, {
            method: 'PATCH',
            body: JSON.stringify({ valueEn: data[field.fieldKey]?.en || '', valueBn: data[field.fieldKey]?.bn || '' }),
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

  const draft = { pageContent: data }
  usePreviewSync(iframeRef, draft, 'thankYou', fullContent)

  if (initialLoading) {
    return <LoadingSpinner fullPage text="Loading thank you page content..." />
  }

  const styles = {
    container: { maxWidth: '800px' },
    section: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' },
    title: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' },
    button: { padding: '0.6rem 1.25rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600, marginTop: '1.25rem' },
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
    <SplitLayout previewPage="/thank-you" iframeRef={iframeRef}>
    <div style={styles.container}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Thank You Page Editor</h1>
      <p style={{ marginBottom: '1.25rem', color: '#475569' }}>Edit the text shown after a form is submitted successfully.</p>
      {error && <ErrorMessage error={error} onClose={() => setError('')} className="mb-4" />}
      <div style={styles.section}>
        <div style={styles.title}>Page Content</div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {fields.map((field) => (
            <BilingualField
              key={field.fieldKey}
              labelEn={field.labelEn}
              labelBn={field.labelBn}
              valueEn={data[field.fieldKey]?.en || ''}
              valueBn={data[field.fieldKey]?.bn || ''}
              onChangeEn={(val) => updateField(field.fieldKey, 'en', val)}
              onChangeBn={(val) => updateField(field.fieldKey, 'bn', val)}
              isTextArea={field.fieldKey === 'body'}
            />
          ))}
        </div>
        <button onClick={saveAll} disabled={saving} style={styles.button}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      {statusMessage && <div style={successStyle}>{statusMessage}</div>}
    </div>
    </SplitLayout>
  )
}
