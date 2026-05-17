import React from 'react'
import { Loader } from 'lucide-react'

export function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  fullPage = false,
  className = '' 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-40">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
