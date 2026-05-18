import { useEffect, useState } from 'react'
import BilingualField from '../components/BilingualField'
import MediaUploadField from '../components/MediaUploadField'
import apiClient from '../lib/api'
import { useApi } from '../hooks/useApi'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

const tabDefinitions = [
  { key: 'tiers', label: 'Donation Tiers' },
  { key: 'bank', label: 'Bank Details' },
  { key: 'payment', label: 'UPI / Payment' },
  { key: 'volunteer', label: 'Volunteer Section' },
  { key: 'partner', label: 'Partner Section' },
  { key: 'labels', label: 'Page Labels' },
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
  const [heroUploading, setHeroUploading] = useState(false)
  const [paymentUploading, setPaymentUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null, kind: '' })

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
      setError(error.message)
    } finally {
      setInitialLoading(false)
    }
  }

  const heroImageUrl = data.hero?.heroImage?.en || ''
  const upiQrImageUrl = data.payment?.upiQrImage?.en || ''

  const uploadHeroImage = async (file) => {
    setHeroUploading(true)
    setError('')
    setStatusMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('page', 'getInvolved')
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

      setStatusMessage('Partnership photo updated')
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
      await apiClient.delete('/api/admin/media/hero/getInvolved/hero')
      setData((current) => ({
        ...current,
        hero: {
          ...current.hero,
          heroImage: { en: '', bn: '' },
        },
      }))
      setStatusMessage('Partnership photo removed')
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setHeroUploading(false)
    }
  }

  const uploadUpiQrImage = async (file) => {
    setPaymentUploading(true)
    setError('')
    setStatusMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('page', 'getInvolved')
      formData.append('section', 'payment')

      const response = await apiClient.post('/api/admin/media/upi-qr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data?.data?.url) {
        setData((current) => ({
          ...current,
          payment: {
            ...current.payment,
            upiQrImage: {
              en: response.data.data.url,
              bn: response.data.data.publicId || response.data.data.url,
            },
          },
        }))
      }

      setStatusMessage('UPI QR image updated')
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setPaymentUploading(false)
    }
  }

  const deleteUpiQrImage = async () => {
    setPaymentUploading(true)
    setError('')
    setStatusMessage('')

    try {
      await apiClient.delete('/api/admin/media/upi-qr')
      setData((current) => ({
        ...current,
        payment: {
          ...current.payment,
          upiQrImage: { en: '', bn: '' },
        },
      }))
      setStatusMessage('UPI QR image removed')
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setPaymentUploading(false)
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
    setError('')
    setStatusMessage('')
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
      setStatusMessage('Saved successfully')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const pageLabelFields = [
    { fieldKey: 'donationLabel', labelEn: 'Donation Section Label', labelBn: 'Donation Section Label (Bangla)' },
    { fieldKey: 'donationHeading', labelEn: 'Donation Section Heading', labelBn: 'Donation Section Heading (Bangla)' },
    { fieldKey: 'paymentLabel', labelEn: 'Payment Section Label', labelBn: 'Payment Section Label (Bangla)' },
    { fieldKey: 'paymentHeading', labelEn: 'Payment Section Heading', labelBn: 'Payment Section Heading (Bangla)' },
    { fieldKey: 'volunteerLabel', labelEn: 'Volunteer Section Label', labelBn: 'Volunteer Section Label (Bangla)' },
    { fieldKey: 'volunteerHeading', labelEn: 'Volunteer Section Heading', labelBn: 'Volunteer Section Heading (Bangla)' },
    { fieldKey: 'volunteerFormLabel', labelEn: 'Volunteer Form Label', labelBn: 'Volunteer Form Label (Bangla)' },
    { fieldKey: 'volunteerFormHeading', labelEn: 'Volunteer Form Heading', labelBn: 'Volunteer Form Heading (Bangla)' },
    { fieldKey: 'partnerLabel', labelEn: 'Partner Section Label', labelBn: 'Partner Section Label (Bangla)' },
    { fieldKey: 'partnerHeading', labelEn: 'Partner Section Heading', labelBn: 'Partner Section Heading (Bangla)' },
    { fieldKey: 'partnerSubtitle', labelEn: 'Partner Section Subtitle', labelBn: 'Partner Section Subtitle (Bangla)' },
    { fieldKey: 'partnerFormLabel', labelEn: 'Partner Form Label', labelBn: 'Partner Form Label (Bangla)' },
    { fieldKey: 'partnerFormHeading', labelEn: 'Partner Form Heading', labelBn: 'Partner Form Heading (Bangla)' },
  ]

  const saveDonationTiers = async () => {
    setSaving(true)
    setError('')
    setStatusMessage('')
    try {
      await Promise.all(
        donationTiers.map((tier) =>
          request(`/api/admin/donation-tiers/${tier.id}`, {
            method: 'PATCH',
            body: JSON.stringify(tier),
          })
        )
      )
      setStatusMessage('Donation tiers saved successfully')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const addDonationTier = async () => {
    if (!newTier.amount || !newTier.labelEn) {
      setError('Amount and English label are required')
      return
    }

    setSaving(true)
    setError('')
    setStatusMessage('')
    try {
      await request('/api/admin/donation-tiers', {
        method: 'POST',
        body: JSON.stringify(newTier),
      })
      setNewTier({ amount: '', labelEn: '', labelBn: '' })
      await loadContent()
      setStatusMessage('Donation tier added')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmDeleteDonationTier = (itemId) => {
    setDeleteConfirm({ isOpen: true, itemId, kind: 'tier' })
  }

  const deleteDonationTier = async () => {
    const { itemId } = deleteConfirm
    if (!itemId) return

    setSaving(true)
    setError('')
    setStatusMessage('')
    try {
      await request(`/api/admin/donation-tiers/${itemId}`, { method: 'DELETE' })
      await loadContent()
      setDeleteConfirm({ isOpen: false, itemId: null, kind: '' })
      setStatusMessage('Donation tier deleted')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const saveVolunteerRoles = async () => {
    setSaving(true)
    setError('')
    setStatusMessage('')
    try {
      await Promise.all(
        volunteerRoles.map((role) =>
          request(`/api/admin/volunteer-roles/${role.id}`, {
            method: 'PATCH',
            body: JSON.stringify(role),
          })
        )
      )
      setStatusMessage('Volunteer roles saved successfully')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const addVolunteerRole = async () => {
    if (!newRole.titleEn) {
      setError('English title is required')
      return
    }

    setSaving(true)
    setError('')
    setStatusMessage('')
    try {
      await request('/api/admin/volunteer-roles', {
        method: 'POST',
        body: JSON.stringify(newRole),
      })
      setNewRole({ titleEn: '', titleBn: '', descriptionEn: '', descriptionBn: '' })
      await loadContent()
      setStatusMessage('Volunteer role added')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmDeleteVolunteerRole = (itemId) => {
    setDeleteConfirm({ isOpen: true, itemId, kind: 'role' })
  }

  const deleteVolunteerRole = async () => {
    const { itemId } = deleteConfirm
    if (!itemId) return

    setSaving(true)
    setError('')
    setStatusMessage('')
    try {
      await request(`/api/admin/volunteer-roles/${itemId}`, { method: 'DELETE' })
      await loadContent()
      setDeleteConfirm({ isOpen: false, itemId: null, kind: '' })
      setStatusMessage('Volunteer role deleted')
    } catch (error) {
      setError(error.message)
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

  const successStyle = {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '0.4rem',
    fontSize: '0.9rem',
    background: '#dbeafe',
    color: '#0c4a6e',
  }

  if (initialLoading) {
    return <LoadingSpinner fullPage text="Loading get involved content..." />
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
                  <button type="button" onClick={() => confirmDeleteDonationTier(tier.id)} disabled={saving} style={{ ...styles.button, marginTop: 0, background: '#b91c1c' }}>
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
            labelEn="Account Name (EN)"
            labelBn="Account Name (BN)"
            valueEn={data.bank?.accountName?.en}
            valueBn={data.bank?.accountName?.bn}
            onChangeEn={(val) => updateField('bank', 'accountName', 'en', val)}
            onChangeBn={(val) => updateField('bank', 'accountName', 'bn', val)}
          />
          <BilingualField
            labelEn="Bank & Branch (EN)"
            labelBn="Bank & Branch (BN)"
            valueEn={data.bank?.bankName?.en}
            valueBn={data.bank?.bankName?.bn}
            onChangeEn={(val) => updateField('bank', 'bankName', 'en', val)}
            onChangeBn={(val) => updateField('bank', 'bankName', 'bn', val)}
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

      {activeTab === 'payment' && (
        <div style={styles.section}>
          <div style={styles.title}>UPI / Payment</div>
          <MediaUploadField
            label="UPI QR Code"
            helperText="Use a sharp, scan-friendly image. This replaces the QR shown on the public site."
            currentUrl={upiQrImageUrl}
            currentAlt="UPI QR code"
            onUpload={uploadUpiQrImage}
            onDelete={upiQrImageUrl ? deleteUpiQrImage : undefined}
            uploading={paymentUploading}
            previewClassName="h-72 w-full object-contain bg-white"
          />
        </div>
      )}

      {activeTab === 'volunteer' && (
        <div style={styles.section}>
          <div style={styles.title}>Volunteer Section</div>
          <BilingualField
            labelEn="Section Heading"
            labelBn="Section Heading (Bangla)"
            valueEn={data.volunteer?.heading?.en}
            valueBn={data.volunteer?.heading?.bn}
            onChangeEn={(val) => updateField('volunteer', 'heading', 'en', val)}
            onChangeBn={(val) => updateField('volunteer', 'heading', 'bn', val)}
          />
          <BilingualField
            labelEn="Section Description"
            labelBn="Section Description (Bangla)"
            valueEn={data.volunteer?.description?.en}
            valueBn={data.volunteer?.description?.bn}
            onChangeEn={(val) => updateField('volunteer', 'description', 'en', val)}
            onChangeBn={(val) => updateField('volunteer', 'description', 'bn', val)}
            isTextArea
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
                    labelEn="Role Title"
                    labelBn="Role Title (Bangla)"
                    valueEn={role.titleEn}
                    valueBn={role.titleBn}
                    onChangeEn={(val) => updateRole(role.id, 'titleEn', val)}
                    onChangeBn={(val) => updateRole(role.id, 'titleBn', val)}
                  />
                  <BilingualField
                    labelEn="Role Description"
                    labelBn="Role Description (Bangla)"
                    valueEn={role.descriptionEn}
                    valueBn={role.descriptionBn}
                    onChangeEn={(val) => updateRole(role.id, 'descriptionEn', val)}
                    onChangeBn={(val) => updateRole(role.id, 'descriptionBn', val)}
                    isTextArea
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '120px auto', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      value={role.sortOrder ?? 0}
                      onChange={(event) => updateRole(role.id, 'sortOrder', Number(event.target.value))}
                      style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                    />
                    <button type="button" onClick={() => confirmDeleteVolunteerRole(role.id)} disabled={saving} style={{ ...styles.button, marginTop: 0, background: '#b91c1c', width: 'fit-content' }}>
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
                labelEn="Role Title"
                labelBn="Role Title (Bangla)"
                valueEn={newRole.titleEn}
                valueBn={newRole.titleBn}
                onChangeEn={(val) => setNewRole({ ...newRole, titleEn: val })}
                onChangeBn={(val) => setNewRole({ ...newRole, titleBn: val })}
              />
              <BilingualField
                labelEn="Role Description"
                labelBn="Role Description (Bangla)"
                valueEn={newRole.descriptionEn}
                valueBn={newRole.descriptionBn}
                onChangeEn={(val) => setNewRole({ ...newRole, descriptionEn: val })}
                onChangeBn={(val) => setNewRole({ ...newRole, descriptionBn: val })}
                isTextArea
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
          <MediaUploadField
            label="Partnership Photo"
            helperText="This image appears in the public Get Involved partnership section."
            currentUrl={heroImageUrl}
            currentAlt="Get involved partnership photo"
            onUpload={uploadHeroImage}
            onDelete={heroImageUrl ? deleteHeroImage : undefined}
            uploading={heroUploading}
            previewClassName="h-72 w-full object-cover"
          />
          <BilingualField
            labelEn="Partner Heading"
            labelBn="Partner Heading (Bangla)"
            valueEn={data.partner?.heading?.en}
            valueBn={data.partner?.heading?.bn}
            onChangeEn={(val) => updateField('partner', 'heading', 'en', val)}
            onChangeBn={(val) => updateField('partner', 'heading', 'bn', val)}
          />
          <BilingualField
            labelEn="Partner Description"
            labelBn="Partner Description (Bangla)"
            valueEn={data.partner?.description?.en}
            valueBn={data.partner?.description?.bn}
            onChangeEn={(val) => updateField('partner', 'description', 'en', val)}
            onChangeBn={(val) => updateField('partner', 'description', 'bn', val)}
            isTextArea
          />
          <button onClick={() => saveSection('partner')} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Partner Section'}
          </button>
        </div>
      )}

      {activeTab === 'labels' && (
        <div style={styles.section}>
          <div style={styles.title}>Page Labels</div>
          <p style={{ color: '#475569', marginBottom: '1rem' }}>These labels drive the public section headings on the Get Involved page.</p>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pageLabelFields.map((field) => (
              <BilingualField
                key={field.fieldKey}
                labelEn={field.labelEn}
                labelBn={field.labelBn}
                valueEn={data.pageContent?.[field.fieldKey]?.en}
                valueBn={data.pageContent?.[field.fieldKey]?.bn}
                onChangeEn={(val) => updateField('pageContent', field.fieldKey, 'en', val)}
                onChangeBn={(val) => updateField('pageContent', field.fieldKey, 'bn', val)}
              />
            ))}
          </div>
          <button onClick={() => saveSection('pageContent')} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Page Labels'}
          </button>
        </div>
      )}

      {statusMessage && <div style={successStyle}>{statusMessage}</div>}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.kind === 'role' ? 'Delete Volunteer Role?' : 'Delete Donation Tier?'}
        message="This item will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={saving}
        onConfirm={deleteConfirm.kind === 'role' ? deleteVolunteerRole : deleteDonationTier}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null, kind: '' })}
      />
    </div>
  )
}
