import { useState, useEffect } from 'react'
import BilingualField from '../components/BilingualField'
import { Toast } from '../components/Toast'
import apiClient from '../lib/api'

function HomeEditor() {
  // Hero section
  const [heroEyebrow, setHeroEyebrow] = useState('')
  const [heroHeadlineEn, setHeroHeadlineEn] = useState('')
  const [heroHeadlineBn, setHeroHeadlineBn] = useState('')
  const [heroIntroEn, setHeroIntroEn] = useState('')
  const [heroIntroBn, setHeroIntroBn] = useState('')

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
  const [activeTab, setActiveTab] = useState('hero')
  const [toast, setToast] = useState(null)

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

  async function deleteStat(id) {
    if (!confirm('Delete this stat?')) return

    try {
      await apiClient.delete(`/api/admin/stats/${id}`)
      setStats(stats.filter(s => s.id !== id))
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
            label="Hero Headline"
            enValue={heroHeadlineEn}
            bnValue={heroHeadlineBn}
            onEnChange={setHeroHeadlineEn}
            onBnChange={setHeroHeadlineBn}
            type="textarea"
            required
          />

          <BilingualField
            label="Hero Intro Paragraph"
            enValue={heroIntroEn}
            bnValue={heroIntroBn}
            onEnChange={setHeroIntroEn}
            onBnChange={setHeroIntroBn}
            type="textarea"
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
                      onClick={() => deleteStat(stat.id)}
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
            label="Mission Section Heading"
            enValue={missionHeadingEn}
            bnValue={missionHeadingBn}
            onEnChange={setMissionHeadingEn}
            onBnChange={setMissionHeadingBn}
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
            label="CTA Headline"
            enValue={ctaHeadlineEn}
            bnValue={ctaHeadlineBn}
            onEnChange={setCtaHeadlineEn}
            onBnChange={setCtaHeadlineBn}
            hint="Main call-to-action heading"
            required
          />

          <BilingualField
            label="CTA Body Text"
            enValue={ctaBodyEn}
            bnValue={ctaBodyBn}
            onEnChange={setCtaBodyEn}
            onBnChange={setCtaBodyBn}
            type="textarea"
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

  const buttonGroupStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1.5rem',
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
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Home Page Editor</h1>

      <div style={sectionStyle}>
        <div style={titleStyle}>Hero Section</div>
        
        <BilingualField
          label="Eyebrow Label"
          enValue={hero.eyebrow?.en}
          bnValue={hero.eyebrow?.bn}
          onEnChange={(val) => setHero({ ...hero, eyebrow: { ...hero.eyebrow, en: val } })}
          onBnChange={(val) => setHero({ ...hero, eyebrow: { ...hero.eyebrow, bn: val } })}
        />

        <BilingualField
          label="Headline"
          enValue={hero.headline?.en}
          bnValue={hero.headline?.bn}
          onEnChange={(val) => setHero({ ...hero, headline: { ...hero.headline, en: val } })}
          onBnChange={(val) => setHero({ ...hero, headline: { ...hero.headline, bn: val } })}
          required
        />

        <BilingualField
          label="Intro Paragraph"
          enValue={hero.intro?.en}
          bnValue={hero.intro?.bn}
          onEnChange={(val) => setHero({ ...hero, intro: { ...hero.intro, en: val } })}
          onBnChange={(val) => setHero({ ...hero, intro: { ...hero.intro, bn: val } })}
          type="textarea"
        />

        <div style={buttonGroupStyle}>
          <button
            onClick={() => saveContent('hero', hero)}
            disabled={saving}
            style={buttonStyle}
          >
            {saving ? 'Saving...' : 'Save Hero Section'}
          </button>
        </div>
        {message && <div style={messageStyle}>{message}</div>}
      </div>

      <div style={sectionStyle}>
        <div style={titleStyle}>Donation CTA</div>
        
        <BilingualField
          label="CTA Headline"
          enValue={cta.headline?.en}
          bnValue={cta.headline?.bn}
          onEnChange={(val) => setCta({ ...cta, headline: { ...cta.headline, en: val } })}
          onBnChange={(val) => setCta({ ...cta, headline: { ...cta.headline, bn: val } })}
        />

        <BilingualField
          label="CTA Body"
          enValue={cta.body?.en}
          bnValue={cta.body?.bn}
          onEnChange={(val) => setCta({ ...cta, body: { ...cta.body, en: val } })}
          onBnChange={(val) => setCta({ ...cta, body: { ...cta.body, bn: val } })}
          type="textarea"
        />

        <div style={buttonGroupStyle}>
          <button
            onClick={() => saveContent('cta', cta)}
            disabled={saving}
            style={buttonStyle}
          >
            {saving ? 'Saving...' : 'Save CTA'}
          </button>
        </div>
        {message && <div style={messageStyle}>{message}</div>}
      </div>
    </div>
  )
}
