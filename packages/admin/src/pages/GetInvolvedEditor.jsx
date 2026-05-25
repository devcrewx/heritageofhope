import { useEffect, useState, useRef, useContext } from 'react'
import BilingualField from '../components/BilingualField'
import MediaUploadField from '../components/MediaUploadField'
import SplitLayout from '../components/SplitLayout'
import { usePreviewSync } from '../hooks/usePreviewSync'
import { SiteContentContext } from '../App'
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
  const iframeRef = useRef(null)
  const fullContent = useContext(SiteContentContext)
  const { request } = useApi()
  const [data, setData] = useState({})
  const [donationTiers, setDonationTiers] = useState([])
  const [volunteerRoles, setVolunteerRoles] = useState([])
  const [newTier, setNewTier] = useState({ amount: '', labelEn: '', labelBn: '' })
  const [newRole, setNewRole] = useState({ titleEn: '', titleBn: '', descriptionEn: '', descriptionBn: '' })
  const [activeTab, setActiveTab] = useState('tiers')
  const [saving, setSaving] = useState(false)
  const [paymentUploading, setPaymentUploading] = useState(false)
  const [chequeUploading, setChequeUploading] = useState(false)
  const [partnerUploading, setPartnerUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null, kind: '' })

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

  useEffect(() => {
    loadContent()
  }, [])

  const upiQrImageUrl = data.upi?.qrUrl?.en || ''
  const specimenChequeUrl = data.bank?.chequeUrl?.en || ''
  const partnerImageUrl = data.partner?.image?.en || ''

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
          upi: {
            ...current.upi,
            qrUrl: {
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
          upi: {
            ...current.upi,
            qrUrl: { en: '', bn: '' },
          },
        }))
      setStatusMessage('UPI QR image removed')
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setPaymentUploading(false)
    }
  }

  const uploadSpecimenCheque = async (file) => {
    setChequeUploading(true)
    setError('')
    setStatusMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('page', 'getInvolved')
      formData.append('section', 'bank')
      formData.append('fieldKey', 'chequeUrl')

      const response = await apiClient.post('/api/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data?.data?.url) {
        setData((current) => ({
          ...current,
          bank: {
            ...current.bank,
            chequeUrl: { en: response.data.data.url, bn: response.data.data.publicId || '' },
          },
        }))
      }

      setStatusMessage('Specimen cheque updated')
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setChequeUploading(false)
    }
  }

  const deleteSpecimenCheque = async () => {
    setChequeUploading(true)
    setError('')
    setStatusMessage('')

    try {
      await apiClient.delete('/api/admin/media/getInvolved/bank/chequeUrl')
      setData((current) => ({
        ...current,
        bank: {
          ...current.bank,
          chequeUrl: { en: '', bn: '' },
        },
      }))
      setStatusMessage('Specimen cheque removed')
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setChequeUploading(false)
    }
  }

  const uploadPartnerImage = async (file) => {
    setPartnerUploading(true)
    setError('')
    setStatusMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('page', 'getInvolved')
      formData.append('section', 'partner')
      formData.append('fieldKey', 'image')

      const response = await apiClient.post('/api/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data?.data?.url) {
        setData((current) => ({
          ...current,
          partner: {
            ...current.partner,
            image: { en: response.data.data.url, bn: response.data.data.publicId || '' },
          },
        }))
      }

      setStatusMessage('Partner image updated')
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setPartnerUploading(false)
    }
  }

  const deletePartnerImage = async () => {
    setPartnerUploading(true)
    setError('')
    setStatusMessage('')

    try {
      await apiClient.delete('/api/admin/media/getInvolved/partner/image')
      setData((current) => ({
        ...current,
        partner: {
          ...current.partner,
          image: { en: '', bn: '' },
        },
      }))
      setStatusMessage('Partner image removed')
    } catch (error) {
      setError(error.response?.data?.error || error.message)
    } finally {
      setPartnerUploading(false)
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

  const updateTier = (id, field, value) => {
    setDonationTiers((current) => current.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier)))
  }

  const updateRole = (id, field, value) => {
    setVolunteerRoles((current) => current.map((role) => (role.id === id ? { ...role, [field]: value } : role)))
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
    { fieldKey: 'eyebrow', labelEn: 'Page Eyebrow', labelBn: 'Page Eyebrow (Bangla)' },
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
    { fieldKey: 'bankLabel', labelEn: 'Bank Details Header', labelBn: 'Bank Details Header (Bangla)' },
    { fieldKey: 'chequeModalTitle', labelEn: 'Specimen Cheque Modal Title', labelBn: 'Specimen Cheque Modal Title (Bangla)' },
    { fieldKey: 'chequeButtonLabel', labelEn: 'View Cheque Button Label', labelBn: 'View Cheque Button Label (Bangla)' },
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

  const draft = {
    hero: {
      pageTitle: data.intro?.title || { en: '', bn: '' },
      intro: data.intro?.paragraph || { en: '', bn: '' },
    },
    pageContent: data.pageContent || {},
    bankDetails: data.bank || {},
    upiImage: data.upi?.qrUrl?.en || '',
    upiDeepLink: data.upi?.intentUrl?.en || '',
    upiLabels: data.upiLabels || {},
    volunteerFormLabels: data.volunteerFormLabels || {},
    volunteer: {
      heading: data.volunteer?.heading || { en: '', bn: '' },
      description: data.volunteer?.description || { en: '', bn: '' },
      roles: volunteerRoles.map(r => ({
        title: { en: r.titleEn, bn: r.titleBn || '' },
        description: { en: r.descriptionEn || '', bn: r.descriptionBn || '' },
      })),
    },
    partnerSection: {
      heading: data.partner?.heading || { en: '', bn: '' },
      body: data.partner?.description || { en: '', bn: '' },
    },
    partnerFormLabels: data.partnerFormLabels || {},
    specimenChequeImage: data.bank?.chequeUrl?.en || '',
    donationTiers: donationTiers.map(t => ({
      amount: t.amount,
      label: { en: t.labelEn, bn: t.labelBn || '' },
    })),
  }
  usePreviewSync(iframeRef, draft, 'getInvolved', fullContent)

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
    <SplitLayout previewPage="/get-involved" iframeRef={iframeRef}>
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={tier.amount ?? ''}
                    onChange={(event) => updateTier(tier.id, 'amount', event.target.value)}
                    placeholder="500"
                    style={{ flex: '1 1 100px', minWidth: '80px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <input
                    value={tier.labelEn || ''}
                    onChange={(event) => updateTier(tier.id, 'labelEn', event.target.value)}
                    placeholder="feeds a family"
                    style={{ flex: '2 1 140px', minWidth: '100px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <input
                    value={tier.labelBn || ''}
                    onChange={(event) => updateTier(tier.id, 'labelBn', event.target.value)}
                    placeholder="একটি পরিবারকে খাবার"
                    style={{ flex: '2 1 140px', minWidth: '100px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
                  />
                  <button type="button" onClick={() => confirmDeleteDonationTier(tier.id)} disabled={saving} style={{ flex: '0 0 auto', padding: '0.6rem 1.25rem', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <input
                value={newTier.amount}
                onChange={(event) => setNewTier({ ...newTier, amount: event.target.value })}
                type="number"
                placeholder="250"
                style={{ flex: '1 1 100px', minWidth: '80px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
              />
              <input
                value={newTier.labelEn}
                onChange={(event) => setNewTier({ ...newTier, labelEn: event.target.value })}
                placeholder="supports a child"
                style={{ flex: '2 1 140px', minWidth: '100px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
              />
              <input
                value={newTier.labelBn}
                onChange={(event) => setNewTier({ ...newTier, labelBn: event.target.value })}
                placeholder="একটি শিশুকে সহায়তা"
                style={{ flex: '2 1 140px', minWidth: '100px', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '0.4rem' }}
              />
              <button type="button" onClick={addDonationTier} disabled={saving} style={{ flex: '0 0 auto', padding: '0.6rem 1.25rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
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
          <div className="mt-6">
            <MediaUploadField
              label="Specimen Cheque Image"
              helperText="Shows a sample cheque with account details for reference."
              currentUrl={specimenChequeUrl}
              currentAlt="Specimen cheque"
              onUpload={uploadSpecimenCheque}
              onDelete={specimenChequeUrl ? deleteSpecimenCheque : undefined}
              uploading={chequeUploading}
              previewClassName="h-48 w-full object-contain bg-white"
            />
          </div>
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
            currentUrl={partnerImageUrl}
            currentAlt="Get involved partnership photo"
            onUpload={uploadPartnerImage}
            onDelete={partnerImageUrl ? deletePartnerImage : undefined}
            uploading={partnerUploading}
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
        <div>
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

        <div style={{ ...styles.section, marginTop: '1.5rem' }}>
          <div style={styles.title}>Volunteer Form Labels</div>
          <p style={{ color: '#475569', marginBottom: '1rem' }}>
            Labels for the volunteer interest form.
          </p>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <BilingualField
              labelEn="Name Label"
              labelBn="Name Label (Bangla)"
              valueEn={data.volunteerFormLabels?.nameLabel?.en}
              valueBn={data.volunteerFormLabels?.nameLabel?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'nameLabel', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'nameLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Email Label"
              labelBn="Email Label (Bangla)"
              valueEn={data.volunteerFormLabels?.emailLabel?.en}
              valueBn={data.volunteerFormLabels?.emailLabel?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'emailLabel', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'emailLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Phone Label"
              labelBn="Phone Label (Bangla)"
              valueEn={data.volunteerFormLabels?.phoneLabel?.en}
              valueBn={data.volunteerFormLabels?.phoneLabel?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'phoneLabel', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'phoneLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Phone Validation Message"
              labelBn="Phone Validation Message (Bangla)"
              valueEn={data.volunteerFormLabels?.phoneValidation?.en}
              valueBn={data.volunteerFormLabels?.phoneValidation?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'phoneValidation', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'phoneValidation', 'bn', val)}
            />
            <BilingualField
              labelEn="Interest Label"
              labelBn="Interest Label (Bangla)"
              valueEn={data.volunteerFormLabels?.interestLabel?.en}
              valueBn={data.volunteerFormLabels?.interestLabel?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'interestLabel', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'interestLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Interest Placeholder"
              labelBn="Interest Placeholder (Bangla)"
              valueEn={data.volunteerFormLabels?.interestPlaceholder?.en}
              valueBn={data.volunteerFormLabels?.interestPlaceholder?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'interestPlaceholder', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'interestPlaceholder', 'bn', val)}
            />
            <BilingualField
              labelEn="Availability Label"
              labelBn="Availability Label (Bangla)"
              valueEn={data.volunteerFormLabels?.availabilityLabel?.en}
              valueBn={data.volunteerFormLabels?.availabilityLabel?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'availabilityLabel', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'availabilityLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Availability Placeholder"
              labelBn="Availability Placeholder (Bangla)"
              valueEn={data.volunteerFormLabels?.availabilityPlaceholder?.en}
              valueBn={data.volunteerFormLabels?.availabilityPlaceholder?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'availabilityPlaceholder', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'availabilityPlaceholder', 'bn', val)}
            />
            <BilingualField
              labelEn="Weekends Option"
              labelBn="Weekends Option (Bangla)"
              valueEn={data.volunteerFormLabels?.availabilityWeekends?.en}
              valueBn={data.volunteerFormLabels?.availabilityWeekends?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'availabilityWeekends', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'availabilityWeekends', 'bn', val)}
            />
            <BilingualField
              labelEn="Weekdays Option"
              labelBn="Weekdays Option (Bangla)"
              valueEn={data.volunteerFormLabels?.availabilityWeekdays?.en}
              valueBn={data.volunteerFormLabels?.availabilityWeekdays?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'availabilityWeekdays', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'availabilityWeekdays', 'bn', val)}
            />
            <BilingualField
              labelEn="Occasionally Option"
              labelBn="Occasionally Option (Bangla)"
              valueEn={data.volunteerFormLabels?.availabilityOccasional?.en}
              valueBn={data.volunteerFormLabels?.availabilityOccasional?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'availabilityOccasional', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'availabilityOccasional', 'bn', val)}
            />
            <BilingualField
              labelEn="Message Label"
              labelBn="Message Label (Bangla)"
              valueEn={data.volunteerFormLabels?.messageLabel?.en}
              valueBn={data.volunteerFormLabels?.messageLabel?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'messageLabel', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'messageLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Submit Button"
              labelBn="Submit Button (Bangla)"
              valueEn={data.volunteerFormLabels?.submitLabel?.en}
              valueBn={data.volunteerFormLabels?.submitLabel?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'submitLabel', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'submitLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Submitting Text"
              labelBn="Submitting Text (Bangla)"
              valueEn={data.volunteerFormLabels?.submittingLabel?.en}
              valueBn={data.volunteerFormLabels?.submittingLabel?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'submittingLabel', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'submittingLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Error Message"
              labelBn="Error Message (Bangla)"
              valueEn={data.volunteerFormLabels?.errorMessage?.en}
              valueBn={data.volunteerFormLabels?.errorMessage?.bn}
              onChangeEn={(val) => updateField('volunteerFormLabels', 'errorMessage', 'en', val)}
              onChangeBn={(val) => updateField('volunteerFormLabels', 'errorMessage', 'bn', val)}
            />
          </div>
          <button onClick={() => saveSection('volunteerFormLabels')} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Volunteer Form Labels'}
          </button>
        </div>

        <div style={{ ...styles.section, marginTop: '1.5rem' }}>
          <div style={styles.title}>Partner Form Labels</div>
          <p style={{ color: '#475569', marginBottom: '1rem' }}>
            Labels for the partner inquiry form.
          </p>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <BilingualField
              labelEn="Organization Name Label"
              labelBn="Organization Name Label (Bangla)"
              valueEn={data.partnerFormLabels?.orgNameLabel?.en}
              valueBn={data.partnerFormLabels?.orgNameLabel?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'orgNameLabel', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'orgNameLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Contact Person Label"
              labelBn="Contact Person Label (Bangla)"
              valueEn={data.partnerFormLabels?.contactPersonLabel?.en}
              valueBn={data.partnerFormLabels?.contactPersonLabel?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'contactPersonLabel', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'contactPersonLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Email Label"
              labelBn="Email Label (Bangla)"
              valueEn={data.partnerFormLabels?.emailLabel?.en}
              valueBn={data.partnerFormLabels?.emailLabel?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'emailLabel', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'emailLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Phone Label"
              labelBn="Phone Label (Bangla)"
              valueEn={data.partnerFormLabels?.phoneLabel?.en}
              valueBn={data.partnerFormLabels?.phoneLabel?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'phoneLabel', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'phoneLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Phone Validation Message"
              labelBn="Phone Validation Message (Bangla)"
              valueEn={data.partnerFormLabels?.phoneValidation?.en}
              valueBn={data.partnerFormLabels?.phoneValidation?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'phoneValidation', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'phoneValidation', 'bn', val)}
            />
            <BilingualField
              labelEn="Partnership Type Label"
              labelBn="Partnership Type Label (Bangla)"
              valueEn={data.partnerFormLabels?.partnershipTypeLabel?.en}
              valueBn={data.partnerFormLabels?.partnershipTypeLabel?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'partnershipTypeLabel', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'partnershipTypeLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Partnership Type Placeholder"
              labelBn="Partnership Type Placeholder (Bangla)"
              valueEn={data.partnerFormLabels?.partnershipTypePlaceholder?.en}
              valueBn={data.partnerFormLabels?.partnershipTypePlaceholder?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'partnershipTypePlaceholder', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'partnershipTypePlaceholder', 'bn', val)}
            />
            <BilingualField
              labelEn="CSR Option"
              labelBn="CSR Option (Bangla)"
              valueEn={data.partnerFormLabels?.partnershipTypeCsr?.en}
              valueBn={data.partnerFormLabels?.partnershipTypeCsr?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'partnershipTypeCsr', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'partnershipTypeCsr', 'bn', val)}
            />
            <BilingualField
              labelEn="Hospital / Medical Option"
              labelBn="Hospital / Medical Option (Bangla)"
              valueEn={data.partnerFormLabels?.partnershipTypeHospital?.en}
              valueBn={data.partnerFormLabels?.partnershipTypeHospital?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'partnershipTypeHospital', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'partnershipTypeHospital', 'bn', val)}
            />
            <BilingualField
              labelEn="Institution / School Option"
              labelBn="Institution / School Option (Bangla)"
              valueEn={data.partnerFormLabels?.partnershipTypeInstitution?.en}
              valueBn={data.partnerFormLabels?.partnershipTypeInstitution?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'partnershipTypeInstitution', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'partnershipTypeInstitution', 'bn', val)}
            />
            <BilingualField
              labelEn="Other Option"
              labelBn="Other Option (Bangla)"
              valueEn={data.partnerFormLabels?.partnershipTypeOther?.en}
              valueBn={data.partnerFormLabels?.partnershipTypeOther?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'partnershipTypeOther', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'partnershipTypeOther', 'bn', val)}
            />
            <BilingualField
              labelEn="Message Label"
              labelBn="Message Label (Bangla)"
              valueEn={data.partnerFormLabels?.messageLabel?.en}
              valueBn={data.partnerFormLabels?.messageLabel?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'messageLabel', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'messageLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Submit Button"
              labelBn="Submit Button (Bangla)"
              valueEn={data.partnerFormLabels?.submitLabel?.en}
              valueBn={data.partnerFormLabels?.submitLabel?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'submitLabel', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'submitLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Submitting Text"
              labelBn="Submitting Text (Bangla)"
              valueEn={data.partnerFormLabels?.submittingLabel?.en}
              valueBn={data.partnerFormLabels?.submittingLabel?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'submittingLabel', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'submittingLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Error Message"
              labelBn="Error Message (Bangla)"
              valueEn={data.partnerFormLabels?.errorMessage?.en}
              valueBn={data.partnerFormLabels?.errorMessage?.bn}
              onChangeEn={(val) => updateField('partnerFormLabels', 'errorMessage', 'en', val)}
              onChangeBn={(val) => updateField('partnerFormLabels', 'errorMessage', 'bn', val)}
            />
          </div>
          <button onClick={() => saveSection('partnerFormLabels')} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Partner Form Labels'}
          </button>
        </div>

        <div style={{ ...styles.section, marginTop: '1.5rem' }}>
          <div style={styles.title}>UPI Labels</div>
          <p style={{ color: '#475569', marginBottom: '1rem' }}>
            Text hints and labels for the UPI/QR section.
          </p>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <BilingualField
              labelEn="UPI Button Label"
              labelBn="UPI Button Label (Bangla)"
              valueEn={data.upiLabels?.buttonLabel?.en}
              valueBn={data.upiLabels?.buttonLabel?.bn}
              onChangeEn={(val) => updateField('upiLabels', 'buttonLabel', 'en', val)}
              onChangeBn={(val) => updateField('upiLabels', 'buttonLabel', 'bn', val)}
            />
            <BilingualField
              labelEn="Mobile Hint"
              labelBn="Mobile Hint (Bangla)"
              valueEn={data.upiLabels?.mobileHint?.en}
              valueBn={data.upiLabels?.mobileHint?.bn}
              onChangeEn={(val) => updateField('upiLabels', 'mobileHint', 'en', val)}
              onChangeBn={(val) => updateField('upiLabels', 'mobileHint', 'bn', val)}
            />
            <BilingualField
              labelEn="Fallback Hint"
              labelBn="Fallback Hint (Bangla)"
              valueEn={data.upiLabels?.fallbackHint?.en}
              valueBn={data.upiLabels?.fallbackHint?.bn}
              onChangeEn={(val) => updateField('upiLabels', 'fallbackHint', 'en', val)}
              onChangeBn={(val) => updateField('upiLabels', 'fallbackHint', 'bn', val)}
            />
            <BilingualField
              labelEn="QR Hint"
              labelBn="QR Hint (Bangla)"
              valueEn={data.upiLabels?.qrHint?.en}
              valueBn={data.upiLabels?.qrHint?.bn}
              onChangeEn={(val) => updateField('upiLabels', 'qrHint', 'en', val)}
              onChangeBn={(val) => updateField('upiLabels', 'qrHint', 'bn', val)}
            />
          </div>
          <button onClick={() => saveSection('upiLabels')} disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save UPI Labels'}
          </button>
        </div>
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
    </SplitLayout>
  )
}
