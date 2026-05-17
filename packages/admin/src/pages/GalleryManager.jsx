import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, GripVertical, Trash2, AlertCircle } from 'lucide-react'
import apiClient from '../lib/api'
import { Toast } from '../components/Toast'
import { ImageUploader } from '../components/ImageUploader'
import BilingualField from '../components/BilingualField'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function GalleryManager() {
  const [galleryItems, setGalleryItems] = useState([])
  const [files, setFiles] = useState([])
  const [uploadCategory, setUploadCategory] = useState('gallery')
  const [uploadAltEn, setUploadAltEn] = useState('Gallery photo')
  const [uploadAltBn, setUploadAltBn] = useState('গ্যালারি ফটো')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null })

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  // Fetch existing gallery items
  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await apiClient.get('/api/admin/gallery')
        setGalleryItems(response.data.items || [])
      } catch (error) {
        showToast('Failed to load gallery', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadGallery()
  }, [])

  // Handle file selection
  function handleFilesSelected(selectedFiles) {
    setFiles(selectedFiles)
  }

  function validateUploadForm() {
    const errors = {}

    if (!uploadCategory.trim()) {
      errors.uploadCategory = 'Category is required'
    }

    if (!uploadAltEn.trim()) {
      errors.uploadAltEn = 'English alt text is required'
    } else if (uploadAltEn.length > 200) {
      errors.uploadAltEn = 'English alt text must be at most 200 characters'
    }

    if (uploadAltBn.length > 200) {
      errors.uploadAltBn = 'Bengali alt text must be at most 200 characters'
    }

    return errors
  }

  function validateEditForm() {
    const errors = {}

    if (!editForm.category?.trim()) {
      errors.category = 'Category is required'
    }

    if (editForm.altEn && editForm.altEn.length > 200) {
      errors.altEn = 'English alt text must be at most 200 characters'
    }

    if (editForm.altBn && editForm.altBn.length > 200) {
      errors.altBn = 'Bengali alt text must be at most 200 characters'
    }

    return errors
  }

  // Upload new images
  async function handleUpload() {
    if (files.length === 0) {
      showToast('Please select at least one image', 'error')
      return
    }

    const validationErrors = validateUploadForm()
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors)
      showToast('Please fix validation errors', 'error')
      return
    }

    setUploading(true)
    const formData = new FormData()

    files.forEach((file) => {
      formData.append('files', file)
    })

    formData.append('category', uploadCategory)
    formData.append('altEn', uploadAltEn)
    formData.append('altBn', uploadAltBn)

    try {
      const response = await apiClient.post('/api/admin/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setGalleryItems((current) => [...(response.data.uploaded || []), ...current])
      setFiles([])
      setUploadCategory('gallery')
      setUploadAltEn('Gallery photo')
      setUploadAltBn('গ্যালারি ফটো')
      setFormErrors({})
      showToast(`Uploaded ${response.data.count} image(s)`, 'success')
    } catch (error) {
      showToast(error.response?.data?.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  // Start editing item
  function startEdit(item) {
    setEditingId(item.id)
    setEditForm({
      altEn: item.altEn || '',
      altBn: item.altBn || '',
      category: item.category || 'gallery',
    })
    setFormErrors({})
  }

  // Save edit
  async function handleSaveEdit(itemId) {
    const validationErrors = validateEditForm()
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors)
      showToast('Please fix validation errors', 'error')
      return
    }

    try {
      const response = await apiClient.patch(`/api/admin/gallery/${itemId}`, editForm)
      setGalleryItems(
        galleryItems.map((item) =>
          item.id === itemId ? response.data.item : item
        )
      )
      setEditingId(null)
      setFormErrors({})
      showToast('Photo updated', 'success')
    } catch (error) {
      showToast('Failed to update photo', 'error')
    }
  }

  async function handleMove(itemId, direction) {
    const currentIndex = galleryItems.findIndex((item) => item.id === itemId)
    const targetIndex = currentIndex + direction

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= galleryItems.length) {
      return
    }

    const nextItems = [...galleryItems]
    const [movedItem] = nextItems.splice(currentIndex, 1)
    nextItems.splice(targetIndex, 0, movedItem)

    const reordered = nextItems.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }))

    setGalleryItems(nextItems)

    try {
      await apiClient.patch('/api/admin/gallery/reorder', { items: reordered })
      showToast('Gallery order updated', 'success')
    } catch (error) {
      showToast('Failed to update order', 'error')
    }
  }

  // Delete item with confirmation
  const confirmDelete = (itemId) => {
    setDeleteConfirm({ isOpen: true, itemId })
  }

  async function handleDelete() {
    const { itemId } = deleteConfirm
    if (!itemId) return

    try {
      setLoading(true)
      await apiClient.delete(`/api/admin/gallery/${itemId}`)
      setGalleryItems(galleryItems.filter((item) => item.id !== itemId))
      setDeleteConfirm({ isOpen: false, itemId: null })
      showToast('Photo deleted successfully', 'success')
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to delete photo'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullPage text="Loading gallery..." />
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Manager</h1>
      <p className="text-gray-600 mb-6">Upload and manage gallery photos</p>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          error={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Photos</h2>

        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Category</label>
            <input
              type="text"
              value={uploadCategory}
              onChange={(e) => {
                setUploadCategory(e.target.value)
                if (formErrors.uploadCategory) {
                  setFormErrors((prev) => ({ ...prev, uploadCategory: '' }))
                }
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm ${
                formErrors.uploadCategory ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.uploadCategory && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {formErrors.uploadCategory}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Alt Text EN</label>
            <input
              type="text"
              value={uploadAltEn}
              onChange={(e) => {
                setUploadAltEn(e.target.value)
                if (formErrors.uploadAltEn) {
                  setFormErrors((prev) => ({ ...prev, uploadAltEn: '' }))
                }
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm ${
                formErrors.uploadAltEn ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.uploadAltEn && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {formErrors.uploadAltEn}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Alt Text BN</label>
            <input
              type="text"
              value={uploadAltBn}
              onChange={(e) => {
                setUploadAltBn(e.target.value)
                if (formErrors.uploadAltBn) {
                  setFormErrors((prev) => ({ ...prev, uploadAltBn: '' }))
                }
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm ${
                formErrors.uploadAltBn ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.uploadAltBn && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {formErrors.uploadAltBn}
              </p>
            )}
          </div>
        </div>

        <ImageUploader onFilesSelected={handleFilesSelected} disabled={uploading} />

        {files.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} Image(s)`}
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Photos ({galleryItems.length})
        </h2>

        {galleryItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No photos yet. Upload some to get started!</p>
        ) : (
          <div className="grid gap-4">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {editingId === item.id ? (
                  // Edit mode
                  <div className="p-4 space-y-4">
                    <div className="flex gap-4">
                      <img
                        src={item.url}
                        alt={item.altEn}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            value={editForm.category}
                            onChange={(e) => {
                              setEditForm({ ...editForm, category: e.target.value })
                              if (formErrors.category) {
                                setFormErrors((prev) => ({ ...prev, category: '' }))
                              }
                            }}
                            className={`w-full px-3 py-2 border rounded-lg text-sm ${
                              formErrors.category ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.category && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> {formErrors.category}
                            </p>
                          )}
                        </div>

                        <BilingualField
                          labelEn="Alt Text (EN)"
                          labelBn="Alt Text (BN)"
                          valueEn={editForm.altEn}
                          valueBn={editForm.altBn}
                          onChangeEn={(v) => setEditForm({ ...editForm, altEn: v })}
                          onChangeBn={(v) => setEditForm({ ...editForm, altBn: v })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="p-4 flex gap-4">
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <GripVertical className="w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => handleMove(item.id, -1)}
                        className="rounded p-1 hover:bg-gray-50 disabled:opacity-30"
                        disabled={galleryItems[0]?.id === item.id}
                        aria-label="Move photo up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(item.id, 1)}
                        className="rounded p-1 hover:bg-gray-50 disabled:opacity-30"
                        disabled={galleryItems[galleryItems.length - 1]?.id === item.id}
                        aria-label="Move photo down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    <img
                      src={item.url}
                      alt={item.altEn}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 truncate">
                        {item.altEn || 'No alt text'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {item.altBn || 'কোনো আল্ট টেক্সট নেই'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Category: <span className="font-medium">{item.category}</span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Photo?"
        message="This photo will be permanently deleted and removed from Cloudinary. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  )
}
