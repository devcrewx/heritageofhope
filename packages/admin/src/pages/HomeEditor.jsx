import { useState, useEffect } from 'react'
import BilingualField from '../components/BilingualField'
import { Toast } from '../components/Toast'
import { ConfirmDialog } from '../components/ConfirmDialog'
import MediaUploadField from '../components/MediaUploadField'
import apiClient from '../lib/api'

function HomeEditor() {
  // Hero section
  const [heroEyebrow, setHeroEyebrow] = useState('')
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

  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [heroUploading, setHeroUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, statId: null })

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
          setHeroHeadlineEn(h.headline?.en || '')
          setHeroHeadlineBn(h.headline?.bn || '')
          setHeroIntroEn(h.intro?.en || '')
          setHeroIntroBn(h.intro?.bn || '')
          setBadge1(h.badge1?.en || '')
          setBadge2(h.badge2?.en || '')
          setBadge3(h.badge3?.en || '')
          setHeroImageUrl(h.heroImage?.en || '')
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
        apiClient.patch('/api/admin/content/home/hero/badge1', { valueEn: badge1 }),
        apiClient.patch('/api/admin/content/home/hero/badge2', { valueEn: badge2 }),
        apiClient.patch('/api/admin/content/home/hero/badge3', { valueEn: badge3 }),
      ])
      showToast('Hero section saved', 'success')
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
      ])
      showToast('Donation CTA saved', 'success')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to save CTA'
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

          <div className="flex gap-3 pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Hero Section'}
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
            <p>📸 Mission photos are managed in the Gallery section.</p>
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
