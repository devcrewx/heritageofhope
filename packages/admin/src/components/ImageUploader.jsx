import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

/**
 * ImageUploader Component
 * Drag-and-drop or click-to-browse file upload
 * - Accepts: JPG, PNG, WebP
 * - Max size: 5MB per file
 * - Multi-file support
 */
export function ImageUploader({ onFilesSelected, disabled = false, maxFiles = 10 }) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  const acceptedMimes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  function validateFiles(files) {
    const errors = []
    const valid = []

    Array.from(files).forEach((file) => {
      if (!acceptedMimes.includes(file.type)) {
        errors.push(`${file.name}: Invalid format (JPG, PNG, WebP only)`)
      } else if (file.size > maxSize) {
        errors.push(`${file.name}: File too large (max 5MB)`)
      } else {
        valid.push(file)
      }
    })

    return { valid, errors }
  }

  function handleFiles(files) {
    const { valid, errors } = validateFiles(files)

    if (errors.length > 0) {
      alert('Upload errors:\n' + errors.join('\n'))
    }

    if (valid.length > 0) {
      setSelectedFiles([...selectedFiles, ...valid])
      onFilesSelected([...selectedFiles, ...valid])
    }
  }

  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const { files } = e.dataTransfer
    handleFiles(files)
  }

  function handleBrowse() {
    fileInputRef.current?.click()
  }

  function handleFileInput(e) {
    const { files } = e.target
    handleFiles(files)
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function removeFile(index) {
    const updated = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updated)
    onFilesSelected(updated)
  }

  return (
    <div className="space-y-4">
      {/* Drag-drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Drag images here or{' '}
            <button
              type="button"
              onClick={handleBrowse}
              disabled={disabled}
              className="text-blue-600 hover:text-blue-700 font-semibold underline disabled:opacity-50"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-gray-500">JPG, PNG, WebP • Max 5MB each</p>
        </div>
      </div>

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">
            Selected ({selectedFiles.length}):
          </p>
          <div className="space-y-1">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
