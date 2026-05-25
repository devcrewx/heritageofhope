import { useState, useEffect, useRef, useContext } from 'react'
import BilingualField from '../components/BilingualField'
import { useApi } from '../hooks/useApi'
import SplitLayout from '../components/SplitLayout'
import { usePreviewSync } from '../hooks/usePreviewSync'
import { SiteContentContext } from '../App'

export default function ImpactEditor() {
  const iframeRef = useRef(null)
  const fullContent = useContext(SiteContentContext)
  const { request } = useApi()
  const [data, setData] = useState({})
  const [stats, setStats] = useState([])
  const [allocation, setAllocation] = useState([])
  const [newStat, setNewStat] = useState({ value: '', labelEn: '', labelBn: '' })
  const [newAllocation, setNewAllocation] = useState({ categoryEn: '', categoryBn: '', percentage: 0, sortOrder: 0 })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeSection, setActiveSection] = useState('stats')

  const loadContent = async () => {
    try {
      const [contentResponse, statsResponse, allocationResponse] = await Promise.all([
        request('/api/admin/content/impact'),
        request('/api/admin/stats'),
        request('/api/admin/fund-allocation'),
      ])

      if (contentResponse.success) {
        setData(contentResponse.sections || {})
      }
      if (statsResponse.success !== false) {
        setStats(Array.isArray(statsResponse) ? statsResponse : statsResponse.data || [])
      }
      if (allocationResponse.success !== false) {
        setAllocation(Array.isArray(allocationResponse) ? allocationResponse : allocationResponse.items || allocationResponse.data || [])
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    }
  }

  useEffect(() => {
    loadContent()
  }, [])

  const updateField = (section, fieldKey, lang, value) => {
    setData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [fieldKey]: { ...current[section]?.[fieldKey], [lang]: value },
      },
    }))
  }

  const updateAllocation = (id, field, value) => {
    setAllocation((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const saveSection = async (section) => {
    setSaving(true)
    try {
      const updates = data[section] || {}
      await Promise.all(
        Object.entries(updates).map(([fieldKey, values]) =>
          request(`/api/admin/content/impact/${section}/${fieldKey}`, {
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

  const saveStats = async () => {
    setSaving(true)
    try {
      const next = [...stats]
      await Promise.all(
        next.map((stat) =>
          request(`/api/admin/stats/${stat.id}`, {
            method: 'PATCH',
            body: JSON.stringify(stat),
          })
        )
      )
      setMessage('✓ Stats saved successfully')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const addStat = async () => {
    if (!newStat.value || !newStat.labelEn) {
      setMessage('✗ Value and English label are required')
      return
    }

    setSaving(true)
    try {
      await request('/api/admin/stats', {
        method: 'POST',
        body: JSON.stringify(newStat),
      })
      setNewStat({ value: '', labelEn: '', labelBn: '' })
      await loadContent()
      setMessage('✓ Stat added')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const deleteStat = async (id) => {
    if (!window.confirm('Delete this stat?')) return

    setSaving(true)
    try {
      await request(`/api/admin/stats/${id}`, { method: 'DELETE' })
      await loadContent()
      setMessage('✓ Stat deleted')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const saveAllocation = async () => {
    const total = allocation.reduce((sum, item) => sum + Number(item.percentage || 0), 0)
    if (total !== 100) {
      setMessage(`✗ Allocation must total 100%, currently ${total}%`)
      return
    }

    setSaving(true)
    try {
      await request('/api/admin/fund-allocation/batch', {
        method: 'PATCH',
        body: JSON.stringify({ items: allocation }),
      })
      setMessage('✓ Allocation saved successfully')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const addAllocation = async () => {
    if (!newAllocation.categoryEn) {
      setMessage('✗ English category name is required')
      return
    }
    setSaving(true)
    try {
      await request('/api/admin/fund-allocation', {
        method: 'POST',
        body: JSON.stringify(newAllocation),
      })
      setNewAllocation({ categoryEn: '', categoryBn: '', percentage: 0, sortOrder: 0 })
      await loadContent()
      setMessage('✓ Allocation added')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const deleteAllocation = async (id) => {
    if (!window.confirm('Delete this allocation?')) return
    setSaving(true)
    try {
      await request(`/api/admin/fund-allocation/${id}`, { method: 'DELETE' })
      await loadContent()
      setMessage('✓ Allocation deleted')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const totalAllocation = allocation.reduce((sum, item) => sum + Number(item.percentage || 0), 0)

  const draft = {
    hero: {
      pageTitle: data.intro?.title || { en: '', bn: '' },
      subHeadline: data.intro?.paragraph || { en: '', bn: '' },
      promise: data.hero?.promise || { en: '', bn: '' },
    },
    testimonial: {
      quote: data.feedback?.quote || { en: '', bn: '' },
    },
    annualReport: {
      body: data.report?.status || { en: '', bn: '' },
    },
    pageContent: data.pageContent || {},
    impactMetrics: stats.map(s => ({
      value: String(s.value || ''),
      label: { en: s.labelEn, bn: s.labelBn || '' },
    })),
    fundAllocation: allocation.map(a => ({
      category: { en: a.categoryEn, bn: a.categoryBn || '' },
      percentage: a.percentage,
    })),
  }
  usePreviewSync(iframeRef, draft, 'impact', fullContent)

  const styles = {
    container: { maxWidth: '980px' },
    section: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' },
    title: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' },
    button: { padding: '0.6rem 1.25rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600, marginTop: '1.25rem' },
    message: { marginTop: '1rem', padding: '0.75rem', borderRadius: '0.4rem', fontSize: '0.9rem' },
    tab: { padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '999px', cursor: 'pointer', fontWeight: 600, fontSize: '0.92rem', background: '#fff' },
  }

  const messageStyle = {
    ...styles.message,
    background: message.includes('✗') ? '#fee2e2' : '#dbeafe',
    color: message.includes('✗') ? '#991b1b' : '#0c4a6e',
  }

  return (
    <SplitLayout previewPage="/impact" iframeRef={iframeRef}>
    <div style={styles.container}>
      <h1 style={{ marginBottom: '0.75rem', fontSize: '1.8rem' }}>Impact Page Editor</h1>
      <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
        Update the shared impact stats, fund allocation, testimonial, and annual report.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[
          { key: 'hero', label: 'Page Hero' },
          { key: 'stats', label: 'Impact Stats' },
          { key: 'allocation', label: 'Fund Allocation' },
          { key: 'feedback', label: 'Community Feedback' },
          { key: 'report', label: 'Annual Report' },
          { key: 'pageContent', label: 'Page Labels' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveSection(tab.key)}
            style={{
              ...styles.tab,
              background: activeSection === tab.key ? '#0f172a' : '#fff',
              color: activeSection === tab.key ? '#fff' : '#0f172a',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSection === 'hero' && (
        <div style={styles.section}>
          <div style={styles.title}>Page Hero</div>
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
            labelEn="Sub-headline"
            labelBn="Sub-headline (Bangla)"
            valueEn={data.intro?.paragraph?.en}
            valueBn={data.intro?.paragraph?.bn}
            onChangeEn={(val) => updateField('intro', 'paragraph', 'en', val)}
            onChangeBn={(val) => updateField('intro', 'paragraph', 'bn', val)}
            isTextArea
          />
          <BilingualField
            labelEn="Hero Promise"
            labelBn="Hero Promise (Bangla)"
            valueEn={data.hero?.promise?.en}
            valueBn={data.hero?.promise?.bn}
            onChangeEn={(val) => updateField('hero', 'promise', 'en', val)}
            onChangeBn={(val) => updateField('hero', 'promise', 'bn', val)}
            isTextArea
          />
          <button onClick={async () => { await Promise.all([saveSection('intro'), saveSection('hero')]); }} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Page Hero'}
          </button>
        </div>
      )}

      {activeSection === 'stats' && (
        <div style={styles.section}>
          <div style={styles.title}>Shared Impact Stats</div>
          <p style={{ color: '#475569', marginBottom: '1rem' }}>These stats also appear on the Home page.</p>

          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {stats.map((stat, index) => (
              <div key={stat.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    value={stat.value}
                    onChange={(e) => setStats((current) => current.map((item) => item.id === stat.id ? { ...item, value: e.target.value } : item))}
                    placeholder="200+"
                    style={{ flex: '1 1 100px', minWidth: '80px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <input
                    value={stat.labelEn || ''}
                    onChange={(e) => setStats((current) => current.map((item) => item.id === stat.id ? { ...item, labelEn: e.target.value } : item))}
                    placeholder="children supported"
                    style={{ flex: '2 1 140px', minWidth: '100px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <input
                    value={stat.labelBn || ''}
                    onChange={(e) => setStats((current) => current.map((item) => item.id === stat.id ? { ...item, labelBn: e.target.value } : item))}
                    placeholder="সাহায্যপ্রাপ্ত শিশু"
                    style={{ flex: '2 1 140px', minWidth: '100px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => deleteStat(stat.id)}
                    disabled={saving}
                    style={{ flex: '0 0 auto', padding: '0.6rem 1.25rem', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Delete
                  </button>
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Row {index + 1}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Add Stat</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <input value={newStat.value} onChange={(e) => setNewStat({ ...newStat, value: e.target.value })} placeholder="15+" style={{ flex: '1 1 100px', minWidth: '80px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
              <input value={newStat.labelEn} onChange={(e) => setNewStat({ ...newStat, labelEn: e.target.value })} placeholder="projects completed" style={{ flex: '2 1 140px', minWidth: '100px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
              <input value={newStat.labelBn} onChange={(e) => setNewStat({ ...newStat, labelBn: e.target.value })} placeholder="সম্পন্ন প্রকল্প" style={{ flex: '2 1 140px', minWidth: '100px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
              <button type="button" onClick={addStat} disabled={saving} style={{ flex: '0 0 auto', padding: '0.6rem 1.25rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>Add</button>
            </div>
            <button onClick={saveStats} disabled={saving} style={styles.button}>
              {saving ? 'Saving...' : 'Save Stats'}
            </button>
          </div>
        </div>
      )}

      {activeSection === 'allocation' && (
        <div style={styles.section}>
          <div style={styles.title}>Fund Allocation</div>
          <p style={{ color: totalAllocation === 100 ? '#166534' : '#b45309', marginBottom: '1rem', fontWeight: 600 }}>
            Total: {totalAllocation}% {totalAllocation === 100 ? ' - valid' : ' - must equal 100%'}
          </p>

          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {allocation.map((item) => (
              <div key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  <input value={item.categoryEn || ''} onChange={(e) => updateAllocation(item.id, 'categoryEn', e.target.value)} placeholder="Education" style={{ flex: '2 1 140px', minWidth: '120px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
                  <input value={item.categoryBn || ''} onChange={(e) => updateAllocation(item.id, 'categoryBn', e.target.value)} placeholder="শিক্ষা" style={{ flex: '2 1 140px', minWidth: '120px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
                  <input value={item.percentage} type="number" min="0" max="100" onChange={(e) => updateAllocation(item.id, 'percentage', Number(e.target.value))} placeholder="25" style={{ flex: '1 1 80px', minWidth: '60px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
                  <input value={item.sortOrder ?? 0} type="number" onChange={(e) => updateAllocation(item.id, 'sortOrder', Number(e.target.value))} style={{ flex: '1 1 60px', minWidth: '50px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
                  <button type="button" onClick={() => deleteAllocation(item.id)} disabled={saving} style={{ flex: '0 0 auto', padding: '0.5rem 0.8rem', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={saveAllocation} disabled={saving || totalAllocation !== 100} style={{ ...styles.button, opacity: totalAllocation === 100 ? 1 : 0.5 }}>
            {saving ? 'Saving...' : 'Save Allocation'}
          </button>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Add Allocation</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <input value={newAllocation.categoryEn} onChange={(e) => setNewAllocation({ ...newAllocation, categoryEn: e.target.value })} placeholder="Education" style={{ flex: '2 1 140px', minWidth: '120px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
              <input value={newAllocation.categoryBn} onChange={(e) => setNewAllocation({ ...newAllocation, categoryBn: e.target.value })} placeholder="শিক্ষা" style={{ flex: '2 1 140px', minWidth: '120px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
              <input value={newAllocation.percentage} type="number" min="0" max="100" onChange={(e) => setNewAllocation({ ...newAllocation, percentage: Number(e.target.value) })} placeholder="25" style={{ flex: '1 1 80px', minWidth: '60px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
              <input value={newAllocation.sortOrder} type="number" onChange={(e) => setNewAllocation({ ...newAllocation, sortOrder: Number(e.target.value) })} placeholder="Sort" style={{ flex: '1 1 60px', minWidth: '50px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
              <button type="button" onClick={addAllocation} disabled={saving} style={{ flex: '0 0 auto', padding: '0.6rem 1.25rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>Add</button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'feedback' && (
        <div style={styles.section}>
          <div style={styles.title}>Community Feedback</div>
          <BilingualField
            labelEn="Testimonial Quote"
            labelBn="Testimonial Quote (Bangla)"
            valueEn={data.feedback?.quote?.en}
            valueBn={data.feedback?.quote?.bn}
            onChangeEn={(val) => updateField('feedback', 'quote', 'en', val)}
            onChangeBn={(val) => updateField('feedback', 'quote', 'bn', val)}
            isTextArea
          />
          <button onClick={() => saveSection('feedback')} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Feedback'}
          </button>
        </div>
      )}

      {activeSection === 'report' && (
        <div style={styles.section}>
          <div style={styles.title}>Annual Report</div>
          <BilingualField
            labelEn="Annual Report Body"
            labelBn="Annual Report Body (Bangla)"
            valueEn={data.report?.status?.en}
            valueBn={data.report?.status?.bn}
            onChangeEn={(val) => updateField('report', 'status', 'en', val)}
            onChangeBn={(val) => updateField('report', 'status', 'bn', val)}
            isTextArea
          />
          <button onClick={() => saveSection('report')} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Report'}
          </button>
        </div>
      )}

      {activeSection === 'pageContent' && (
        <div style={styles.section}>
          <div style={styles.title}>Page Labels</div>
          <BilingualField labelEn="Page Eyebrow" labelBn="Page Eyebrow (Bangla)" valueEn={data.pageContent?.eyebrow?.en} valueBn={data.pageContent?.eyebrow?.bn} onChangeEn={(val) => updateField('pageContent', 'eyebrow', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'eyebrow', 'bn', val)} />
          <BilingualField labelEn="Promise Label" labelBn="Promise Label (Bangla)" valueEn={data.pageContent?.promiseLabel?.en} valueBn={data.pageContent?.promiseLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'promiseLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'promiseLabel', 'bn', val)} />
          <BilingualField labelEn="Fund Section Eyebrow" labelBn="Fund Section Eyebrow (Bangla)" valueEn={data.pageContent?.fundLabel?.en} valueBn={data.pageContent?.fundLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'fundLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'fundLabel', 'bn', val)} />
          <BilingualField labelEn="Fund Section Heading" labelBn="Fund Section Heading (Bangla)" valueEn={data.pageContent?.fundHeading?.en} valueBn={data.pageContent?.fundHeading?.bn} onChangeEn={(val) => updateField('pageContent', 'fundHeading', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'fundHeading', 'bn', val)} />
          <BilingualField labelEn="Feedback Label" labelBn="Feedback Label (Bangla)" valueEn={data.pageContent?.feedbackLabel?.en} valueBn={data.pageContent?.feedbackLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'feedbackLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'feedbackLabel', 'bn', val)} />
          <BilingualField labelEn="Report Label" labelBn="Report Label (Bangla)" valueEn={data.pageContent?.reportLabel?.en} valueBn={data.pageContent?.reportLabel?.bn} onChangeEn={(val) => updateField('pageContent', 'reportLabel', 'en', val)} onChangeBn={(val) => updateField('pageContent', 'reportLabel', 'bn', val)} />
          <button onClick={() => saveSection('pageContent')} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Page Labels'}
          </button>
        </div>
      )}

      {message && <div style={messageStyle}>{message}</div>}
    </div>
    </SplitLayout>
  )
}
