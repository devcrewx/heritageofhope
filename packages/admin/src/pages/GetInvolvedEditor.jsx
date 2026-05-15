import { useEffect, useState } from 'react'
import BilingualField from '../components/BilingualField'
import { useApi } from '../hooks/useApi'

const tabDefinitions = [
  { key: 'tiers', label: 'Donation Tiers' },
  { key: 'bank', label: 'Bank Details' },
  { key: 'volunteer', label: 'Volunteer Section' },
  { key: 'partner', label: 'Partner Section' },
]

export default function GetInvolvedEditor() {
  const { request } = useApi()
  const [data, setData] = useState({})
  const [donationTiers, setDonationTiers] = useState([])
  const [volunteerRoles, setVolunteerRoles] = useState([])
  const [newTier, setNewTier] = useState({ amount: '', labelEn: '', labelBn: '' })
  const [newRole, setNewRole] = useState({ titleEn: '', titleBn: '', descriptionEn: '', descriptionBn: '' })
  const [activeTab, setActiveTab] = useState('tiers')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const [contentResponse, tiersResponse, rolesResponse] = await Promise.all([
        request('/api/admin/content/getInvolved'),
        request('/api/admin/donation-tiers'),
        request('/api/admin/volunteer-roles'),
      ])

      if (contentResponse.success) {
        setData(contentResponse.sections || {})
      }

      setDonationTiers(tiersResponse.items || [])
      setVolunteerRoles(rolesResponse.items || [])
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

  const updateTier = (id, field, value) => {
    setDonationTiers(donationTiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier)))
  }

  const updateRole = (id, field, value) => {
    setVolunteerRoles(volunteerRoles.map((role) => (role.id === id ? { ...role, [field]: value } : role)))
  }

  const saveSection = async (section) => {
    setSaving(true)
    try {
      const updates = data[section] || {}
      await Promise.all(
        Object.entries(updates).map(([fieldKey, values]) =>
          request(`/api/admin/content/getInvolved/${section}/${fieldKey}`, {
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

  const saveDonationTiers = async () => {
    setSaving(true)
    try {
      await Promise.all(
        donationTiers.map((tier) =>
          request(`/api/admin/donation-tiers/${tier.id}`, {
            method: 'PATCH',
            body: JSON.stringify(tier),
          })
        )
      )
      setMessage('✓ Donation tiers saved successfully')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const addDonationTier = async () => {
    if (!newTier.amount || !newTier.labelEn) {
      setMessage('✗ Amount and English label are required')
      return
    }

    setSaving(true)
    try {
      await request('/api/admin/donation-tiers', {
        method: 'POST',
        body: JSON.stringify(newTier),
      })
      setNewTier({ amount: '', labelEn: '', labelBn: '' })
      await loadContent()
      setMessage('✓ Donation tier added')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const deleteDonationTier = async (id) => {
    if (!window.confirm('Delete this donation tier?')) {
      return
    }

    setSaving(true)
    try {
      await request(`/api/admin/donation-tiers/${id}`, { method: 'DELETE' })
      await loadContent()
      setMessage('✓ Donation tier deleted')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const saveVolunteerRoles = async () => {
    setSaving(true)
    try {
      await Promise.all(
        volunteerRoles.map((role) =>
          request(`/api/admin/volunteer-roles/${role.id}`, {
            method: 'PATCH',
            body: JSON.stringify(role),
          })
        )
      )
      setMessage('✓ Volunteer roles saved successfully')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const addVolunteerRole = async () => {
    if (!newRole.titleEn) {
      setMessage('✗ English title is required')
      return
    }

    setSaving(true)
    try {
      await request('/api/admin/volunteer-roles', {
        method: 'POST',
        body: JSON.stringify(newRole),
      })
      setNewRole({ titleEn: '', titleBn: '', descriptionEn: '', descriptionBn: '' })
      await loadContent()
      setMessage('✓ Volunteer role added')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const deleteVolunteerRole = async (id) => {
    if (!window.confirm('Delete this volunteer role?')) {
      return
    }

    setSaving(true)
    try {
      await request(`/api/admin/volunteer-roles/${id}`, { method: 'DELETE' })
      await loadContent()
      setMessage('✓ Volunteer role deleted')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const styles = {
    container: { maxWidth: '1020px' },
    section: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' },
    title: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' },
    button: { padding: '0.6rem 1.25rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600, marginTop: '1.25rem' },
    tab: { padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '999px', cursor: 'pointer', fontWeight: 600, fontSize: '0.92rem', background: '#fff' },
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
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Get Involved Page Editor</h1>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {tabDefinitions.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...styles.tab,
              background: activeTab === tab.key ? '#0f172a' : '#fff',
              color: activeTab === tab.key ? '#fff' : '#0f172a',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'tiers' && (
        <div style={styles.section}>
          <div style={styles.title}>Donation Tiers</div>
          <p style={{ color: '#475569', marginBottom: '1rem' }}>These rows drive the public donation ladder.</p>

          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {donationTiers.map((tier, index) => (
              <div key={tier.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr auto', gap: '0.75rem', alignItems: 'start' }}>
                  <input
                    type="number"
                    value={tier.amount ?? ''}
                    onChange={(event) => updateTier(tier.id, 'amount', event.target.value)}
                    placeholder="500"
                    style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <input
                    value={tier.labelEn || ''}
                    onChange={(event) => updateTier(tier.id, 'labelEn', event.target.value)}
                    placeholder="feeds a family"
                    style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <input
                    value={tier.labelBn || ''}
                    onChange={(event) => updateTier(tier.id, 'labelBn', event.target.value)}
                    placeholder="একটি পরিবারকে খাবার"
                    style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <button type="button" onClick={() => deleteDonationTier(tier.id)} disabled={saving} style={{ ...styles.button, marginTop: 0, background: '#b91c1c' }}>
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
            <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Add Tier</div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr auto', gap: '0.75rem' }}>
              <input
                value={newTier.amount}
                onChange={(event) => setNewTier({ ...newTier, amount: event.target.value })}
                type="number"
                placeholder="250"
                style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
              />
              <input
                value={newTier.labelEn}
                onChange={(event) => setNewTier({ ...newTier, labelEn: event.target.value })}
                placeholder="supports a child"
                style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
              />
              <input
                value={newTier.labelBn}
                onChange={(event) => setNewTier({ ...newTier, labelBn: event.target.value })}
                placeholder="একটি শিশুকে সহায়তা"
                style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
              />
              <button type="button" onClick={addDonationTier} disabled={saving} style={{ ...styles.button, marginTop: 0 }}>
                Add
              </button>
            </div>
            <button onClick={saveDonationTiers} disabled={saving} style={styles.button}>
              {saving ? 'Saving...' : 'Save Tiers'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'bank' && (
        <div style={styles.section}>
          <div style={styles.title}>Bank Details</div>
          <BilingualField
            label="Account Name"
            enValue={data.bank?.accountName?.en}
            bnValue={data.bank?.accountName?.bn}
            onEnChange={(val) => updateField('bank', 'accountName', 'en', val)}
            onBnChange={(val) => updateField('bank', 'accountName', 'bn', val)}
          />
          <BilingualField
            label="Bank & Branch"
            enValue={data.bank?.bankName?.en}
            bnValue={data.bank?.bankName?.bn}
            onEnChange={(val) => updateField('bank', 'bankName', 'en', val)}
            onBnChange={(val) => updateField('bank', 'bankName', 'bn', val)}
          />
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.75rem', marginBottom: '0.75rem' }}>Account Number (English only)</p>
          <input
            type="text"
            value={data.bank?.accountNumber?.en || ''}
            onChange={(event) => updateField('bank', 'accountNumber', 'en', event.target.value)}
            placeholder="43107075580"
            style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem', width: '100%', marginBottom: '1rem' }}
          />
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.75rem', marginBottom: '0.75rem' }}>IFSC Code (English only)</p>
          <input
            type="text"
            value={data.bank?.ifsc?.en || ''}
            onChange={(event) => updateField('bank', 'ifsc', 'en', event.target.value)}
            placeholder="SBIN0008438"
            style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem', width: '100%', marginBottom: '1rem' }}
          />
          <button onClick={() => saveSection('bank')} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Bank Details'}
          </button>
        </div>
      )}

      {activeTab === 'volunteer' && (
        <div style={styles.section}>
          <div style={styles.title}>Volunteer Section</div>
          <BilingualField
            label="Section Heading"
            enValue={data.volunteer?.heading?.en}
            bnValue={data.volunteer?.heading?.bn}
            onEnChange={(val) => updateField('volunteer', 'heading', 'en', val)}
            onBnChange={(val) => updateField('volunteer', 'heading', 'bn', val)}
          />
          <BilingualField
            label="Section Description"
            enValue={data.volunteer?.description?.en}
            bnValue={data.volunteer?.description?.bn}
            onEnChange={(val) => updateField('volunteer', 'description', 'en', val)}
            onBnChange={(val) => updateField('volunteer', 'description', 'bn', val)}
            type="textarea"
          />
          <button onClick={() => saveSection('volunteer')} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Volunteer Section'}
          </button>

          <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>Volunteer Roles</div>
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {volunteerRoles.map((role, index) => (
                <div key={role.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                  <BilingualField
                    label="Role Title"
                    enValue={role.titleEn}
                    bnValue={role.titleBn}
                    onEnChange={(val) => updateRole(role.id, 'titleEn', val)}
                    onBnChange={(val) => updateRole(role.id, 'titleBn', val)}
                  />
                  <BilingualField
                    label="Role Description"
                    enValue={role.descriptionEn}
                    bnValue={role.descriptionBn}
                    onEnChange={(val) => updateRole(role.id, 'descriptionEn', val)}
                    onBnChange={(val) => updateRole(role.id, 'descriptionBn', val)}
                    type="textarea"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '120px auto', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      value={role.sortOrder ?? 0}
                      onChange={(event) => updateRole(role.id, 'sortOrder', Number(event.target.value))}
                      style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                    />
                    <button type="button" onClick={() => deleteVolunteerRole(role.id)} disabled={saving} style={{ ...styles.button, marginTop: 0, background: '#b91c1c', width: 'fit-content' }}>
                      Delete
                    </button>
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Role {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Add Role</div>
              <BilingualField
                label="Role Title"
                enValue={newRole.titleEn}
                bnValue={newRole.titleBn}
                onEnChange={(val) => setNewRole({ ...newRole, titleEn: val })}
                onBnChange={(val) => setNewRole({ ...newRole, titleBn: val })}
              />
              <BilingualField
                label="Role Description"
                enValue={newRole.descriptionEn}
                bnValue={newRole.descriptionBn}
                onEnChange={(val) => setNewRole({ ...newRole, descriptionEn: val })}
                onBnChange={(val) => setNewRole({ ...newRole, descriptionBn: val })}
                type="textarea"
              />
              <button type="button" onClick={addVolunteerRole} disabled={saving} style={styles.button}>
                Add Role
              </button>
              <button onClick={saveVolunteerRoles} disabled={saving} style={styles.button}>
                {saving ? 'Saving...' : 'Save Volunteer Roles'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'partner' && (
        <div style={styles.section}>
          <div style={styles.title}>Partner Section</div>
          <BilingualField
            label="Partner Heading"
            enValue={data.partner?.heading?.en}
            bnValue={data.partner?.heading?.bn}
            onEnChange={(val) => updateField('partner', 'heading', 'en', val)}
            onBnChange={(val) => updateField('partner', 'heading', 'bn', val)}
          />
          <BilingualField
            label="Partner Description"
            enValue={data.partner?.description?.en}
            bnValue={data.partner?.description?.bn}
            onEnChange={(val) => updateField('partner', 'description', 'en', val)}
            onBnChange={(val) => updateField('partner', 'description', 'bn', val)}
            type="textarea"
          />
          <button onClick={() => saveSection('partner')} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Partner Section'}
          </button>
        </div>
      )}

      {message && <div style={messageStyle}>{message}</div>}
    </div>
  )
}
