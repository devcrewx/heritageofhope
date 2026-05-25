import { useEffect } from 'react'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

/**
 * Toast notification component
 * Auto-dismisses after 4 seconds
 */
export function Toast({ message, type = 'success', onDismiss = () => {} }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  let bgColor = 'bg-green-50'
  let textColor = 'text-green-800'
  let borderColor = 'border-green-200'
  let Icon = CheckCircle

  if (type === 'error') {
    bgColor = 'bg-red-50'
    textColor = 'text-red-800'
    borderColor = 'border-red-200'
    Icon = XCircle
  } else if (type === 'warning') {
    bgColor = 'bg-yellow-50'
    textColor = 'text-yellow-800'
    borderColor = 'border-yellow-200'
    Icon = AlertCircle
  }

  return (
    <div className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 border rounded-lg ${bgColor} ${textColor} ${borderColor} shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

/**
 * Toast container for managing multiple toasts
 */
export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => onDismiss(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}
