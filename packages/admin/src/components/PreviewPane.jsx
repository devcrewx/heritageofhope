import { useState } from 'react'

const PREVIEW_ORIGIN = import.meta.env.VITE_WEB_ORIGIN || 'http://localhost:5173'

const DEVICE_SIZES = {
  desktop: { width: '100%', label: 'Desktop' },
  tablet: { width: '768px', label: 'Tablet' },
  mobile: { width: '390px', label: 'Mobile' },
}

export default function PreviewPane({ page = '/', device = 'desktop', language = 'en', iframeRef }) {
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const deviceSize = DEVICE_SIZES[device] || DEVICE_SIZES.desktop
  const previewUrl = `${PREVIEW_ORIGIN}${page}?preview=1`

  if (loadError) {
    return (
      <div className="preview-pane">
        <div className="preview-error">
          <p>Could not load preview.</p>
          <p className="preview-error-hint">
            Make sure the public site is running at{' '}
            <a href={PREVIEW_ORIGIN} target="_blank" rel="noopener noreferrer">{PREVIEW_ORIGIN}</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="preview-pane">
      <div className="preview-pane-inner" style={{ maxWidth: deviceSize.width }}>
        {!loaded && (
          <div className="preview-loading">
            <div className="preview-loading-spinner" />
            <p>Loading preview...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={previewUrl}
          lang={language}
          title={`Preview — ${page}`}
          onLoad={() => { setLoaded(true); setLoadError(false) }}
          onError={() => setLoadError(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.2s' }}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  )
}
