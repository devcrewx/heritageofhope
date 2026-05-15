import { useEffect, useState } from 'react'
import BilingualField from '../components/BilingualField'
import { useApi } from '../hooks/useApi'

const focusFields = ['tag1', 'tag2', 'tag3']
const stepFields = ['step1', 'step2', 'step3', 'step4']

export default function OurWorkEditor() {
  const { request } = useApi()
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await request('/api/admin/content/our-work')
      if (response.success) {
        setData(response.sections || {})
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    }
  }

  const updateField = (section, fieldKey, lang, value) => {
    setData({
      ...data,
      [section]: {
        ...data[section],
        [fieldKey]: { ...data[section]?.[fieldKey], [lang]: value },
      },
    })
  }

  const saveSection = async (section) => {
    setSaving(true)
    try {
      const updates = data[section] || {}
      await Promise.all(
        Object.entries(updates).map(([fieldKey, values]) =>
          request(`/api/admin/content/our-work/${section}/${fieldKey}`, {
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
    container: { maxWidth: '980px' },
    section: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' },
    title: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' },
    button: { padding: '0.6rem 1.25rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600, marginTop: '1.25rem' },
    hint: { marginTop: '-0.5rem', marginBottom: '1rem', color: '#64748b', fontSize: '0.92rem' },
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
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>Our Work Page Editor</h1>
      <p style={styles.hint}>This controls the public Our Work page text sections. Program cards still use the shared program content.</p>

      <div style={styles.section}>
        <div style={styles.title}>Intro Section</div>
        <BilingualField
          label="Page Title"
          enValue={data.hero?.title?.en}
          bnValue={data.hero?.title?.bn}
          onEnChange={(val) => updateField('hero', 'title', 'en', val)}
          onBnChange={(val) => updateField('hero', 'title', 'bn', val)}
        />
        <BilingualField
          label="Page Intro"
          enValue={data.hero?.intro?.en}
          bnValue={data.hero?.intro?.bn}
          onEnChange={(val) => updateField('hero', 'intro', 'en', val)}
          onBnChange={(val) => updateField('hero', 'intro', 'bn', val)}
          type="textarea"
        />
        <button onClick={() => saveSection('hero')} disabled={saving} style={styles.button}>
          {saving ? 'Saving...' : 'Save Intro'}
        </button>
      </div>

      <div style={styles.section}>
        <div style={styles.title}>Focus Tags</div>
        <p style={styles.hint}>These appear as the summary line in the mini panel.</p>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {focusFields.map((fieldKey, index) => (
            <BilingualField
              key={fieldKey}
              label={`Tag ${index + 1}`}
              enValue={data.focus?.[fieldKey]?.en}
              bnValue={data.focus?.[fieldKey]?.bn}
              onEnChange={(val) => updateField('focus', fieldKey, 'en', val)}
              onBnChange={(val) => updateField('focus', fieldKey, 'bn', val)}
            />
          ))}
        </div>
        <button onClick={() => saveSection('focus')} disabled={saving} style={styles.button}>
          {saving ? 'Saving...' : 'Save Focus Tags'}
        </button>
      </div>

      <div style={styles.section}>
        <div style={styles.title}>Approach Section</div>
        <BilingualField
          label="Section Heading"
          enValue={data.approach?.heading?.en}
          bnValue={data.approach?.heading?.bn}
          onEnChange={(val) => updateField('approach', 'heading', 'en', val)}
          onBnChange={(val) => updateField('approach', 'heading', 'bn', val)}
        />
        <div style={{ display: 'grid', gap: '1rem' }}>
          {stepFields.map((fieldKey, index) => (
            <BilingualField
              key={fieldKey}
              label={`Step ${index + 1}`}
              enValue={data.approach?.[fieldKey]?.en}
              bnValue={data.approach?.[fieldKey]?.bn}
              onEnChange={(val) => updateField('approach', fieldKey, 'en', val)}
              onBnChange={(val) => updateField('approach', fieldKey, 'bn', val)}
            />
          ))}
        </div>
        <button onClick={() => saveSection('approach')} disabled={saving} style={styles.button}>
          {saving ? 'Saving...' : 'Save Approach'}
        </button>
      </div>

      <div style={styles.section}>
        <div style={styles.title}>Join Mission Box</div>
        <BilingualField
          label="Small Label"
          enValue={data.join?.meta?.en}
          bnValue={data.join?.meta?.bn}
          onEnChange={(val) => updateField('join', 'meta', 'en', val)}
          onBnChange={(val) => updateField('join', 'meta', 'bn', val)}
        />
        <BilingualField
          label="Body Text"
          enValue={data.join?.body?.en}
          bnValue={data.join?.body?.bn}
          onEnChange={(val) => updateField('join', 'body', 'en', val)}
          onBnChange={(val) => updateField('join', 'body', 'bn', val)}
          type="textarea"
        />
        <BilingualField
          label="Button Label"
          enValue={data.join?.button?.en}
          bnValue={data.join?.button?.bn}
          onEnChange={(val) => updateField('join', 'button', 'en', val)}
          onBnChange={(val) => updateField('join', 'button', 'bn', val)}
        />
        <button onClick={() => saveSection('join')} disabled={saving} style={styles.button}>
          {saving ? 'Saving...' : 'Save Join Box'}
        </button>
      </div>

      {message && <div style={messageStyle}>{message}</div>}
    </div>
  )
}