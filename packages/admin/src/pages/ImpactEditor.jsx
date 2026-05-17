import { useState, useEffect } from 'react'
import BilingualField from '../components/BilingualField'
import { useApi } from '../hooks/useApi'
import { ConfirmDialog } from '../components/ConfirmDialog'

export default function ImpactEditor() {
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
  const { request } = useApi()
  const [data, setData] = useState({})
  const [stats, setStats] = useState([])
  const [allocation, setAllocation] = useState([])
  const [newStat, setNewStat] = useState({ value: '', labelEn: '', labelBn: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeSection, setActiveSection] = useState('stats')
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

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
      setError(error.message)
    } finally {
      setInitialLoading(false)

  const updateField = (section, fieldKey, lang, value) => {
    setData({
      ...data,
      [section]: {
    setError('')
    setStatusMessage('')
        ...data[section],
        [fieldKey]: { ...data[section]?.[fieldKey], [lang]: value },
      },
    })
  }

  const updateAllocation = (id, field, value) => {
    setAllocation(
      allocation.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      setStatusMessage('Saved successfully')
  }
      setError(error.message)
  const saveSection = async (section) => {
    setSaving(true)
    try {
      const updates = data[section] || {}
      await Promise.all(
        Object.entries(updates).map(([fieldKey, values]) =>
          request(`/api/admin/content/impact/${section}/${fieldKey}`, {
    setError('')
    setStatusMessage('')
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
      setStatusMessage('Stats saved successfully')
  }
      setError(error.message)
  const saveStats = async () => {
    setSaving(true)
    try {
      const next = [...stats]
      await Promise.all(
        next.map((stat) =>
          request(`/api/admin/stats/${stat.id}`, {
      setError('Value and English label are required')
            body: JSON.stringify(stat),
          })
        )
      )
    setError('')
    setStatusMessage('')
      setMessage('✓ Stats saved successfully')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
      setStatusMessage('Stat added')
  const addStat = async () => {
      setError(error.message)
      setMessage('✗ Value and English label are required')
      return
    }

    setSaving(true)
    try {
      await request('/api/admin/stats', {
        method: 'POST',
        body: JSON.stringify(newStat),
      })
    setError('')
    setStatusMessage('')
      setNewStat({ value: '', labelEn: '', labelBn: '' })
      await loadContent()
      setMessage('✓ Stat added')
      setTimeout(() => setMessage(''), 2000)
      setStatusMessage('Stat deleted')
    } finally {
      setError(error.message)
    }
  }

  const confirmDeleteStat = (statId) => {
    setDeleteConfirm({ isOpen: true, statId })
  }

  const deleteStat = async () => {
      setError(`Allocation must total 100%, currently ${total}%`)
    if (!statId) return

    setSaving(true)
    try {
    setError('')
    setStatusMessage('')
      await request(`/api/admin/stats/${statId}`, { method: 'DELETE' })
      await loadContent()
      setDeleteConfirm({ isOpen: false, statId: null })
      setMessage('✓ Stat deleted')
      setTimeout(() => setMessage(''), 2000)
      setStatusMessage('Allocation saved successfully')
    } finally {
      setError(error.message)
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

  const totalAllocation = allocation.reduce((sum, item) => sum + Number(item.percentage || 0), 0)

      {initialLoading ? (
        <LoadingSpinner fullPage text="Loading impact content..." />
      ) : (
        <>
          {error && <ErrorMessage error={error} onClose={() => setError('')} className="mb-4" />}

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
    <div style={styles.container}>
      <h1 style={{ marginBottom: '0.75rem', fontSize: '1.8rem' }}>Impact Page Editor</h1>
      <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
        Update the shared impact stats, fund allocation, testimonial, and annual report.
      </p>

          {statusMessage && <div style={successStyle}>{statusMessage}</div>}
        </>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[
          { key: 'stats', label: 'Impact Stats' },
          { key: 'allocation', label: 'Fund Allocation' },
          { key: 'feedback', label: 'Community Feedback' },
          { key: 'report', label: 'Annual Report' },
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

      {activeSection === 'stats' && (
        <div style={styles.section}>
          <div style={styles.title}>Shared Impact Stats</div>
          <p style={{ color: '#475569', marginBottom: '1rem' }}>These stats also appear on the Home page.</p>

          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {stats.map((stat, index) => (
              <div key={stat.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr auto', gap: '0.75rem', alignItems: 'start' }}>
                  <input
                    value={stat.value}
                    onChange={(e) => setStats(stats.map((item) => item.id === stat.id ? { ...item, value: e.target.value } : item))}
                    placeholder="200+"
                    style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <input
                    value={stat.labelEn || ''}
                    onChange={(e) => setStats(stats.map((item) => item.id === stat.id ? { ...item, labelEn: e.target.value } : item))}
                    placeholder="children supported"
                    style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <input
                    value={stat.labelBn || ''}
                    onChange={(e) => setStats(stats.map((item) => item.id === stat.id ? { ...item, labelBn: e.target.value } : item))}
                    placeholder="সাহায্যপ্রাপ্ত শিশু"
                    style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => confirmDeleteStat(stat.id)}
                    disabled={saving}
                    style={{ ...styles.button, marginTop: 0, background: '#b91c1c' }}
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
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr auto', gap: '0.75rem' }}>
              <input value={newStat.value} onChange={(e) => setNewStat({ ...newStat, value: e.target.value })} placeholder="15+" style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
              <input value={newStat.labelEn} onChange={(e) => setNewStat({ ...newStat, labelEn: e.target.value })} placeholder="projects completed" style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
              <input value={newStat.labelBn} onChange={(e) => setNewStat({ ...newStat, labelBn: e.target.value })} placeholder="সম্পন্ন প্রকল্প" style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
              <button type="button" onClick={addStat} disabled={saving} style={{ ...styles.button, marginTop: 0 }}>Add</button>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px auto', gap: '0.75rem', alignItems: 'start' }}>
                  <input value={item.categoryEn || ''} onChange={(e) => updateAllocation(item.id, 'categoryEn', e.target.value)} placeholder="Education" style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
                  <input value={item.categoryBn || ''} onChange={(e) => updateAllocation(item.id, 'categoryBn', e.target.value)} placeholder="শিক্ষা" style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
                  <input value={item.percentage} type="number" min="0" max="100" onChange={(e) => updateAllocation(item.id, 'percentage', Number(e.target.value))} placeholder="25" style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
                  <input value={item.sortOrder ?? 0} type="number" onChange={(e) => updateAllocation(item.id, 'sortOrder', Number(e.target.value))} style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }} />
                </div>
              </div>
            ))}
          </div>

          <button onClick={saveAllocation} disabled={saving || totalAllocation !== 100} style={{ ...styles.button, opacity: totalAllocation === 100 ? 1 : 0.5 }}>
            {saving ? 'Saving...' : 'Save Allocation'}
          </button>
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
            labelEn="Report Status"
            labelBn="Report Status (Bangla)"
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

      {message && <div style={messageStyle}>{message}</div>}
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
  )
}
