import { useEffect, useRef } from 'react'

export default function DocumentModal({ open, onClose, title, src, type = 'pdf' }) {
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    if (contentRef.current) contentRef.current.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (prev && prev.focus) prev.focus()
    }
  }, [open, onClose])

  if (!open) return null

  function onOutside(e) {
    if (overlayRef.current && e.target === overlayRef.current) onClose()
  }

  return (
    <div className="doc-modal-overlay" ref={overlayRef} onMouseDown={onOutside} role="dialog" aria-modal="true" aria-label={title}>
      <div className="doc-modal" ref={contentRef} tabIndex={-1}>
        <button className="doc-modal-close" aria-label="Close document" onClick={onClose}>&times;</button>
        <div className="doc-modal-body">
          <h3 className="doc-modal-title">{title}</h3>
          <div className="doc-modal-inner">
            {type === 'image' ? (
              <img src={src} alt={title} />
            ) : (
              <iframe src={src} title={title} frameBorder="0" />
            )}
          </div>
          <div className="doc-modal-actions">
            <a className="btn" href={src} download target="_blank" rel="noopener noreferrer">Download</a>
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
