import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import apiClient from '../lib/api'
import { Toast } from '../components/Toast'

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters', 'error')
      return
    }

    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match', 'error')
      return
    }

    try {
      setSaving(true)
      await apiClient.post('/api/admin/users/change-password', {
        currentPassword,
        newPassword,
      })

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showToast('Password changed successfully', 'success')
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to change password', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Change Password</h1>
        <p className="text-gray-600">Update the password for the currently signed-in admin account.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-5">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-900 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent((value) => !value)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
              aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-900 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew((value) => !value)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
              aria-label={showNew ? 'Hide new password' : 'Show new password'}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((value) => !value)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
              aria-label={showConfirm ? 'Hide confirmation password' : 'Show confirmation password'}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="rounded-md bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <Lock size={18} className="mt-0.5 text-slate-500 flex-shrink-0" />
            <p>The new password must be at least 8 characters. You will stay signed in after updating it.</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-gray-500">Use a unique password that is not shared anywhere else.</p>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Password'}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </section>
  )
}

export default ChangePassword