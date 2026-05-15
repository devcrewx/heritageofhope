import { useState, useEffect } from 'react'
import BilingualField from '../components/BilingualField'
import { useApi } from '../hooks/useApi'

export default function AboutEditor() {
  const { request } = useApi()
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeSection, setActiveSection] = useState('intro')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await request('/api/admin/content/about')
      if (response.success) {
        setData(response.sections || {})
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    }
  }

  const saveSection = async (section) => {
    setSaving(true)
    setMessage('')
    try {
      const updates = data[section] || {}
      const promises = Object.entries(updates).map(([fieldKey, values]) =>
        request(`/api/admin/content/about/${section}/${fieldKey}`, {
          method: 'PATCH',
          body: JSON.stringify(values),
        })
      )
      await Promise.all(promises)
      setMessage('✓ Saved successfully')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (section, fieldKey, lang, value) => {
    setData({
      ...data,
      [section]: {
        ...data[section],
        [fieldKey]: {
          ...data[section]?.[fieldKey],
          [lang]: value,
        },
      },
    })
  }

  const valueCards = [0, 1, 2, 3]

  const tabs = [
    { key: 'intro', label: 'Page Intro' },
    { key: 'story', label: 'Our Story' },
    { key: 'mission', label: 'Mission & Vision' },
    { key: 'values', label: 'Core Values' },
  ]

  const section = (title, sectionKey) => (
    <div key={sectionKey} style={sectionStyle}>
      <div style={titleStyle}>{title}</div>
      {sectionKey === 'intro' && (
        <>
          <BilingualField
            label="Page Title"
            enValue={data.intro?.title?.en}
            bnValue={data.intro?.title?.bn}
            onEnChange={(val) => updateField('intro', 'title', 'en', val)}
            onBnChange={(val) => updateField('intro', 'title', 'bn', val)}
            required
          />
          <BilingualField
            label="Intro Paragraph"
            enValue={data.intro?.paragraph?.en}
            bnValue={data.intro?.paragraph?.bn}
            onEnChange={(val) => updateField('intro', 'paragraph', 'en', val)}
            onBnChange={(val) => updateField('intro', 'paragraph', 'bn', val)}
            type="textarea"
          />
        </>
      )}
      {sectionKey === 'story' && (
        <BilingualField
          label="Our Story"
          enValue={data.story?.body?.en}
          bnValue={data.story?.body?.bn}
          onEnChange={(val) => updateField('story', 'body', 'en', val)}
          onBnChange={(val) => updateField('story', 'body', 'bn', val)}
          type="textarea"
        />
      )}
      {sectionKey === 'mission' && (
        <>
          <BilingualField
            label="Mission Statement"
            enValue={data.mission?.statement?.en}
            bnValue={data.mission?.statement?.bn}
            onEnChange={(val) => updateField('mission', 'statement', 'en', val)}
            onBnChange={(val) => updateField('mission', 'statement', 'bn', val)}
          />
          <BilingualField
            label="Vision Statement"
            enValue={data.mission?.vision?.en}
            bnValue={data.mission?.vision?.bn}
            onEnChange={(val) => updateField('mission', 'vision', 'en', val)}
            onBnChange={(val) => updateField('mission', 'vision', 'bn', val)}
          />
        </>
      )}
      {sectionKey === 'values' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {valueCards.map((index) => (
            <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>
                Value {index + 1}
              </div>
              <BilingualField
                label="Title"
                enValue={data.values?.[`value${index + 1}_title`]?.en}
                bnValue={data.values?.[`value${index + 1}_title`]?.bn}
                onEnChange={(val) => updateField('values', `value${index + 1}_title`, 'en', val)}
                onBnChange={(val) => updateField('values', `value${index + 1}_title`, 'bn', val)}
              />
              <BilingualField
                label="Description"
                enValue={data.values?.[`value${index + 1}_description`]?.en}
                bnValue={data.values?.[`value${index + 1}_description`]?.bn}
                onEnChange={(val) => updateField('values', `value${index + 1}_description`, 'en', val)}
                onBnChange={(val) => updateField('values', `value${index + 1}_description`, 'bn', val)}
                type="textarea"
              />
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => saveSection(sectionKey)}
        disabled={saving}
        style={buttonStyle}
      >
        {saving ? 'Saving...' : `Save ${title}`}
      </button>
      {message && <div style={messageStyle}>{message}</div>}
    </div>
  )

  const containerStyle = {
    maxWidth: '900px',
  }

  const sectionStyle = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  }

  const titleStyle = {
    fontSize: '1.3rem',
    fontWeight: 700,
    marginBottom: '1.25rem',
    color: '#0f172a',
  }

  const buttonStyle = {
    padding: '0.6rem 1.25rem',
    background: '#0f172a',
    color: '#fff',
    border: 'none',
    borderRadius: '0.4rem',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    marginTop: '1.25rem',
  }

  const tabStyle = {
    padding: '0.6rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '999px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.92rem',
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
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '0.75rem', fontSize: '1.8rem' }}>About Page Editor</h1>
      <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
        Update the public About page text content in structured bilingual fields.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveSection(tab.key)}
            style={{
              ...tabStyle,
              background: activeSection === tab.key ? '#0f172a' : '#fff',
              color: activeSection === tab.key ? '#fff' : '#0f172a',
              borderColor: '#d1d5db',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSection === 'intro' && section('Page Intro', 'intro')}
      {activeSection === 'story' && section('Our Story', 'story')}
      {activeSection === 'mission' && section('Mission & Vision', 'mission')}
      {activeSection === 'values' && section('Core Values', 'values')}
    </div>
  )
}
