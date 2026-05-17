import React, { useState, useEffect } from 'react'
import { Trash2, Upload, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react'
import apiClient from '../lib/api'
import { Toast } from '../components/Toast'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function PartnersEditor() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, partnerId: null })
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    file: null
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    loadPartners()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const loadPartners = async () => {
    try {
      setInitialLoading(true)
      setError(null)
      const response = await apiClient.get('/api/admin/partners')
      setPartners(response.data)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to load partners'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setInitialLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Partner name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    } else if (formData.name.length > 200) {
      errors.name = 'Name must be at most 200 characters'
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
    setFormData({ name: '', isActive: true, file: null })
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
      data.append('name', formData.name)
      data.append('isActive', formData.isActive)
      if (formData.file) {
        data.append('file', formData.file)
      }

      if (editingId) {
        await apiClient.patch(`/api/admin/partners/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await apiClient.post('/api/admin/partners', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      resetForm()
      showToast(editingId ? 'Partner updated successfully' : 'Partner added successfully', 'success')
      await loadPartners()
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to save partner'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (partner) => {
    setEditingId(partner.id)
    setFormData({
      name: partner.name,
      isActive: partner.isActive,
      file: null
    })
    setFormErrors({})
    setError(null)
  }

  const confirmDelete = (partnerId) => {
    setDeleteConfirm({ isOpen: true, partnerId })
  }

  const handleDelete = async () => {
    const { partnerId } = deleteConfirm
    if (!partnerId) return

    try {
      setLoading(true)
      await apiClient.delete(`/api/admin/partners/${partnerId}`)
      showToast('Partner deleted successfully', 'success')
      setDeleteConfirm({ isOpen: false, partnerId: null })
      await loadPartners()
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete partner'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const movePartner = async (id, direction) => {
    const index = partners.findIndex(p => p.id === id)
    if (index === -1) return

    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === partners.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updatedPartners = [...partners]
    ;[updatedPartners[index], updatedPartners[newIndex]] = [
      updatedPartners[newIndex],
      updatedPartners[index]
    ]

    try {
      setLoading(true)
      await apiClient.patch('/api/admin/partners/reorder', {
        partners: updatedPartners.map((p, i) => ({
          id: p.id,
          sortOrder: i
        }))
      })
      setPartners(updatedPartners)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to reorder partners'
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <LoadingSpinner fullPage text="Loading partners..." />
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Partners</h1>

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
          {editingId ? 'Edit Partner' : 'Add Partner'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Partner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Global Health Initiative"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                formErrors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {formErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Logo</label>
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
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current logo</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              id="isActive"
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium">
              Active (show on public site)
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
            {submitting ? 'Saving...' : editingId ? 'Update Partner' : 'Add Partner'}
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

      {/* Partners List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold mb-4">
          Partners ({partners.length})
        </h2>
        {partners.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">No partners yet. Add one using the form above.</p>
          </div>
        ) : (
          partners.map((partner, index) => (
            <div
              key={partner.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                {partner.logoUrl && (
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="w-12 h-12 object-cover rounded bg-gray-100"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{partner.name}</p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>{partner.isActive ? '✓ Active' : '⊘ Inactive'}</span>
                    {partner.logoUrl && (
                      <a
                        href={partner.logoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => movePartner(partner.id, 'up')}
                  disabled={index === 0 || loading}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition"
                  title="Move up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => movePartner(partner.id, 'down')}
                  disabled={index === partners.length - 1 || loading}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition"
                  title="Move down"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  onClick={() => handleEdit(partner)}
                  disabled={loading}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(partner.id)}
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
        title="Delete Partner?"
        message="This partner will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, partnerId: null })}
      />

      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  )
}
