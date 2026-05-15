import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from 'lucide-react'
import apiClient from '../lib/api'
import { Toast } from '../components/Toast'
import { ImageUploader } from '../components/ImageUploader'
import BilingualField from '../components/BilingualField'

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
  const [toast, setToast] = useState(null)

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

  // Upload new images
  async function handleUpload() {
    if (files.length === 0) {
      showToast('Please select at least one image', 'error')
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
  }

  // Save edit
  async function handleSaveEdit(itemId) {
    try {
      const response = await apiClient.patch(`/api/admin/gallery/${itemId}`, editForm)
      setGalleryItems(
        galleryItems.map((item) =>
          item.id === itemId ? response.data.item : item
        )
      )
      setEditingId(null)
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

  // Delete item
  async function handleDelete(itemId) {
    if (!confirm('Delete this photo?')) return

    try {
      await apiClient.delete(`/api/admin/gallery/${itemId}`)
      setGalleryItems(galleryItems.filter((item) => item.id !== itemId))
      showToast('Photo deleted', 'success')
    } catch (error) {
      showToast('Failed to delete photo', 'error')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading gallery...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Manager</h1>
      <p className="text-gray-600 mb-6">Upload and manage gallery photos</p>

      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Photos</h2>

        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Category</label>
            <input
              type="text"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Alt Text EN</label>
            <input
              type="text"
              value={uploadAltEn}
              onChange={(e) => setUploadAltEn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Alt Text BN</label>
            <input
              type="text"
              value={uploadAltBn}
              onChange={(e) => setUploadAltBn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
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
                            onChange={(e) =>
                              setEditForm({ ...editForm, category: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>

                        <BilingualField
                          label="Alt Text"
                          enValue={editForm.altEn}
                          bnValue={editForm.altBn}
                          onEnChange={(v) => setEditForm({ ...editForm, altEn: v })}
                          onBnChange={(v) => setEditForm({ ...editForm, altBn: v })}
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
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  )
}
