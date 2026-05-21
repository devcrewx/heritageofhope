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
  const [pageContent, setPageContent] = useState({
    eyebrow: { en: '', bn: '' },
    heading: { en: '', bn: '' },
    intro: { en: '', bn: '' },
    filterLabel: { en: '', bn: '' },
    filterText: { en: '', bn: '' },
    filterChipAll: { en: 'All', bn: 'সব' },
    filterChipEducation: { en: 'Education', bn: 'শিক্ষা' },
    filterChipHealthcare: { en: 'Healthcare', bn: 'স্বাস্থ্য' },
    filterChipWelfare: { en: 'Welfare', bn: 'কল্যাণ' },
    filterAriaLabel: { en: 'Gallery categories', bn: 'ছবির বিভাগ' },
  })
  const [pageContentLoading, setPageContentLoading] = useState(true)
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
        const [galleryResponse, contentResponse] = await Promise.all([
          apiClient.get('/api/admin/gallery'),
          apiClient.get('/api/admin/content/gallery'),
        ])
        setGalleryItems(galleryResponse.data.items || [])
        if (contentResponse.data?.sections?.pageContent) {
          const p = contentResponse.data.sections.pageContent
          setPageContent({
            eyebrow: p.eyebrow || { en: '', bn: '' },
            heading: p.heading || { en: '', bn: '' },
            intro: p.intro || { en: '', bn: '' },
            filterLabel: p.filterLabel || { en: '', bn: '' },
            filterText: p.filterText || { en: '', bn: '' },
            filterChipAll: p.filterChipAll || { en: 'All', bn: 'সব' },
            filterChipEducation: p.filterChipEducation || { en: 'Education', bn: 'শিক্ষা' },
            filterChipHealthcare: p.filterChipHealthcare || { en: 'Healthcare', bn: 'স্বাস্থ্য' },
            filterChipWelfare: p.filterChipWelfare || { en: 'Welfare', bn: 'কল্যাণ' },
            filterAriaLabel: p.filterAriaLabel || { en: 'Gallery categories', bn: 'ছবির বিভাগ' },
          })
        }
      } catch (error) {
        showToast('Failed to load gallery', 'error')
      } finally {
        setLoading(false)
        setPageContentLoading(false)
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
      <p className="text-gray-600 mb-4">Upload and manage gallery photos</p>

      {/* Page Content Section */}
      {!pageContentLoading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Content</h2>
          <p className="text-sm text-gray-500 mb-4">Edit the Gallery page text content. These fields replace the hardcoded text on the public page.</p>
          <div className="space-y-4">
            <BilingualField labelEn="Page Eyebrow" labelBn="Page Eyebrow (Bangla)" valueEn={pageContent.eyebrow.en} valueBn={pageContent.eyebrow.bn} onChangeEn={(v) => setPageContent((p) => ({ ...p, eyebrow: { ...p.eyebrow, en: v } }))} onChangeBn={(v) => setPageContent((p) => ({ ...p, eyebrow: { ...p.eyebrow, bn: v } }))} />
            <BilingualField labelEn="Page Heading" labelBn="Page Heading (Bangla)" valueEn={pageContent.heading.en} valueBn={pageContent.heading.bn} onChangeEn={(v) => setPageContent((p) => ({ ...p, heading: { ...p.heading, en: v } }))} onChangeBn={(v) => setPageContent((p) => ({ ...p, heading: { ...p.heading, bn: v } }))} isTextArea />
            <BilingualField labelEn="Page Intro" labelBn="Page Intro (Bangla)" valueEn={pageContent.intro.en} valueBn={pageContent.intro.bn} onChangeEn={(v) => setPageContent((p) => ({ ...p, intro: { ...p.intro, en: v } }))} onChangeBn={(v) => setPageContent((p) => ({ ...p, intro: { ...p.intro, bn: v } }))} isTextArea />
            <BilingualField labelEn="Filter Section Label" labelBn="Filter Section Label (Bangla)" valueEn={pageContent.filterLabel.en} valueBn={pageContent.filterLabel.bn} onChangeEn={(v) => setPageContent((p) => ({ ...p, filterLabel: { ...p.filterLabel, en: v } }))} onChangeBn={(v) => setPageContent((p) => ({ ...p, filterLabel: { ...p.filterLabel, bn: v } }))} />
            <BilingualField labelEn="Filter Section Text" labelBn="Filter Section Text (Bangla)" valueEn={pageContent.filterText.en} valueBn={pageContent.filterText.bn} onChangeEn={(v) => setPageContent((p) => ({ ...p, filterText: { ...p.filterText, en: v } }))} onChangeBn={(v) => setPageContent((p) => ({ ...p, filterText: { ...p.filterText, bn: v } }))} />
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter Chip Labels</h3>
              <div className="grid grid-cols-2 gap-4">
                <BilingualField labelEn="All" labelBn="সব" valueEn={pageContent.filterChipAll.en} valueBn={pageContent.filterChipAll.bn} onChangeEn={(v) => setPageContent((p) => ({ ...p, filterChipAll: { ...p.filterChipAll, en: v } }))} onChangeBn={(v) => setPageContent((p) => ({ ...p, filterChipAll: { ...p.filterChipAll, bn: v } }))} />
                <BilingualField labelEn="Education" labelBn="শিক্ষা" valueEn={pageContent.filterChipEducation.en} valueBn={pageContent.filterChipEducation.bn} onChangeEn={(v) => setPageContent((p) => ({ ...p, filterChipEducation: { ...p.filterChipEducation, en: v } }))} onChangeBn={(v) => setPageContent((p) => ({ ...p, filterChipEducation: { ...p.filterChipEducation, bn: v } }))} />
                <BilingualField labelEn="Healthcare" labelBn="স্বাস্থ্য" valueEn={pageContent.filterChipHealthcare.en} valueBn={pageContent.filterChipHealthcare.bn} onChangeEn={(v) => setPageContent((p) => ({ ...p, filterChipHealthcare: { ...p.filterChipHealthcare, en: v } }))} onChangeBn={(v) => setPageContent((p) => ({ ...p, filterChipHealthcare: { ...p.filterChipHealthcare, bn: v } }))} />
                <BilingualField labelEn="Welfare" labelBn="কল্যাণ" valueEn={pageContent.filterChipWelfare.en} valueBn={pageContent.filterChipWelfare.bn} onChangeEn={(v) => setPageContent((p) => ({ ...p, filterChipWelfare: { ...p.filterChipWelfare, en: v } }))} onChangeBn={(v) => setPageContent((p) => ({ ...p, filterChipWelfare: { ...p.filterChipWelfare, bn: v } }))} />
              </div>
            </div>
            <BilingualField labelEn="Filter Row Aria Label" labelBn="ফিল্টার আরিয়া লেবেল" valueEn={pageContent.filterAriaLabel.en} valueBn={pageContent.filterAriaLabel.bn} onChangeEn={(v) => setPageContent((p) => ({ ...p, filterAriaLabel: { ...p.filterAriaLabel, en: v } }))} onChangeBn={(v) => setPageContent((p) => ({ ...p, filterAriaLabel: { ...p.filterAriaLabel, bn: v } }))} />
          </div>
          <button
            onClick={async () => {
              try {
                await Promise.all([
                  apiClient.patch('/api/admin/content/gallery/pageContent/eyebrow', { valueEn: pageContent.eyebrow.en, valueBn: pageContent.eyebrow.bn }),
                  apiClient.patch('/api/admin/content/gallery/pageContent/heading', { valueEn: pageContent.heading.en, valueBn: pageContent.heading.bn }),
                  apiClient.patch('/api/admin/content/gallery/pageContent/intro', { valueEn: pageContent.intro.en, valueBn: pageContent.intro.bn }),
                  apiClient.patch('/api/admin/content/gallery/pageContent/filterLabel', { valueEn: pageContent.filterLabel.en, valueBn: pageContent.filterLabel.bn }),
                  apiClient.patch('/api/admin/content/gallery/pageContent/filterText', { valueEn: pageContent.filterText.en, valueBn: pageContent.filterText.bn }),
                  apiClient.patch('/api/admin/content/gallery/pageContent/filterChipAll', { valueEn: pageContent.filterChipAll.en, valueBn: pageContent.filterChipAll.bn }),
                  apiClient.patch('/api/admin/content/gallery/pageContent/filterChipEducation', { valueEn: pageContent.filterChipEducation.en, valueBn: pageContent.filterChipEducation.bn }),
                  apiClient.patch('/api/admin/content/gallery/pageContent/filterChipHealthcare', { valueEn: pageContent.filterChipHealthcare.en, valueBn: pageContent.filterChipHealthcare.bn }),
                  apiClient.patch('/api/admin/content/gallery/pageContent/filterChipWelfare', { valueEn: pageContent.filterChipWelfare.en, valueBn: pageContent.filterChipWelfare.bn }),
                  apiClient.patch('/api/admin/content/gallery/pageContent/filterAriaLabel', { valueEn: pageContent.filterAriaLabel.en, valueBn: pageContent.filterAriaLabel.bn }),
                ])
                showToast('Page content saved', 'success')
              } catch {
                showToast('Failed to save page content', 'error')
              }
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Save Page Content
          </button>
        </div>
      )}

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
