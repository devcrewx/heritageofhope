import { useState, useEffect, useRef, useContext } from 'react'
import BilingualField from '../components/BilingualField'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import MediaUploadField from '../components/MediaUploadField'
import SplitLayout from '../components/SplitLayout'
import { usePreviewSync } from '../hooks/usePreviewSync'
import { SiteContentContext } from '../App'
import apiClient from '../lib/api'
import { useApi } from '../hooks/useApi'

export default function AboutEditor() {
  const iframeRef = useRef(null)
  const fullContent = useContext(SiteContentContext)
  const { request } = useApi()
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [heroUploading, setHeroUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [activeSection, setActiveSection] = useState('intro')

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

  useEffect(() => {
    loadContent()
  }, [])

  const heroImageUrl = data.hero?.heroImage?.en || ''
  const certImageUrl = data.registration?.certImage?.en || ''

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

  const uploadCertImage = async (file) => {
    setHeroUploading(true)
    setError('')
    setStatusMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('page', 'about')
      formData.append('section', 'registration')
      formData.append('fieldKey', 'certImage')

      const response = await apiClient.post('/api/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data?.data?.url) {
        setData((current) => ({
          ...current,
          registration: {
            ...current.registration,
            certImage: { en: response.data.data.url, bn: response.data.data.publicId || '' },
          },
        }))
      }
      setStatusMessage('Certificate image updated')
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setHeroUploading(false)
    }
  }

  const deleteCertImage = async () => {
    setHeroUploading(true)
    setError('')
    setStatusMessage('')

    try {
      await apiClient.delete('/api/admin/media/about/registration/certImage')
      setData((current) => ({
        ...current,
        registration: {
          ...current.registration,
          certImage: { en: '', bn: '' },
        },
      }))
      setStatusMessage('Certificate image removed')
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
    setData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [fieldKey]: {
          ...current[section]?.[fieldKey],
          [lang]: value,
        },
      },
    }))
  }

  const valueCards = [0, 1, 2, 3]

  const tabs = [
    { key: 'intro', label: 'Page Intro' },
    { key: 'pageContent', label: 'Page Labels' },
    { key: 'story', label: 'Our Story' },
    { key: 'mission', label: 'Mission & Vision' },
    { key: 'values', label: 'Core Values' },
    { key: 'registration', label: 'Registration' },
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
          <BilingualField labelEn="Page Eyebrow" labelBn="Page Eyebrow (Bangla)" valueEn={data.pageContent?.eyebrow?.en} valueBn={data.pageContent?.eyebrow?.bn} onChangeEn={(val) => updateField('pageContent', 'eyebrow', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'eyebrow', 'bn', val)} />
          <BilingualField labelEn="Story Section Label" labelBn="Story Section Label (Bangla)" valueEn={data.pageContent?.storyLabel?.en} valueBn={data.pageContent?.storyLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'storyLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'storyLabel', 'bn', val)} />
          <BilingualField labelEn="Mission Label" labelBn="Mission Label (Bangla)" valueEn={data.pageContent?.missionLabel?.en} valueBn={data.pageContent?.missionLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'missionLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'missionLabel', 'bn', val)} />
          <BilingualField labelEn="Vision Label" labelBn="Vision Label (Bangla)" valueEn={data.pageContent?.visionLabel?.en} valueBn={data.pageContent?.visionLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'visionLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'visionLabel', 'bn', val)} />
          <BilingualField labelEn="Values Section Eyebrow" labelBn="Values Section Eyebrow (Bangla)" valueEn={data.pageContent?.valuesLabel?.en} valueBn={data.pageContent?.valuesLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'valuesLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'valuesLabel', 'bn', val)} />
          <BilingualField labelEn="Values Section Heading" labelBn="Values Section Heading (Bangla)" valueEn={data.pageContent?.valuesHeading?.en} valueBn={data.pageContent?.valuesHeading?.bn} onChangeEn={(val) => updateField('pageContent', 'valuesHeading', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'valuesHeading', 'bn', val)} />
          <BilingualField labelEn="Registration Section Eyebrow" labelBn="Registration Section Eyebrow (Bangla)" valueEn={data.pageContent?.regLabel?.en} valueBn={data.pageContent?.regLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'regLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'regLabel', 'bn', val)} />
          <BilingualField labelEn="Registration Section Heading" labelBn="Registration Section Heading (Bangla)" valueEn={data.pageContent?.regHeading?.en} valueBn={data.pageContent?.regHeading?.bn} onChangeEn={(val) => updateField('pageContent', 'regHeading', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'regHeading', 'bn', val)} />
          <BilingualField labelEn="Certificate Label" labelBn="Certificate Label (Bangla)" valueEn={data.pageContent?.certLabel?.en} valueBn={data.pageContent?.certLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'certLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'certLabel', 'bn', val)} />
          <BilingualField labelEn="Partners Label" labelBn="Partners Label (Bangla)" valueEn={data.pageContent?.partnersLabel?.en} valueBn={data.pageContent?.partnersLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'partnersLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'partnersLabel', 'bn', val)} />
          <BilingualField labelEn="Team Section Eyebrow" labelBn="Team Section Eyebrow (Bangla)" valueEn={data.pageContent?.teamLabel?.en} valueBn={data.pageContent?.teamLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'teamLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'teamLabel', 'bn', val)} />
          <BilingualField labelEn="Team Section Heading" labelBn="Team Section Heading (Bangla)" valueEn={data.pageContent?.teamHeading?.en} valueBn={data.pageContent?.teamHeading?.bn} onChangeEn={(val) => updateField('pageContent', 'teamHeading', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'teamHeading', 'bn', val)} />
          <BilingualField labelEn="Documents Section Label" labelBn="Documents Section Label (Bangla)" valueEn={data.pageContent?.documentsLabel?.en} valueBn={data.pageContent?.documentsLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'documentsLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'documentsLabel', 'bn', val)} />
          <BilingualField labelEn="Documents Section Heading" labelBn="Documents Section Heading (Bangla)" valueEn={data.pageContent?.documentsHeading?.en} valueBn={data.pageContent?.documentsHeading?.bn} onChangeEn={(val) => updateField('pageContent', 'documentsHeading', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'documentsHeading', 'bn', val)} />
        </>
      )}
      {sectionKey === 'story' && (
        <>
          <BilingualField
            labelEn="Story Heading"
            labelBn="Story Heading (Bangla)"
            valueEn={data.story?.heading?.en}
            valueBn={data.story?.heading?.bn}
            onChangeEn={(val) => updateField('story', 'heading', 'en', val)}
            onChangeBn={(val) => updateField('story', 'heading', 'bn', val)}
          />
          <BilingualField
            labelEn="Story Body"
            labelBn="Story Body (Bangla)"
            valueEn={data.story?.body?.en}
            valueBn={data.story?.body?.bn}
            onChangeEn={(val) => updateField('story', 'body', 'en', val)}
            onChangeBn={(val) => updateField('story', 'body', 'bn', val)}
            isTextArea
          />
        </>
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

  const draft = {
    ...data,
    hero: {
      pageTitle: data.intro?.title || { en: '', bn: '' },
      intro: data.intro?.paragraph || { en: '', bn: '' },
      heroImage: data.hero?.heroImage?.en || '',
    },
    registration: { ...data.registration, certImage: data.registration?.certImage?.en || '' },
  }
  usePreviewSync(iframeRef, draft, 'about', fullContent)

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
    <SplitLayout previewPage="/about" iframeRef={iframeRef}>
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
          {activeSection === 'registration' && (
            <div style={sectionStyle}>
              <div style={titleStyle}>Registration</div>
              <MediaUploadField
                label="Certificate Image"
                helperText="Registration certificate image displayed on the About page."
                currentUrl={certImageUrl}
                currentAlt="Registration certificate"
                onUpload={uploadCertImage}
                onDelete={certImageUrl ? deleteCertImage : undefined}
                uploading={heroUploading}
                previewClassName="h-64 w-full object-contain"
              />
              <BilingualField
                labelEn="Registration Body Text"
                labelBn="Registration Body Text (Bangla)"
                valueEn={data.registration?.body?.en}
                valueBn={data.registration?.body?.bn}
                onChangeEn={(val) => updateField('registration', 'body', 'en', val)}
                onChangeBn={(val) => updateField('registration', 'body', 'bn', val)}
                isTextArea
              />
              <button onClick={() => saveSection('registration')} disabled={saving} style={buttonStyle}>
                {saving ? 'Saving...' : 'Save Registration'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
    </SplitLayout>
  )
}
