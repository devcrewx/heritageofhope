import { useState, useEffect } from 'react'
import BilingualField from '../components/BilingualField'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import MediaUploadField from '../components/MediaUploadField'
import apiClient from '../lib/api'
import { useApi } from '../hooks/useApi'

export default function AboutEditor() {
  const { request } = useApi()
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [heroUploading, setHeroUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
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
      setError(error.message)
    } finally {
      setInitialLoading(false)
    }
  }

  const heroImageUrl = data.hero?.heroImage?.en || ''

  const uploadHeroImage = async (file) => {
    setHeroUploading(true)
    setError('')
    setStatusMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('page', 'about')
      formData.append('section', 'hero')

      const response = await apiClient.post('/api/admin/media/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data?.data?.url) {
        setData((current) => ({
          ...current,
          hero: {
            ...current.hero,
            heroImage: {
              en: response.data.data.url,
              bn: response.data.data.publicId || response.data.data.url,
            },
          },
        }))
      }
      setStatusMessage('Hero photo updated')
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setHeroUploading(false)
    }
  }

  const deleteHeroImage = async () => {
    setHeroUploading(true)
    setError('')
    setStatusMessage('')

    try {
      await apiClient.delete('/api/admin/media/hero/about/hero')
      setData((current) => ({
        ...current,
        hero: {
          ...current.hero,
          heroImage: { en: '', bn: '' },
        },
      }))
      setStatusMessage('Hero photo removed')
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setHeroUploading(false)
    }
  }

  const saveSection = async (section) => {
    setSaving(true)
    setError('')
    setStatusMessage('')
    try {
      const updates = data[section] || {}
      const promises = Object.entries(updates).map(([fieldKey, values]) =>
        request(`/api/admin/content/about/${section}/${fieldKey}`, {
          method: 'PATCH',
          body: JSON.stringify(values),
        })
      )
      await Promise.all(promises)
      setStatusMessage('Saved successfully')
    } catch (error) {
      setError(error.message)
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
    { key: 'pageContent', label: 'Page Labels' },
    { key: 'story', label: 'Our Story' },
    { key: 'mission', label: 'Mission & Vision' },
    { key: 'values', label: 'Core Values' },
  ]

  const section = (title, sectionKey) => (
    <div key={sectionKey} style={sectionStyle}>
      <div style={titleStyle}>{title}</div>
      {sectionKey === 'intro' && (
        <>
          <MediaUploadField
            label="Hero Photo"
            helperText="This image appears beside the About page intro."
            currentUrl={heroImageUrl}
            currentAlt="About hero"
            onUpload={uploadHeroImage}
            onDelete={heroImageUrl ? deleteHeroImage : undefined}
            uploading={heroUploading}
            previewClassName="h-64 w-full object-cover"
          />
          <BilingualField
            labelEn="Page Title"
            labelBn="Page Title (Bangla)"
            valueEn={data.intro?.title?.en}
            valueBn={data.intro?.title?.bn}
            onChangeEn={(val) => updateField('intro', 'title', 'en', val)}
            onChangeBn={(val) => updateField('intro', 'title', 'bn', val)}
            required
          />
          <BilingualField
            labelEn="Intro Paragraph"
            labelBn="Intro Paragraph (Bangla)"
            valueEn={data.intro?.paragraph?.en}
            valueBn={data.intro?.paragraph?.bn}
            onChangeEn={(val) => updateField('intro', 'paragraph', 'en', val)}
            onChangeBn={(val) => updateField('intro', 'paragraph', 'bn', val)}
            isTextArea
          />
        </>
      )}
      {sectionKey === 'pageContent' && (
        <>
          <BilingualField
            labelEn="Documents Section Label"
            labelBn="Documents Section Label (Bangla)"
            valueEn={data.pageContent?.documentsLabel?.en}
            valueBn={data.pageContent?.documentsLabel?.bn}
            onChangeEn={(val) => updateField('pageContent', 'documentsLabel', 'en', val)}
            onChangeBn={(val) => updateField('pageContent', 'documentsLabel', 'bn', val)}
          />
          <BilingualField
            labelEn="Documents Section Heading"
            labelBn="Documents Section Heading (Bangla)"
            valueEn={data.pageContent?.documentsHeading?.en}
            valueBn={data.pageContent?.documentsHeading?.bn}
            onChangeEn={(val) => updateField('pageContent', 'documentsHeading', 'en', val)}
            onChangeBn={(val) => updateField('pageContent', 'documentsHeading', 'bn', val)}
          />
        </>
      )}
      {sectionKey === 'story' && (
        <BilingualField
          labelEn="Our Story"
          labelBn="Our Story (Bangla)"
          valueEn={data.story?.body?.en}
          valueBn={data.story?.body?.bn}
          onChangeEn={(val) => updateField('story', 'body', 'en', val)}
          onChangeBn={(val) => updateField('story', 'body', 'bn', val)}
          isTextArea
        />
      )}
      {sectionKey === 'mission' && (
        <>
          <BilingualField
            labelEn="Mission Statement"
            labelBn="Mission Statement (Bangla)"
            valueEn={data.mission?.statement?.en}
            valueBn={data.mission?.statement?.bn}
            onChangeEn={(val) => updateField('mission', 'statement', 'en', val)}
            onChangeBn={(val) => updateField('mission', 'statement', 'bn', val)}
          />
          <BilingualField
            labelEn="Vision Statement"
            labelBn="Vision Statement (Bangla)"
            valueEn={data.mission?.vision?.en}
            valueBn={data.mission?.vision?.bn}
            onChangeEn={(val) => updateField('mission', 'vision', 'en', val)}
            onChangeBn={(val) => updateField('mission', 'vision', 'bn', val)}
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
                labelEn="Title"
                labelBn="Title (Bangla)"
                valueEn={data.values?.[`value${index + 1}_title`]?.en}
                valueBn={data.values?.[`value${index + 1}_title`]?.bn}
                onChangeEn={(val) => updateField('values', `value${index + 1}_title`, 'en', val)}
                onChangeBn={(val) => updateField('values', `value${index + 1}_title`, 'bn', val)}
              />
              <BilingualField
                labelEn="Description"
                labelBn="Description (Bangla)"
                valueEn={data.values?.[`value${index + 1}_description`]?.en}
                valueBn={data.values?.[`value${index + 1}_description`]?.bn}
                onChangeEn={(val) => updateField('values', `value${index + 1}_description`, 'en', val)}
                onChangeBn={(val) => updateField('values', `value${index + 1}_description`, 'bn', val)}
                isTextArea
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
      {statusMessage && <div style={successStyle}>{statusMessage}</div>}
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

  const successStyle = {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '0.4rem',
    fontSize: '0.9rem',
    background: '#dbeafe',
    color: '#0c4a6e',
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '0.75rem', fontSize: '1.8rem' }}>About Page Editor</h1>
      <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
        Update the public About page text content in structured bilingual fields.
      </p>

      {initialLoading ? (
        <LoadingSpinner fullPage text="Loading about page content..." />
      ) : (
        <>
          {error && <ErrorMessage error={error} onClose={() => setError('')} className="mb-4" />}

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
          {activeSection === 'pageContent' && section('Page Labels', 'pageContent')}
          {activeSection === 'story' && section('Our Story', 'story')}
          {activeSection === 'mission' && section('Mission & Vision', 'mission')}
          {activeSection === 'values' && section('Core Values', 'values')}
        </>
      )}
    </div>
  )
}
