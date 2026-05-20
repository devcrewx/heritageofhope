import { useEffect, useState } from 'react'
import BilingualField from '../components/BilingualField'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import MediaUploadField from '../components/MediaUploadField'
import apiClient from '../lib/api'
import { useApi } from '../hooks/useApi'

const focusFields = ['tag1', 'tag2', 'tag3']
const stepFields = ['step1', 'step2', 'step3', 'step4']

export default function OurWorkEditor() {
  const { request } = useApi()
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [heroUploading, setHeroUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

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
      formData.append('page', 'our-work')
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
      await apiClient.delete('/api/admin/media/hero/our-work/hero')
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

  const updateField = (section, fieldKey, lang, value) => {
    setData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [fieldKey]: { ...current[section]?.[fieldKey], [lang]: value },
      },
    }))
  }

  const saveSection = async (section) => {
    setSaving(true)
    setError('')
    setStatusMessage('')
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
      setStatusMessage('Saved successfully')
    } catch (error) {
      setError(error.message)
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

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>Our Work Page Editor</h1>
      <p style={styles.hint}>This controls the public Our Work page text sections. Program cards still use the shared program content.</p>

      {error && <ErrorMessage error={error} onClose={() => setError('')} className="mb-4" />}

      {initialLoading ? (
        <LoadingSpinner fullPage text="Loading our work content..." />
      ) : (
        <>
          {error && <ErrorMessage error={error} onClose={() => setError('')} className="mb-4" />}

          <div style={styles.section}>
            <div style={styles.title}>Intro Section</div>
            <MediaUploadField
              label="Hero Photo"
              helperText="This image appears in the public Our Work hero panel."
              currentUrl={heroImageUrl}
              currentAlt="Our Work hero"
              onUpload={uploadHeroImage}
              onDelete={heroImageUrl ? deleteHeroImage : undefined}
              uploading={heroUploading}
              previewClassName="h-64 w-full object-cover"
            />
            <BilingualField
              labelEn="Page Title"
              labelBn="Page Title (Bangla)"
              valueEn={data.hero?.title?.en}
              valueBn={data.hero?.title?.bn}
              onChangeEn={(val) => updateField('hero', 'title', 'en', val)}
              onChangeBn={(val) => updateField('hero', 'title', 'bn', val)}
            />
            <BilingualField
              labelEn="Page Intro"
              labelBn="Page Intro (Bangla)"
              valueEn={data.hero?.intro?.en}
              valueBn={data.hero?.intro?.bn}
              onChangeEn={(val) => updateField('hero', 'intro', 'en', val)}
              onChangeBn={(val) => updateField('hero', 'intro', 'bn', val)}
              isTextArea
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
                  labelEn={`Tag ${index + 1}`}
                  labelBn={`Tag ${index + 1} (Bangla)`}
                  valueEn={data.focus?.[fieldKey]?.en}
                  valueBn={data.focus?.[fieldKey]?.bn}
                  onChangeEn={(val) => updateField('focus', fieldKey, 'en', val)}
                  onChangeBn={(val) => updateField('focus', fieldKey, 'bn', val)}
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
              labelEn="Section Heading"
              labelBn="Section Heading (Bangla)"
              valueEn={data.approach?.heading?.en}
              valueBn={data.approach?.heading?.bn}
              onChangeEn={(val) => updateField('approach', 'heading', 'en', val)}
              onChangeBn={(val) => updateField('approach', 'heading', 'bn', val)}
            />
            <div style={{ display: 'grid', gap: '1rem' }}>
              {stepFields.map((fieldKey, index) => (
                <BilingualField
                  key={fieldKey}
                  labelEn={`Step ${index + 1}`}
                  labelBn={`Step ${index + 1} (Bangla)`}
                  valueEn={data.approach?.[fieldKey]?.en}
                  valueBn={data.approach?.[fieldKey]?.bn}
                  onChangeEn={(val) => updateField('approach', fieldKey, 'en', val)}
                  onChangeBn={(val) => updateField('approach', fieldKey, 'bn', val)}
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
              labelEn="Small Label"
              labelBn="Small Label (Bangla)"
              valueEn={data.join?.meta?.en}
              valueBn={data.join?.meta?.bn}
              onChangeEn={(val) => updateField('join', 'meta', 'en', val)}
              onChangeBn={(val) => updateField('join', 'meta', 'bn', val)}
            />
            <BilingualField
              labelEn="Body Text"
              labelBn="Body Text (Bangla)"
              valueEn={data.join?.body?.en}
              valueBn={data.join?.body?.bn}
              onChangeEn={(val) => updateField('join', 'body', 'en', val)}
              onChangeBn={(val) => updateField('join', 'body', 'bn', val)}
              isTextArea
            />
            <BilingualField
              labelEn="Button Label"
              labelBn="Button Label (Bangla)"
              valueEn={data.join?.button?.en}
              valueBn={data.join?.button?.bn}
              onChangeEn={(val) => updateField('join', 'button', 'en', val)}
              onChangeBn={(val) => updateField('join', 'button', 'bn', val)}
            />
            <button onClick={() => saveSection('join')} disabled={saving} style={styles.button}>
              {saving ? 'Saving...' : 'Save Join Box'}
            </button>
          </div>

          <div style={styles.section}>
            <div style={styles.title}>Page Labels</div>
            <BilingualField labelEn="Page Eyebrow" labelBn="Page Eyebrow (Bangla)" valueEn={data.pageContent?.eyebrow?.en} valueBn={data.pageContent?.eyebrow?.bn} onChangeEn={(val) => updateField('pageContent', 'eyebrow', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'eyebrow', 'bn', val)} />
            <BilingualField labelEn="Approach Section Label" labelBn="Approach Section Label (Bangla)" valueEn={data.pageContent?.approachLabel?.en} valueBn={data.pageContent?.approachLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'approachLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'approachLabel', 'bn', val)} />
            <BilingualField labelEn="Join Section Label" labelBn="Join Section Label (Bangla)" valueEn={data.pageContent?.joinLabel?.en} valueBn={data.pageContent?.joinLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'joinLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'joinLabel', 'bn', val)} />
            <button onClick={() => saveSection('pageContent')} disabled={saving} style={styles.button}>
              {saving ? 'Saving...' : 'Save Page Labels'}
            </button>
          </div>

          <div style={styles.section}>
            <div style={styles.title}>Showcase Photos</div>
            <p style={styles.hint}>These photos appear in the photo grid section on the public Our Work page. Up to 6 images. Leave fields blank to omit.</p>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: '0.4rem', padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Image {idx}</p>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Image URL</label>
                  <input
                    type="text"
                    value={data.showcase?.[`img${idx}_url`]?.en || ''}
                    onChange={(e) => updateField('showcase', `img${idx}_url`, 'en', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.3rem', fontSize: '0.9rem' }}
                    placeholder="https://res.cloudinary.com/..."
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Label (EN)</label>
                    <input
                      type="text"
                      value={data.showcase?.[`img${idx}_labelEn`]?.en || ''}
                      onChange={(e) => updateField('showcase', `img${idx}_labelEn`, 'en', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.3rem', fontSize: '0.9rem' }}
                      placeholder="English label"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Label (BN)</label>
                    <input
                      type="text"
                      value={data.showcase?.[`img${idx}_labelBn`]?.en || ''}
                      onChange={(e) => updateField('showcase', `img${idx}_labelBn`, 'en', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.3rem', fontSize: '0.9rem' }}
                      placeholder="Bangla label"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => saveSection('showcase')} disabled={saving} style={styles.button}>
              {saving ? 'Saving...' : 'Save Showcase Photos'}
            </button>
          </div>

          {statusMessage && <div style={successStyle}>{statusMessage}</div>}
        </>
      )}
    </div>
  )
}

const successStyle = {
  marginTop: '1rem',
  padding: '0.75rem',
  borderRadius: '0.4rem',
  fontSize: '0.9rem',
  background: '#dbeafe',
  color: '#0c4a6e',
}