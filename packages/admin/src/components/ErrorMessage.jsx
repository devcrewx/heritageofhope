import React from 'react'
import { AlertCircle, X } from 'lucide-react'

export function ErrorMessage({ error, onClose, className = '' }) {
  if (!error) return null

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 ${className}`}>
      <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <p className="text-red-800 font-medium">Error</p>
        <p className="text-red-700 text-sm mt-1">
          {typeof error === 'string' ? error : error.message || 'Something went wrong'}
        </p>
        {error.errors && Array.isArray(error.errors) && (
          <ul className="text-red-700 text-sm mt-2 space-y-1 list-disc list-inside">
            {error.errors.map((err, idx) => (
              <li key={idx}>
                <strong>{err.field}:</strong> {err.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-700 flex-shrink-0"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
