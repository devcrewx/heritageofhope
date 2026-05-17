import { useRef, useState } from 'react'

function MediaUploadField({
  label,
  helperText,
  currentUrl,
  currentAlt,
  onUpload,
  onDelete,
  uploading = false,
  accept = 'image/*',
  previewClassName = 'h-48 w-full',
}) {
  const inputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)

  async function handleUpload() {
    if (!selectedFile) {
      return
    }

    await onUpload(selectedFile)
    setSelectedFile(null)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{label}</h3>
        {helperText ? <p className="mt-1 text-sm text-slate-500">{helperText}</p> : null}
      </div>

      {currentUrl ? (
        <figure className="space-y-2">
          <img
            src={currentUrl}
            alt={currentAlt || label}
            className={`rounded-lg border border-slate-200 object-cover ${previewClassName}`}
          />
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={uploading}
              className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              Remove current image
            </button>
          ) : null}
        </figure>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          No image uploaded yet.
        </div>
      )}

      <div className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          disabled={uploading}
          className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 disabled:opacity-50"
        />
        {selectedFile ? <p className="text-sm text-slate-600">Selected: {selectedFile.name}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : currentUrl ? 'Replace image' : 'Upload image'}
          </button>
          {selectedFile ? (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null)
                if (inputRef.current) {
                  inputRef.current.value = ''
                }
              }}
              disabled={uploading}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear selection
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default MediaUploadField