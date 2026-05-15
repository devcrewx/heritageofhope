import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import apiClient from '../lib/api'

export default function DocumentsEditor() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    titleEn: '',
    titleBn: '',
    descriptionEn: '',
    descriptionBn: '',
    date: '',
    pdf: null,
    preview: null,
  })

  useEffect(() => {
    loadDocuments()
  }, [])

  async function loadDocuments() {
    try {
      setLoading(true)
      const response = await apiClient.get('/api/admin/documents')
      setDocuments(response.data.items || [])
    } catch (error) {
      setMessage('Failed to load documents')
    } finally {
      setLoading(false)
    }
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
      preview: null,
    })
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
      preview: null,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('titleEn', form.titleEn)
      formData.append('titleBn', form.titleBn)
      formData.append('descriptionEn', form.descriptionEn)
      formData.append('descriptionBn', form.descriptionBn)
      formData.append('date', form.date)
      if (form.pdf) formData.append('pdf', form.pdf)
      if (form.preview) formData.append('preview', form.preview)

      const response = editingId
        ? await apiClient.patch(`/api/admin/documents/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await apiClient.post('/api/admin/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

      if (response.data.success) {
        setMessage(editingId ? 'Document updated' : 'Document created')
        resetForm()
        await loadDocuments()
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to save document')
    }
  }

  async function deleteDocument(id) {
    if (!confirm('Delete this document?')) return
    try {
      const response = await apiClient.delete(`/api/admin/documents/${id}`)
      if (response.data.success) {
        setDocuments((current) => current.filter((item) => item.id !== id))
        setMessage('Document deleted')
      }
    } catch (error) {
      setMessage('Failed to delete document')
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
      const items = updated.map((item, index) => ({ id: item.id, sortOrder: index }))
      await apiClient.patch('/api/admin/documents/reorder', { items })
      setMessage('Document order updated')
    } catch (error) {
      setMessage('Failed to reorder documents')
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Documents</h1>
          <p className="text-slate-600">Upload trust certificates, reports, and other PDFs.</p>
        </div>
        <button
          type="button"
          onClick={() => { resetForm(); setMessage('') }}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          New Document
        </button>
      </div>

      {message && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Title EN</span>
            <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Title BN</span>
            <input value={form.titleBn} onChange={(e) => setForm({ ...form, titleBn: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Description EN</span>
            <textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Description BN</span>
            <textarea value={form.descriptionBn} onChange={(e) => setForm({ ...form, descriptionBn: e.target.value })} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Date</span>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>PDF file</span>
            <input type="file" accept="application/pdf" onChange={(e) => setForm({ ...form, pdf: e.target.files?.[0] || null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Preview image</span>
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, preview: e.target.files?.[0] || null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
            {editingId ? 'Update document' : 'Create document'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Loading documents...</div>
      ) : (
        <div className="space-y-3">
          {documents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No documents yet.
            </div>
          ) : (
            documents.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center">
                <div className="flex items-center gap-2 text-slate-400">
                  <button type="button" onClick={() => moveDocument(item.id, -1)} disabled={index === 0} className="rounded p-1 disabled:opacity-30"><ArrowUp size={18} /></button>
                  <button type="button" onClick={() => moveDocument(item.id, 1)} disabled={index === documents.length - 1} className="rounded p-1 disabled:opacity-30"><ArrowDown size={18} /></button>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-slate-900">{item.titleEn}</h3>
                    {item.date && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{String(item.date).slice(0, 10)}</span>}
                  </div>
                  <p className="text-sm text-slate-600">{item.descriptionEn || item.descriptionBn || 'No description yet.'}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm">
                    {item.pdfUrl && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open PDF</a>}
                    {item.previewImgUrl && <a href={item.previewImgUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open preview</a>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => startEdit(item)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">Edit</button>
                  <button type="button" onClick={() => deleteDocument(item.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-rose-700"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
