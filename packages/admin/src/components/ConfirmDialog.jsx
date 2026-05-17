import React from 'react'
import { AlertCircle, Loader } from 'lucide-react'

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-start gap-4">
          <div className={`pt-1 ${isDangerous ? 'text-red-500' : 'text-blue-500'}`}>
            <AlertCircle size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50 ${
              isDangerous
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading && <Loader size={16} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
