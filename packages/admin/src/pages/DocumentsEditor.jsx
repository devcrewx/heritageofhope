import { useEffect, useState, useRef, useContext } from 'react'
import { ArrowDown, ArrowUp, Trash2, AlertCircle } from 'lucide-react'
import apiClient from '../lib/api'
import { Toast } from '../components/Toast'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import SplitLayout from '../components/SplitLayout'
import { usePreviewSync } from '../hooks/usePreviewSync'
import { SiteContentContext } from '../App'

export default function DocumentsEditor() {
  const iframeRef = useRef(null)
  const fullContent = useContext(SiteContentContext)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, documentId: null })
  const [form, setForm] = useState({
    titleEn: '',
    titleBn: '',
    descriptionEn: '',
    descriptionBn: '',
    date: '',
    pdf: null,
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    loadDocuments()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  async function loadDocuments() {
    try {
      setInitialLoading(true)
      setError(null)
      const response = await apiClient.get('/api/admin/documents')
      setDocuments(response.data.items || [])
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to load documents'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setInitialLoading(false)
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!form.titleEn.trim()) {
      errors.titleEn = 'English title is required'
    } else if (form.titleEn.trim().length < 3) {
      errors.titleEn = 'English title must be at least 3 characters'
    } else if (form.titleEn.length > 200) {
      errors.titleEn = 'English title must be at most 200 characters'
    }

    if (form.titleBn && form.titleBn.length > 200) {
      errors.titleBn = 'Bengali title must be at most 200 characters'
    }

    if (form.descriptionEn && form.descriptionEn.length > 1000) {
      errors.descriptionEn = 'English description must be at most 1000 characters'
    }

    if (form.descriptionBn && form.descriptionBn.length > 1000) {
      errors.descriptionBn = 'Bengali description must be at most 1000 characters'
    }

    return errors
  }

  function resetForm() {
    setEditingId(null)
    setForm({
      titleEn: '',
      titleBn: '',
      descriptionEn: '',
      descriptionBn: '',
      date: '',
      pdf: null,
    })
    setFormErrors({})
  }

  function startEdit(item) {
    setEditingId(item.id)
    setForm({
      titleEn: item.titleEn || '',
      titleBn: item.titleBn || '',
      descriptionEn: item.descriptionEn || '',
      descriptionBn: item.descriptionBn || '',
      date: item.date ? String(item.date).slice(0, 10) : '',
      pdf: null,
    })
    setFormErrors({})
    setError(null)
  }

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => {
      if (prev[field]) {
        return { ...prev, [field]: '' }
      }
      return prev
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      showToast('Please fix validation errors', 'error')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      const formData = new FormData()
      formData.append('titleEn', form.titleEn)
      formData.append('titleBn', form.titleBn)
      formData.append('descriptionEn', form.descriptionEn)
      formData.append('descriptionBn', form.descriptionBn)
      formData.append('date', form.date)
      if (form.pdf) formData.append('pdf', form.pdf)

      const response = editingId
        ? await apiClient.patch(`/api/admin/documents/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await apiClient.post('/api/admin/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

      if (response.data.success) {
        showToast(editingId ? 'Document updated successfully' : 'Document created successfully', 'success')
        resetForm()
        await loadDocuments()
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to save document'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = (documentId) => {
    setDeleteConfirm({ isOpen: true, documentId })
  }

  async function deleteDocument() {
    const { documentId } = deleteConfirm
    if (!documentId) return

    try {
      setLoading(true)
      const response = await apiClient.delete(`/api/admin/documents/${documentId}`)
      if (response.data.success) {
        setDocuments((current) => current.filter((item) => item.id !== documentId))
        showToast('Document deleted successfully', 'success')
        setDeleteConfirm({ isOpen: false, documentId: null })
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete document'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function moveDocument(id, direction) {
    const currentIndex = documents.findIndex((item) => item.id === id)
    const targetIndex = currentIndex + direction
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= documents.length) return

    const updated = [...documents]
    const [moved] = updated.splice(currentIndex, 1)
    updated.splice(targetIndex, 0, moved)
    setDocuments(updated)

    try {
      setLoading(true)
      const items = updated.map((item, index) => ({ id: item.id, sortOrder: index }))
      await apiClient.patch('/api/admin/documents/reorder', { items })
      showToast('Documents reordered successfully', 'success')
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to reorder documents'
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const draft = { documents }
  usePreviewSync(iframeRef, draft, 'about', fullContent)

  if (initialLoading) {
    return <LoadingSpinner fullPage text="Loading documents..." />
  }

  return (
    <SplitLayout previewPage="/about" iframeRef={iframeRef}>
    <div className="space-y-6 max-w-5xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-gray-600">Upload trust certificates, reports, and other PDFs.</p>
        </div>
        <button
          type="button"
          onClick={() => { resetForm(); setError(null) }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          New Document
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          error={error} 
          onClose={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (English) <span className="text-red-500">*</span>
            </label>
            <input
              value={form.titleEn}
              onChange={(e) => handleInputChange('titleEn', e.target.value)}
              placeholder="e.g., Annual Report 2024"
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
                formErrors.titleEn
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {formErrors.titleEn && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {formErrors.titleEn}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (Bengali)
            </label>
            <input
              value={form.titleBn}
              onChange={(e) => handleInputChange('titleBn', e.target.value)}
              placeholder="যেমন, বার্ষিক প্রতিবেদন ২০২৪"
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
                formErrors.titleBn
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {formErrors.titleBn && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {formErrors.titleBn}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (English)
            </label>
            <textarea
              value={form.descriptionEn}
              onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
              placeholder="Document details..."
              rows={3}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
                formErrors.descriptionEn
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {formErrors.descriptionEn && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {formErrors.descriptionEn}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Bengali)
            </label>
            <textarea
              value={form.descriptionBn}
              onChange={(e) => handleInputChange('descriptionBn', e.target.value)}
              placeholder="নথির বিবরণ..."
              rows={3}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
                formErrors.descriptionBn
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {formErrors.descriptionBn && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {formErrors.descriptionBn}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF File
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleInputChange('pdf', e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {form.pdf && (
              <p className="text-sm text-green-600 mt-1">✓ {form.pdf.name}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || loading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {submitting ? 'Saving...' : editingId ? 'Update document' : 'Create document'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {documents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-500">
            No documents yet. Create one using the form above.
          </div>
        ) : (
          documents.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <button
                  type="button"
                  onClick={() => moveDocument(item.id, -1)}
                  disabled={index === 0 || loading}
                  className="rounded p-1 hover:text-gray-600 disabled:opacity-30 transition"
                  title="Move up"
                >
                  <ArrowUp size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => moveDocument(item.id, 1)}
                  disabled={index === documents.length - 1 || loading}
                  className="rounded p-1 hover:text-gray-600 disabled:opacity-30 transition"
                  title="Move down"
                >
                  <ArrowDown size={18} />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="truncate text-base font-semibold">{item.titleEn}</h3>
                  {item.date && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {String(item.date).slice(0, 10)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {item.descriptionEn || item.descriptionBn || 'No description'}
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  {item.pdfUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        fetch(item.pdfUrl)
                          .then((res) => res.blob())
                          .then((blob) => {
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = (item.titleEn || 'document') + '.pdf'
                            document.body.appendChild(a)
                            a.click()
                            document.body.removeChild(a)
                            setTimeout(() => URL.revokeObjectURL(url), 60000)
                          })
                          .catch(() => window.open(item.pdfUrl, '_blank'))
                      }}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Download PDF
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => confirmDelete(item.id)}
                  disabled={loading}
                  className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Document?"
        message="This document will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={loading}
        onConfirm={deleteDocument}
        onCancel={() => setDeleteConfirm({ isOpen: false, documentId: null })}
      />

      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
    </SplitLayout>
  )
}
