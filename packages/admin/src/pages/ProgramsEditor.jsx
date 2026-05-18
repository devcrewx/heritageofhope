import { useState, useEffect } from 'react'
import { request } from '../lib/api'
import BilingualField from '../components/BilingualField'
import ImageUploader from '../components/ImageUploader'
import { Trash2, Plus, GripVertical, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react'
import { Toast } from '../components/Toast'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function ProgramsEditor() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, programId: null })
  const [formData, setFormData] = useState({
    slug: '',
    titleEn: '',
    titleBn: '',
    categoryEn: '',
    categoryBn: '',
    descriptionEn: '',
    descriptionBn: '',
    highlightEn: '',
    highlightBn: '',
    image: null,
    imageUrl: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [reordering, setReordering] = useState(false)

  useEffect(() => {
    fetchPrograms()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  async function fetchPrograms() {
    try {
      setInitialLoading(true)
      setError(null)
      const res = await request('GET', '/api/admin/programs')
      setPrograms(res.items || [])
    } catch (err) {
      const errorMsg = 'Failed to fetch programs: ' + err.message
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setInitialLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug must only contain lowercase letters, numbers, and hyphens'
    }

    if (!formData.titleEn.trim()) {
      errors.titleEn = 'English title is required'
    } else if (formData.titleEn.length > 200) {
      errors.titleEn = 'English title must be at most 200 characters'
    }

    if (formData.titleBn && formData.titleBn.length > 200) {
      errors.titleBn = 'Bengali title must be at most 200 characters'
    }

    if (formData.categoryEn && formData.categoryEn.length > 100) {
      errors.categoryEn = 'English category must be at most 100 characters'
    }

    if (formData.categoryBn && formData.categoryBn.length > 100) {
      errors.categoryBn = 'Bengali category must be at most 100 characters'
    }

    if (formData.descriptionEn && formData.descriptionEn.length > 500) {
      errors.descriptionEn = 'English description must be at most 500 characters'
    }

    if (formData.descriptionBn && formData.descriptionBn.length > 500) {
      errors.descriptionBn = 'Bengali description must be at most 500 characters'
    }

    if (!editingId && !formData.image) {
      errors.image = 'Program image is required'
    }

    return errors
  }

  function resetForm() {
    setFormData({
      slug: '',
      titleEn: '',
      titleBn: '',
      categoryEn: '',
      categoryBn: '',
      descriptionEn: '',
      descriptionBn: '',
      highlightEn: '',
      highlightBn: '',
      image: null,
      imageUrl: '',
    })
    setEditingId(null)
    setFormErrors({})
  }

  function editProgram(prog) {
    setFormData({
      slug: prog.slug,
      titleEn: prog.titleEn,
      titleBn: prog.titleBn,
      categoryEn: prog.categoryEn || '',
      categoryBn: prog.categoryBn || '',
      descriptionEn: prog.descriptionEn || '',
      descriptionBn: prog.descriptionBn || '',
      highlightEn: prog.highlightEn || '',
      highlightBn: prog.highlightBn || '',
      image: null,
      imageUrl: prog.imageUrl,
    })
    setEditingId(prog.id)
    setShowAddForm(true)
    setFormErrors({})
    setError(null)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      showToast('Please fix validation errors', 'error')
      return
    }

    setSubmitting(true)
    try {
      setError(null)
      const formBody = new FormData()

      // Text fields
      formBody.append('slug', formData.slug)
      formBody.append('titleEn', formData.titleEn)
      formBody.append('titleBn', formData.titleBn)
      formBody.append('categoryEn', formData.categoryEn)
      formBody.append('categoryBn', formData.categoryBn)
      formBody.append('descriptionEn', formData.descriptionEn)
      formBody.append('descriptionBn', formData.descriptionBn)
      formBody.append('highlightEn', formData.highlightEn)
      formBody.append('highlightBn', formData.highlightBn)

      // Image
      if (formData.image) {
        formBody.append('image', formData.image)
      }

      let res
      if (editingId) {
        res = await request('PATCH', `/api/admin/programs/${editingId}`, formBody, { isFormData: true })
      } else {
        res = await request('POST', '/api/admin/programs', formBody, { isFormData: true })
      }

      if (res.success) {
        showToast(editingId ? 'Program updated successfully' : 'Program created successfully', 'success')
        resetForm()
        await fetchPrograms()
        setShowAddForm(false)
      }
    } catch (err) {
      const errorMsg = 'Error: ' + err.message
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = (programId) => {
    setDeleteConfirm({ isOpen: true, programId })
  }

  async function deleteProgram() {
    const { programId } = deleteConfirm
    if (!programId) return

    try {
      setLoading(true)
      const res = await request('DELETE', `/api/admin/programs/${programId}`)
      if (res.success) {
        showToast('Program deleted successfully', 'success')
        setDeleteConfirm({ isOpen: false, programId: null })
        await fetchPrograms()
      }
    } catch (err) {
      const errorMsg = 'Delete failed: ' + err.message
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  function moveProgram(programId, direction) {
    const currentIndex = programs.findIndex((item) => item.id === programId)
    const targetIndex = currentIndex + direction

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= programs.length) {
      return
    }

    const updated = [...programs]
    const [moved] = updated.splice(currentIndex, 1)
    updated.splice(targetIndex, 0, moved)

    setPrograms(updated)
    saveOrder(updated)
  }

  async function saveOrder(newList) {
    try {
      setReordering(true)
      const items = newList.map((prog, idx) => ({ id: prog.id, sortOrder: idx }))
      const res = await request('PATCH', '/api/admin/programs/reorder', { items })
      if (res.success) {
        showToast('Program order saved', 'success')
      }
    } catch (err) {
      const errorMsg = 'Order save failed: ' + err.message
      showToast(errorMsg, 'error')
    } finally {
      setReordering(false)
    }
  }

  if (initialLoading) {
    return <LoadingSpinner fullPage text="Loading programs..." />
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Featured Programs</h1>
          <p className="text-gray-600 mt-1">Manage and order your programs</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowAddForm(true)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add Program
        </button>
      </div>

      {/* Error Message */}
      {error && !showAddForm && (
        <ErrorMessage 
          error={error} 
          onClose={() => setError(null)}
        />
      )}

      {showAddForm && (
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Program' : 'New Program'}
          </h2>

          {error && (
            <ErrorMessage 
              error={error} 
              onClose={() => setError(null)}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Slug field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="e.g., education-initiative"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.slug
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.slug && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {formErrors.slug}
                </p>
              )}
            </div>

            {/* Bilingual title */}
            <BilingualField
              labelEn="Title (EN)"
              labelBn="Title (BN)"
              valueEn={formData.titleEn}
              valueBn={formData.titleBn}
              onChangeEn={(v) => handleInputChange('titleEn', v)}
              onChangeBn={(v) => handleInputChange('titleBn', v)}
              required={true}
              errorEn={formErrors.titleEn}
              errorBn={formErrors.titleBn}
            />

            {/* Bilingual category */}
            <BilingualField
              labelEn="Category (EN)"
              labelBn="Category (BN)"
              valueEn={formData.categoryEn}
              valueBn={formData.categoryBn}
              onChangeEn={(v) => handleInputChange('categoryEn', v)}
              onChangeBn={(v) => handleInputChange('categoryBn', v)}
              errorEn={formErrors.categoryEn}
              errorBn={formErrors.categoryBn}
            />

            {/* Bilingual description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                    placeholder="Description (EN)"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      formErrors.descriptionEn
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    rows={3}
                  />
                  {formErrors.descriptionEn && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {formErrors.descriptionEn}
                    </p>
                  )}
                </div>
                <div>
                  <textarea
                    value={formData.descriptionBn}
                    onChange={(e) => handleInputChange('descriptionBn', e.target.value)}
                    placeholder="বর্ণনা (BN)"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      formErrors.descriptionBn
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    rows={3}
                  />
                  {formErrors.descriptionBn && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {formErrors.descriptionBn}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bilingual highlight */}
            <BilingualField
              labelEn="Highlight (EN)"
              labelBn="Highlight (BN)"
              valueEn={formData.highlightEn}
              valueBn={formData.highlightBn}
              onChangeEn={(v) => handleInputChange('highlightEn', v)}
              onChangeBn={(v) => handleInputChange('highlightBn', v)}
              isTextArea={true}
            />

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Program Image</label>
              {formData.imageUrl && (
                <div className="mb-3 flex items-center gap-2">
                  <img src={formData.imageUrl} alt="preview" className="w-32 h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleInputChange('imageUrl', '')}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
              <ImageUploader
                onFilesSelected={(files) => handleInputChange('image', files[0] || null)}
              />
              {formErrors.image && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} /> {formErrors.image}
                </p>
              )}
            </div>

            {/* Form actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting || loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2"
              >
                {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                disabled={submitting}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Programs list */}
      {programs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center">
          <p className="text-gray-600">No programs yet. Create your first one!</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600">Total: {programs.length} programs</p>
          <div className="space-y-3">
            {programs.map((prog, index) => (
              <div key={prog.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition">
                <GripVertical size={18} className="text-gray-400" />
                {prog.imageUrl && (
                  <img src={prog.imageUrl} alt={prog.titleEn} className="w-24 h-20 object-cover rounded" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{prog.titleEn}</p>
                  <p className="text-sm text-gray-600 truncate">{prog.titleBn}</p>
                  {prog.categoryEn && <p className="text-xs text-blue-600">{prog.categoryEn}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveProgram(prog.id, -1)}
                    disabled={loading || reordering || index === 0}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm disabled:opacity-50 transition inline-flex items-center gap-1"
                    title="Move up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveProgram(prog.id, 1)}
                    disabled={loading || reordering || index === programs.length - 1}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm disabled:opacity-50 transition inline-flex items-center gap-1"
                    title="Move down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editProgram(prog)}
                    disabled={loading || reordering}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm disabled:opacity-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDelete(prog.id)}
                    disabled={loading || reordering}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Program?"
        message="This program will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={loading}
        onConfirm={deleteProgram}
        onCancel={() => setDeleteConfirm({ isOpen: false, programId: null })}
      />

      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  )
}
