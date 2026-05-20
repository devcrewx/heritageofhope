import React, { useState, useEffect } from 'react'
import { Trash2, Upload, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react'
import apiClient from '../lib/api'
import { Toast } from '../components/Toast'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function TeamEditor() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, memberId: null })
  const [formData, setFormData] = useState({
    name: '',
    roleEn: '',
    roleBn: '',
    file: null
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    loadMembers()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const loadMembers = async () => {
    try {
      setInitialLoading(true)
      setError(null)
      const response = await apiClient.get('/api/admin/team')
      setMembers(response.data)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to load team members'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setInitialLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Member name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    } else if (formData.name.length > 100) {
      errors.name = 'Name must be at most 100 characters'
    }

    if (formData.roleEn && formData.roleEn.length > 100) {
      errors.roleEn = 'Role (English) must be at most 100 characters'
    }

    if (formData.roleBn && formData.roleBn.length > 100) {
      errors.roleBn = 'Role (Bengali) must be at most 100 characters'
    }

    return errors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    setFormErrors((prev) => {
      if (prev[name]) {
        return { ...prev, [name]: '' }
      }
      return prev
    })
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }))
  }

  const resetForm = () => {
    setFormData({ name: '', roleEn: '', roleBn: '', file: null })
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
      data.append('roleEn', formData.roleEn)
      data.append('roleBn', formData.roleBn)
      if (formData.file) {
        data.append('file', formData.file)
      }

      if (editingId) {
        await apiClient.patch(`/api/admin/team/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await apiClient.post('/api/admin/team', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      resetForm()
      showToast(editingId ? 'Member updated successfully' : 'Member added successfully', 'success')
      await loadMembers()
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to save team member'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (member) => {
    setEditingId(member.id)
    setFormData({
      name: member.name,
      roleEn: member.roleEn || '',
      roleBn: member.roleBn || '',
      file: null
    })
    setFormErrors({})
    setError(null)
  }

  const confirmDelete = (memberId) => {
    setDeleteConfirm({ isOpen: true, memberId })
  }

  const handleDelete = async () => {
    const { memberId } = deleteConfirm
    if (!memberId) return

    try {
      setLoading(true)
      await apiClient.delete(`/api/admin/team/${memberId}`)
      showToast('Member deleted successfully', 'success')
      setDeleteConfirm({ isOpen: false, memberId: null })
      await loadMembers()
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete team member'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const moveMember = async (id, direction) => {
    const index = members.findIndex(m => m.id === id)
    if (index === -1) return

    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === members.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updatedMembers = [...members]
    ;[updatedMembers[index], updatedMembers[newIndex]] = [
      updatedMembers[newIndex],
      updatedMembers[index]
    ]

    try {
      setLoading(true)
      await apiClient.patch('/api/admin/team/reorder', {
        members: updatedMembers.map((m, i) => ({
          id: m.id,
          sortOrder: i
        }))
      })
      setMembers(updatedMembers)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to reorder team members'
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <LoadingSpinner fullPage text="Loading team members..." />
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Team Members</h1>

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
          {editingId ? 'Edit Team Member' : 'Add Team Member'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Dr. Sharma"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role (English)</label>
              <input
                type="text"
                name="roleEn"
                value={formData.roleEn}
                onChange={handleInputChange}
                placeholder="e.g., Founder & Director"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.roleEn 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.roleEn && (
                <p className="text-red-500 text-sm mt-1">{formErrors.roleEn}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role (Bengali)</label>
              <input
                type="text"
                name="roleBn"
                value={formData.roleBn}
                onChange={handleInputChange}
                placeholder="যেমন, প্রতিষ্ঠাতা ও পরিচালক"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.roleBn 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.roleBn && (
                <p className="text-red-500 text-sm mt-1">{formErrors.roleBn}</p>
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
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            disabled={submitting || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {submitting ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}
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

      {/* Team List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold mb-4">
          Team Members ({members.length})
        </h2>
        {members.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">No team members yet. Add one using the form above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex flex-col items-center text-center mb-4">
                  {member.photoUrl && (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover bg-gray-100 mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  {member.roleEn && (
                    <p className="text-sm text-gray-600">{member.roleEn}</p>
                  )}
                  {member.roleBn && (
                    <p className="text-sm text-gray-600">{member.roleBn}</p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => moveMember(member.id, 'up')}
                    disabled={index === 0 || loading}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition"
                    title="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => moveMember(member.id, 'down')}
                    disabled={index === members.length - 1 || loading}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition"
                    title="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(member)}
                    disabled={loading}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(member.id)}
                    disabled={loading}
                    className="p-2 text-red-500 hover:text-red-700 disabled:opacity-30 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Team Member?"
        message="This team member will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, memberId: null })}
      />

      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  )
}


