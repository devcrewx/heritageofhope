export default function PreviewToolbar({
  device, setDevice,
  language, setLanguage,
  previewPage,
  iframeRef,
  hasUnsavedChanges = true,
}) {
  const WEB_ORIGIN = import.meta.env.VITE_WEB_ORIGIN || 'http://localhost:5173'

  function sendLanguage(lang) {
    setLanguage(lang)
    iframeRef?.current?.contentWindow?.postMessage(
      { type: 'PREVIEW_LANGUAGE', payload: { language: lang } },
      WEB_ORIGIN,
    )
  }

  return (
    <div className="preview-toolbar" role="toolbar" aria-label="Preview controls">
      {hasUnsavedChanges && (
        <span className="preview-unsaved-badge">● Live Preview</span>
      )}

      <div className="preview-toolbar-group" role="group" aria-label="Switch language">
        <button
          className={`preview-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => sendLanguage('en')}
          aria-pressed={language === 'en'}
        >EN</button>
        <button
          className={`preview-btn ${language === 'bn' ? 'active' : ''}`}
          onClick={() => sendLanguage('bn')}
          aria-pressed={language === 'bn'}
        >বাংলা</button>
      </div>

      <div className="preview-toolbar-group" role="group" aria-label="Preview device size">
        {['desktop', 'tablet', 'mobile'].map((d) => (
          <button
            key={d}
            className={`preview-btn ${device === d ? 'active' : ''}`}
            onClick={() => setDevice(d)}
            aria-pressed={device === d}
          >
            {d}
          </button>
        ))}
      </div>

      <a
        className="preview-btn preview-btn-open"
        href={`${WEB_ORIGIN}${previewPage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${previewPage} in new tab`}
      >
        ↗ Open live site
      </a>
    </div>
  )
}
