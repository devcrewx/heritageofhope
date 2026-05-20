import { useState, useEffect } from 'react'
import BilingualField from '../components/BilingualField'
import { Toast } from '../components/Toast'
import { ConfirmDialog } from '../components/ConfirmDialog'
import MediaUploadField from '../components/MediaUploadField'
import apiClient from '../lib/api'

function HomeEditor() {
  // Hero section
  const [heroEyebrow, setHeroEyebrow] = useState('')
  const [heroFootnoteEn, setHeroFootnoteEn] = useState('')
  const [heroFootnoteBn, setHeroFootnoteBn] = useState('')
  const [heroHeadlineEn, setHeroHeadlineEn] = useState('')
  const [heroHeadlineBn, setHeroHeadlineBn] = useState('')
  const [heroIntroEn, setHeroIntroEn] = useState('')
  const [heroIntroBn, setHeroIntroBn] = useState('')
  const [heroImageUrl, setHeroImageUrl] = useState('')

  // Trust badges
  const [badge1, setBadge1] = useState('')
  const [badge2, setBadge2] = useState('')
  const [badge3, setBadge3] = useState('')

  // Impact stats
  const [stats, setStats] = useState([])
  const [newStatValue, setNewStatValue] = useState('')
  const [newStatLabelEn, setNewStatLabelEn] = useState('')
  const [newStatLabelBn, setNewStatLabelBn] = useState('')

  // Mission section
  const [missionHeadingEn, setMissionHeadingEn] = useState('')
  const [missionHeadingBn, setMissionHeadingBn] = useState('')

  // Donation CTA
  const [ctaHeadlineEn, setCtaHeadlineEn] = useState('')
  const [ctaHeadlineBn, setCtaHeadlineBn] = useState('')
  const [ctaBodyEn, setCtaBodyEn] = useState('')
  const [ctaBodyBn, setCtaBodyBn] = useState('')
  const [ctaButtonLabelEn, setCtaButtonLabelEn] = useState('')
  const [ctaButtonLabelBn, setCtaButtonLabelBn] = useState('')

  // Page labels
  const [pageStatsLabelEn, setPageStatsLabelEn] = useState('')
  const [pageStatsLabelBn, setPageStatsLabelBn] = useState('')
  const [pageStatsHeadingEn, setPageStatsHeadingEn] = useState('')
  const [pageStatsHeadingBn, setPageStatsHeadingBn] = useState('')
  const [pagePillarLabelEn, setPagePillarLabelEn] = useState('')
  const [pagePillarLabelBn, setPagePillarLabelBn] = useState('')
  const [pageActivityLabelEn, setPageActivityLabelEn] = useState('')
  const [pageActivityLabelBn, setPageActivityLabelBn] = useState('')
  const [pageActivityHeadingEn, setPageActivityHeadingEn] = useState('')
  const [pageActivityHeadingBn, setPageActivityHeadingBn] = useState('')
  const [pageDonationLabelEn, setPageDonationLabelEn] = useState('')
  const [pageDonationLabelBn, setPageDonationLabelBn] = useState('')

  // Figcaption
  const [figcaptionEn, setFigcaptionEn] = useState('')
  const [figcaptionBn, setFigcaptionBn] = useState('')

  // Reg cert thumb
  const [regCertThumbUrl, setRegCertThumbUrl] = useState('')

  // Showcase images
  const [showcaseSlots, setShowcaseSlots] = useState(
    Array.from({ length: 6 }, () => ({ url: '', labelEn: '', labelBn: '' }))
  )
  const [showcaseUploading, setShowcaseUploading] = useState(Array(6).fill(false))

  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [heroUploading, setHeroUploading] = useState(false)
  const [certUploading, setCertUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, statId: null })
  const [lastSavedTime, setLastSavedTime] = useState(null)

  // Fetch content on mount
  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        const response = await apiClient.get('/api/admin/content/home')
        
        // Parse hero section
        if (response.data.sections?.hero) {
          const h = response.data.sections.hero
          setHeroEyebrow(h.eyebrow?.en || '')
          setHeroFootnoteEn(h.heroFootnote?.en || '')
          setHeroFootnoteBn(h.heroFootnote?.bn || '')
          setHeroHeadlineEn(h.headline?.en || '')
          setHeroHeadlineBn(h.headline?.bn || '')
          setHeroIntroEn(h.intro?.en || '')
          setHeroIntroBn(h.intro?.bn || '')
          setBadge1(h.badge1?.en || '')
          setBadge2(h.badge2?.en || '')
          setBadge3(h.badge3?.en || '')
          setHeroImageUrl(h.heroImage?.en || '')
          setFigcaptionEn(h.figcaption?.en || '')
          setFigcaptionBn(h.figcaption?.bn || '')
          setRegCertThumbUrl(h.regCertThumb?.en || '')
        }

        // Parse showcase images
        if (response.data.sections?.showcase) {
          const sc = response.data.sections.showcase
          setShowcaseSlots((prev) => prev.map((slot, i) => ({
            url: sc[`img${i + 1}_url`]?.en || '',
            labelEn: sc[`img${i + 1}_labelEn`]?.en || '',
            labelBn: sc[`img${i + 1}_labelBn`]?.en || '',
          })))
        }

        // Parse mission section
        if (response.data.sections?.mission) {
          const m = response.data.sections.mission
          setMissionHeadingEn(m.heading?.en || '')
          setMissionHeadingBn(m.heading?.bn || '')
        }

        // Parse CTA section
        if (response.data.sections?.cta) {
          const c = response.data.sections.cta
          setCtaHeadlineEn(c.headline?.en || '')
          setCtaHeadlineBn(c.headline?.bn || '')
          setCtaBodyEn(c.body?.en || '')
          setCtaBodyBn(c.body?.bn || '')
          setCtaButtonLabelEn(c.buttonLabel?.en || '')
          setCtaButtonLabelBn(c.buttonLabel?.bn || '')
        }

        if (response.data.sections?.pageContent) {
          const p = response.data.sections.pageContent
          setPageStatsLabelEn(p.statsLabel?.en || '')
          setPageStatsLabelBn(p.statsLabel?.bn || '')
          setPageStatsHeadingEn(p.statsHeading?.en || '')
          setPageStatsHeadingBn(p.statsHeading?.bn || '')
          setPagePillarLabelEn(p.pillarLabel?.en || '')
          setPagePillarLabelBn(p.pillarLabel?.bn || '')
          setPageActivityLabelEn(p.activityLabel?.en || '')
          setPageActivityLabelBn(p.activityLabel?.bn || '')
          setPageActivityHeadingEn(p.activityHeading?.en || '')
          setPageActivityHeadingBn(p.activityHeading?.bn || '')
          setPageDonationLabelEn(p.donationLabel?.en || '')
          setPageDonationLabelBn(p.donationLabel?.bn || '')
        }

        // Fetch stats separately
        const statsResponse = await apiClient.get('/api/admin/stats')
        setStats(statsResponse.data || [])
      } catch (error) {
        showToast('Failed to load content', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  async function saveHero(e) {
    e.preventDefault()
    setSaving(true)

    try {
      await Promise.all([
        apiClient.patch('/api/admin/content/home/hero/eyebrow', { valueEn: heroEyebrow }),
        apiClient.patch('/api/admin/content/home/hero/headline', { valueEn: heroHeadlineEn, valueBn: heroHeadlineBn }),
        apiClient.patch('/api/admin/content/home/hero/intro', { valueEn: heroIntroEn, valueBn: heroIntroBn }),
        apiClient.patch('/api/admin/content/home/hero/heroFootnote', { valueEn: heroFootnoteEn, valueBn: heroFootnoteBn }),
        apiClient.patch('/api/admin/content/home/hero/badge1', { valueEn: badge1 }),
        apiClient.patch('/api/admin/content/home/hero/badge2', { valueEn: badge2 }),
        apiClient.patch('/api/admin/content/home/hero/badge3', { valueEn: badge3 }),
        apiClient.patch('/api/admin/content/home/hero/figcaption', { valueEn: figcaptionEn, valueBn: figcaptionBn }),
      ])
      setLastSavedTime(new Date())
      showToast('✓ Saved to API', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to save hero section'
      showToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function addStat(e) {
    e.preventDefault()
    if (!newStatValue || !newStatLabelEn) {
      showToast('Please fill in all stat fields', 'error')
      return
    }

    setSaving(true)
    try {
      await apiClient.post('/api/admin/stats', {
        value: newStatValue,
        labelEn: newStatLabelEn,
        labelBn: newStatLabelBn,
      })
      
      // Refresh stats
      const response = await apiClient.get('/api/admin/stats')
      setStats(response.data || [])
      
      // Clear form
      setNewStatValue('')
      setNewStatLabelEn('')
      setNewStatLabelBn('')
      showToast('Stat added', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to add stat'
      showToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  const confirmDeleteStat = (statId) => {
    setDeleteConfirm({ isOpen: true, statId })
  }

  async function deleteStat() {
    const { statId } = deleteConfirm
    if (!statId) return

    try {
      await apiClient.delete(`/api/admin/stats/${statId}`)
      setStats(stats.filter(s => s.id !== statId))
      setDeleteConfirm({ isOpen: false, statId: null })
      showToast('Stat deleted', 'success')
    } catch (error) {
      showToast('Failed to delete stat', 'error')
    }
  }

  async function saveMission(e) {
    e.preventDefault()
    setSaving(true)

    try {
      await apiClient.patch('/api/admin/content/home/mission/heading', {
        valueEn: missionHeadingEn,
        valueBn: missionHeadingBn,
      })
      showToast('Mission section saved', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to save mission'
      showToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function saveCTA(e) {
    e.preventDefault()
    setSaving(true)

    try {
      await Promise.all([
        apiClient.patch('/api/admin/content/home/cta/headline', { valueEn: ctaHeadlineEn, valueBn: ctaHeadlineBn }),
        apiClient.patch('/api/admin/content/home/cta/body', { valueEn: ctaBodyEn, valueBn: ctaBodyBn }),
        apiClient.patch('/api/admin/content/home/cta/buttonLabel', { valueEn: ctaButtonLabelEn, valueBn: ctaButtonLabelBn }),
      ])
      showToast('Donation CTA saved', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to save CTA'
      showToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function savePageLabels(e) {
    e.preventDefault()
    setSaving(true)

    try {
      await Promise.all([
        apiClient.patch('/api/admin/content/home/pageContent/statsLabel', { valueEn: pageStatsLabelEn, valueBn: pageStatsLabelBn }),
        apiClient.patch('/api/admin/content/home/pageContent/statsHeading', { valueEn: pageStatsHeadingEn, valueBn: pageStatsHeadingBn }),
        apiClient.patch('/api/admin/content/home/pageContent/pillarLabel', { valueEn: pagePillarLabelEn, valueBn: pagePillarLabelBn }),
        apiClient.patch('/api/admin/content/home/pageContent/activityLabel', { valueEn: pageActivityLabelEn, valueBn: pageActivityLabelBn }),
        apiClient.patch('/api/admin/content/home/pageContent/activityHeading', { valueEn: pageActivityHeadingEn, valueBn: pageActivityHeadingBn }),
        apiClient.patch('/api/admin/content/home/pageContent/donationLabel', { valueEn: pageDonationLabelEn, valueBn: pageDonationLabelBn }),
      ])
      showToast('Page labels saved', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to save page labels'
      showToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function uploadHeroImage(file) {
    setHeroUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('page', 'home')
      formData.append('section', 'hero')

      const response = await apiClient.post('/api/admin/media/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setHeroImageUrl(response.data?.data?.url || '')
      showToast('Hero image updated', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to upload hero image'
      showToast(msg, 'error')
    } finally {
      setHeroUploading(false)
    }
  }

  async function deleteHeroImage() {
    setHeroUploading(true)

    try {
      await apiClient.delete('/api/admin/media/hero/home/hero')
      setHeroImageUrl('')
      showToast('Hero image removed', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to remove hero image'
      showToast(msg, 'error')
    } finally {
      setHeroUploading(false)
    }
  }

  async function uploadRegCertThumb(file) {
    setCertUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('page', 'home')
      formData.append('section', 'hero')
      formData.append('fieldKey', 'regCertThumb')

      const response = await apiClient.post('/api/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setRegCertThumbUrl(response.data?.data?.url || '')
      showToast('Certificate thumbnail updated', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to upload certificate image'
      showToast(msg, 'error')
    } finally {
      setCertUploading(false)
    }
  }

  async function deleteRegCertThumb() {
    setCertUploading(true)
    try {
      await apiClient.delete('/api/admin/media/home/hero/regCertThumb')
      setRegCertThumbUrl('')
      showToast('Certificate thumbnail removed', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to remove certificate image'
      showToast(msg, 'error')
    } finally {
      setCertUploading(false)
    }
  }

  async function uploadShowcaseImage(file, index) {
    setShowcaseUploading((prev) => prev.map((v, i) => (i === index ? true : v)))
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('page', 'home')
      formData.append('section', 'showcase')
      formData.append('fieldKey', `img${index + 1}_url`)

      const response = await apiClient.post('/api/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setShowcaseSlots((prev) => prev.map((slot, i) =>
        i === index ? { ...slot, url: response.data?.data?.url || '' } : slot
      ))
      showToast(`Showcase image ${index + 1} updated`, 'success')
    } catch (error) {
      showToast('Failed to upload showcase image', 'error')
    } finally {
      setShowcaseUploading((prev) => prev.map((v, i) => (i === index ? false : v)))
    }
  }

  async function deleteShowcaseImage(index) {
    setShowcaseUploading((prev) => prev.map((v, i) => (i === index ? true : v)))
    try {
      await apiClient.delete(`/api/admin/media/home/showcase/img${index + 1}_url`)
      setShowcaseSlots((prev) => prev.map((slot, i) =>
        i === index ? { url: '', labelEn: slot.labelEn, labelBn: slot.labelBn } : slot
      ))
      showToast(`Showcase image ${index + 1} removed`, 'success')
    } catch (error) {
      showToast('Failed to remove showcase image', 'error')
    } finally {
      setShowcaseUploading((prev) => prev.map((v, i) => (i === index ? false : v)))
    }
  }

  function updateShowcaseLabel(index, field, value) {
    setShowcaseSlots((prev) => prev.map((slot, i) =>
      i === index ? { ...slot, [field]: value } : slot
    ))
  }

  async function saveShowcaseLabels() {
    setSaving(true)
    try {
      await Promise.all(
        showcaseSlots.flatMap((slot, i) => [
          apiClient.patch(`/api/admin/content/home/showcase/img${i + 1}_labelEn`, { valueEn: slot.labelEn }),
          apiClient.patch(`/api/admin/content/home/showcase/img${i + 1}_labelBn`, { valueEn: slot.labelBn }),
        ])
      )
      showToast('Showcase labels saved', 'success')
    } catch (error) {
      showToast('Failed to save showcase labels', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section>
        <h1 className="text-2xl font-bold mb-6">Home Page</h1>
        <p className="text-gray-500">Loading content...</p>
      </section>
    )
  }

  return (
    <section className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Home Page Editor</h1>
        <p className="text-gray-600">Edit hero, stats, mission section, and donation CTA.</p>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Stat?"
        message="This stat will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={saving}
        onConfirm={deleteStat}
        onCancel={() => setDeleteConfirm({ isOpen: false, statId: null })}
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: 'hero', label: 'Hero Section' },
          { id: 'stats', label: 'Impact Stats' },
          { id: 'mission', label: 'Mission Section' },
          { id: 'cta', label: 'Donation CTA' },
          { id: 'showcase', label: 'Showcase Images' },
          { id: 'labels', label: 'Page Labels' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      {activeTab === 'hero' && (
        <form onSubmit={saveHero} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <MediaUploadField
            label="Hero Photo"
            helperText="This image appears in the main Home page hero panel."
            currentUrl={heroImageUrl}
            currentAlt="Home hero"
            onUpload={uploadHeroImage}
            onDelete={heroImageUrl ? deleteHeroImage : undefined}
            uploading={heroUploading}
            previewClassName="h-64 w-full object-cover"
          />

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Eyebrow Label*</label>
            <input
              type="text"
              value={heroEyebrow}
              onChange={(e) => setHeroEyebrow(e.target.value)}
              placeholder='e.g., "LIGHTING LIVES..."'
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <BilingualField
            labelEn="Hero Headline"
            labelBn="Hero Headline (Bangla)"
            valueEn={heroHeadlineEn}
            valueBn={heroHeadlineBn}
            onChangeEn={setHeroHeadlineEn}
            onChangeBn={setHeroHeadlineBn}
            isTextArea
            required
          />

          <BilingualField
            labelEn="Hero Intro Paragraph"
            labelBn="Hero Intro Paragraph (Bangla)"
            valueEn={heroIntroEn}
            valueBn={heroIntroBn}
            onChangeEn={setHeroIntroEn}
            onChangeBn={setHeroIntroBn}
            isTextArea
          />

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Trust Badges</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={badge1}
                onChange={(e) => setBadge1(e.target.value)}
                placeholder="e.g., Registered NGO"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={badge2}
                onChange={(e) => setBadge2(e.target.value)}
                placeholder="e.g., Est. 2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={badge3}
                onChange={(e) => setBadge3(e.target.value)}
                placeholder="e.g., Govt. of West Bengal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Hero Image Details</h3>
            <BilingualField
              labelEn="Photo Caption (figcaption)"
              labelBn="Photo Caption (Bangla)"
              valueEn={figcaptionEn}
              valueBn={figcaptionBn}
              onChangeEn={setFigcaptionEn}
              onChangeBn={setFigcaptionBn}
              hint="Text displayed below the hero photo"
            />

            <div className="mt-4">
              <MediaUploadField
                label="Registration Certificate Thumbnail"
                helperText="Small thumbnail shown in the hero area linking to the certificate."
                currentUrl={regCertThumbUrl}
                currentAlt="Registration certificate"
                onUpload={uploadRegCertThumb}
                onDelete={regCertThumbUrl ? deleteRegCertThumb : undefined}
                uploading={certUploading}
                previewClassName="h-32 w-48 object-contain"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save Hero
            </button>
          </div>
        </form>
      )}

      {/* Showcase Images */}
      {activeTab === 'showcase' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold">Showcase Images</h2>
          <p className="text-sm text-gray-500 mb-4">
            These images appear in the photo mosaic on the Home page. Upload up to 6 images with bilingual labels.
          </p>
          <div className="grid gap-6">
            {showcaseSlots.map((slot, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-gray-800">Image {i + 1}</h3>
                <MediaUploadField
                  label={`Image ${i + 1}`}
                  helperText="Upload an image for this showcase slot."
                  currentUrl={slot.url}
                  currentAlt={slot.labelEn || `Showcase ${i + 1}`}
                  onUpload={(file) => uploadShowcaseImage(file, i)}
                  onDelete={slot.url ? () => deleteShowcaseImage(i) : undefined}
                  uploading={showcaseUploading[i]}
                  previewClassName="h-40 w-full object-cover"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label (English)</label>
                    <input
                      type="text"
                      value={slot.labelEn}
                      onChange={(e) => updateShowcaseLabel(i, 'labelEn', e.target.value)}
                      placeholder="e.g., Learning Space"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label (Bangla)</label>
                    <input
                      type="text"
                      value={slot.labelBn}
                      onChange={(e) => updateShowcaseLabel(i, 'labelBn', e.target.value)}
                      placeholder="e.g., শিক্ষা কেন্দ্র"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={saveShowcaseLabels}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Showcase Labels'}
            </button>
          </div>
        </div>
      )}

      {/* Page Labels */}
      {activeTab === 'labels' && (
        <form onSubmit={savePageLabels} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <BilingualField
            labelEn="Stats Section Eyebrow"
            labelBn="Stats Section Eyebrow (Bangla)"
            valueEn={pageStatsLabelEn}
            valueBn={pageStatsLabelBn}
            onChangeEn={setPageStatsLabelEn}
            onChangeBn={setPageStatsLabelBn}
          />

          <BilingualField
            labelEn="Stats Section Heading"
            labelBn="Stats Section Heading (Bangla)"
            valueEn={pageStatsHeadingEn}
            valueBn={pageStatsHeadingBn}
            onChangeEn={setPageStatsHeadingEn}
            onChangeBn={setPageStatsHeadingBn}
          />

          <BilingualField
            labelEn="Pillar Section Eyebrow"
            labelBn="Pillar Section Eyebrow (Bangla)"
            valueEn={pagePillarLabelEn}
            valueBn={pagePillarLabelBn}
            onChangeEn={setPagePillarLabelEn}
            onChangeBn={setPagePillarLabelBn}
          />

          <BilingualField
            labelEn="Activity Section Eyebrow"
            labelBn="Activity Section Eyebrow (Bangla)"
            valueEn={pageActivityLabelEn}
            valueBn={pageActivityLabelBn}
            onChangeEn={setPageActivityLabelEn}
            onChangeBn={setPageActivityLabelBn}
          />

          <BilingualField
            labelEn="Activity Section Heading"
            labelBn="Activity Section Heading (Bangla)"
            valueEn={pageActivityHeadingEn}
            valueBn={pageActivityHeadingBn}
            onChangeEn={setPageActivityHeadingEn}
            onChangeBn={setPageActivityHeadingBn}
          />

          <BilingualField
            labelEn="Donation Section Eyebrow"
            labelBn="Donation Section Eyebrow (Bangla)"
            valueEn={pageDonationLabelEn}
            valueBn={pageDonationLabelBn}
            onChangeEn={setPageDonationLabelEn}
            onChangeBn={setPageDonationLabelBn}
          />

          <div className="flex gap-3 pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Page Labels'}
            </button>
          </div>
        </form>
      )}

      {/* Impact Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Current Stats</h3>
            {stats.length === 0 ? (
              <p className="text-gray-500 text-sm">No stats yet. Add one below.</p>
            ) : (
              <div className="space-y-2">
                {stats.map((stat) => (
                  <div key={stat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-semibold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.labelEn}</p>
                      {stat.labelBn && <p className="text-sm text-gray-600">{stat.labelBn}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => confirmDeleteStat(stat.id)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={addStat} className="mt-6 pt-6 border-t space-y-4">
              <h4 className="font-semibold text-gray-900">Add New Stat</h4>
              <input
                type="text"
                value={newStatValue}
                onChange={(e) => setNewStatValue(e.target.value)}
                placeholder="e.g., 200+"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newStatLabelEn}
                onChange={(e) => setNewStatLabelEn(e.target.value)}
                placeholder="Label in English"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newStatLabelBn}
                onChange={(e) => setNewStatLabelBn(e.target.value)}
                placeholder="Label in Bengali (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Stat'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mission Section */}
      {activeTab === 'mission' && (
        <form onSubmit={saveMission} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <BilingualField
            labelEn="Mission Section Heading"
            labelBn="Mission Section Heading (Bangla)"
            valueEn={missionHeadingEn}
            valueBn={missionHeadingBn}
            onChangeEn={setMissionHeadingEn}
            onChangeBn={setMissionHeadingBn}
            required
          />

          <div className="bg-blue-50 border border-blue-200 rounded px-4 py-3 text-sm text-blue-800">
            <p>Mission cards and images are managed in the Featured Programs editor.</p>
            <p className="mt-1">Go to Programs in admin to add, edit, reorder, or delete these items.</p>
          </div>

          <div className="flex gap-3 pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Mission Section'}
            </button>
          </div>
        </form>
      )}

      {/* Donation CTA */}
      {activeTab === 'cta' && (
        <form onSubmit={saveCTA} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <BilingualField
            labelEn="CTA Headline"
            labelBn="CTA Headline (Bangla)"
            valueEn={ctaHeadlineEn}
            valueBn={ctaHeadlineBn}
            onChangeEn={setCtaHeadlineEn}
            onChangeBn={setCtaHeadlineBn}
            hint="Main call-to-action heading"
            required
          />

          <BilingualField
            labelEn="CTA Body Text"
            labelBn="CTA Body Text (Bangla)"
            valueEn={ctaBodyEn}
            valueBn={ctaBodyBn}
            onChangeEn={setCtaBodyEn}
            onChangeBn={setCtaBodyBn}
            isTextArea
            hint="Supporting text for the donation section"
          />

          <BilingualField
            labelEn="CTA Button Label"
            labelBn="CTA Button Label (Bangla)"
            valueEn={ctaButtonLabelEn}
            valueBn={ctaButtonLabelBn}
            onChangeEn={setCtaButtonLabelEn}
            onChangeBn={setCtaButtonLabelBn}
            hint="Text for the 'Donate now' button"
          />

          <div className="flex gap-3 pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Donation CTA'}
            </button>
          </div>
        </form>
      )}

      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </section>
  )
}

export default HomeEditor
