import React, { useState, useEffect, useRef, useContext } from 'react'
import { Trash2, Upload, ChevronUp, ChevronDown, Eye, EyeOff, AlertCircle } from 'lucide-react'
import apiClient from '../lib/api'
import { Toast } from '../components/Toast'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import SplitLayout from '../components/SplitLayout'
import { usePreviewSync } from '../hooks/usePreviewSync'
import { SiteContentContext } from '../App'

export default function ActivityPostsEditor() {
  const iframeRef = useRef(null)
  const fullContent = useContext(SiteContentContext)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [, setInitialLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, postId: null })
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    titleEn: '',
    titleBn: '',
    bodyEn: '',
    bodyBn: '',
    isPublished: true,
    file: null
  })
  const [formErrors, setFormErrors] = useState({})

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const loadPosts = async () => {
    try {
      setInitialLoading(true)
      setError(null)
      const response = await apiClient.get('/api/admin/activity-posts')
      setPosts(response.data)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to load activity posts'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.date) {
      errors.date = 'Date is required'
    }

    if (!formData.titleEn.trim()) {
      errors.titleEn = 'English title is required'
    } else if (formData.titleEn.trim().length < 3) {
      errors.titleEn = 'English title must be at least 3 characters'
    } else if (formData.titleEn.length > 150) {
      errors.titleEn = 'English title must be at most 150 characters'
    }

    if (formData.titleBn && formData.titleBn.length > 150) {
      errors.titleBn = 'Bengali title must be at most 150 characters'
    }

    if (formData.bodyEn && formData.bodyEn.length > 2000) {
      errors.bodyEn = 'English body must be at most 2000 characters'
    }

    if (formData.bodyBn && formData.bodyBn.length > 2000) {
      errors.bodyBn = 'Bengali body must be at most 2000 characters'
    }

    return errors
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }))
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      titleEn: '',
      titleBn: '',
      bodyEn: '',
      bodyBn: '',
      isPublished: true,
      file: null
    })
    setEditingId(null)
    setFormErrors({})
  }

  const handleSubmit = async (e) => {
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
      const data = new FormData()
      data.append('date', formData.date)
      data.append('titleEn', formData.titleEn)
      data.append('titleBn', formData.titleBn)
      data.append('bodyEn', formData.bodyEn)
      data.append('bodyBn', formData.bodyBn)
      data.append('isPublished', formData.isPublished)
      if (formData.file) {
        data.append('file', formData.file)
      }

      if (editingId) {
        await apiClient.patch(`/api/admin/activity-posts/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await apiClient.post('/api/admin/activity-posts', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      resetForm()
      showToast(editingId ? 'Post updated successfully' : 'Post created successfully', 'success')
      await loadPosts()
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to save activity post'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (post) => {
    setEditingId(post.id)
    setFormData({
      date: post.date.split('T')[0],
      titleEn: post.titleEn,
      titleBn: post.titleBn || '',
      bodyEn: post.bodyEn || '',
      bodyBn: post.bodyBn || '',
      isPublished: post.isPublished,
      file: null
    })
    setFormErrors({})
    setError(null)
  }

  const confirmDelete = (postId) => {
    setDeleteConfirm({ isOpen: true, postId })
  }

  const handleDelete = async () => {
    const { postId } = deleteConfirm
    if (!postId) return

    try {
      setLoading(true)
      await apiClient.delete(`/api/admin/activity-posts/${postId}`)
      showToast('Post deleted successfully', 'success')
      setDeleteConfirm({ isOpen: false, postId: null })
      await loadPosts()
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete activity post'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const movePost = async (id, direction) => {
    const index = posts.findIndex(p => p.id === id)
    if (index === -1) return

    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === posts.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updatedPosts = [...posts]
    ;[updatedPosts[index], updatedPosts[newIndex]] = [
      updatedPosts[newIndex],
      updatedPosts[index]
    ]

    try {
      setLoading(true)
      await apiClient.patch('/api/admin/activity-posts/reorder', {
        posts: updatedPosts.map((p, i) => ({
          id: p.id,
          sortOrder: i
        }))
      })
      setPosts(updatedPosts)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to reorder posts'
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }



  const draft = {
    facebookPosts: posts.map(p => ({
      date: p.date,
      image: p.photoUrl || '',
      title: { en: p.titleEn, bn: p.titleBn || '' },
      excerpt: { en: p.bodyEn, bn: p.bodyBn || '' },
    })),
  }
  usePreviewSync(iframeRef, draft, 'home', fullContent)

  return (
    <SplitLayout previewPage="/" iframeRef={iframeRef}>
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Activity Posts</h1>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          error={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Post' : 'Create New Post'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                formErrors.date 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {formErrors.date && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {formErrors.date}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Title (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleInputChange}
                placeholder="e.g., Summer camp begins"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
              <label className="block text-sm font-medium mb-1">Title (Bengali)</label>
              <input
                type="text"
                name="titleBn"
                value={formData.titleBn}
                onChange={handleInputChange}
                placeholder="যেমন, গ্রীষ্মকালীন শিবির শুরু"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Body (English)</label>
              <textarea
                name="bodyEn"
                value={formData.bodyEn}
                onChange={handleInputChange}
                placeholder="Event details..."
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.bodyEn 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.bodyEn && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {formErrors.bodyEn}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Body (Bengali)</label>
              <textarea
                name="bodyBn"
                value={formData.bodyBn}
                onChange={handleInputChange}
                placeholder="ইভেন্ট বিবরণ..."
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.bodyBn 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.bodyBn && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {formErrors.bodyBn}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Photo</label>
            <div className="flex items-center gap-3">
              <Upload size={20} className="text-gray-400" />
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                accept="image/*"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            {formData.file && (
              <p className="text-sm text-green-600 mt-1">✓ {formData.file.name}</p>
            )}
            {editingId && !formData.file && (
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current photo</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleInputChange}
              id="isPublished"
              className="w-4 h-4"
            />
            <label htmlFor="isPublished" className="ml-2 text-sm font-medium">
              Published (visible on public site)
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            disabled={submitting || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {submitting ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Posts List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold mb-4">
          Posts ({posts.length})
        </h2>
        {posts.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">No activity posts yet. Create one using the form above.</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex gap-4">
                {post.photoUrl && (
                  <img
                    src={post.photoUrl}
                    alt={post.titleEn}
                    className="w-20 h-20 object-cover rounded bg-gray-100"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <h3 className="font-semibold text-lg">{post.titleEn}</h3>
                      {post.titleBn && (
                        <p className="text-sm text-gray-600">{post.titleBn}</p>
                      )}
                      {post.bodyEn && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {post.bodyEn}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {post.isPublished ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <Eye size={14} /> Published
                        </span>
                      ) : (
                        <span className="text-gray-500 flex items-center gap-1">
                          <EyeOff size={14} /> Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => movePost(post.id, 'up')}
                  disabled={index === 0 || loading}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition"
                  title="Move up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => movePost(post.id, 'down')}
                  disabled={index === posts.length - 1 || loading}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition"
                  title="Move down"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  disabled={loading}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(post.id)}
                  disabled={loading}
                  className="p-2 text-red-500 hover:text-red-700 disabled:opacity-30 transition"
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
        title="Delete Activity Post?"
        message="This post will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, postId: null })}
      />

      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
    </SplitLayout>
  )
}
