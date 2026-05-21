import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function DocumentModal({ open, onClose, title, type = 'pdf', onNext, onPrev, hasNext, hasPrev, thumbUrl, downloadUrl, onDownload }) {
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext()
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    if (contentRef.current) contentRef.current.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (prev && prev.focus) prev.focus()
    }
  }, [open, onClose, onNext, onPrev, hasNext, hasPrev])

  if (!open) return null

  function onOutside(e) {
    if (overlayRef.current && e.target === overlayRef.current) onClose()
  }

  const modalContent = (
    <div className="doc-modal-overlay" ref={overlayRef} onMouseDown={onOutside} role="dialog" aria-modal="true" aria-label={title}>
      <div className="doc-modal" ref={contentRef} tabIndex={-1}>
        <button className="doc-modal-close" aria-label="Close document" onClick={onClose}>&times;</button>
        {hasPrev && onPrev && (
          <button className="doc-modal-nav doc-modal-prev" aria-label="Previous document" onClick={onPrev} title="Previous (←)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}
        {hasNext && onNext && (
          <button className="doc-modal-nav doc-modal-next" aria-label="Next document" onClick={onNext} title="Next (→)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
        <div className="doc-modal-body">
          <h3 className="doc-modal-title">{title}</h3>
          <div className="doc-modal-inner">
            {type === 'image' ? (
              <img src={downloadUrl} alt={title} onError={(e) => { e.target.style.display = 'none' }} />
            ) : (
              <div className="doc-pdf-placeholder">
                {thumbUrl && <img className="doc-pdf-thumb" src={thumbUrl} alt={title} />}
                <div className="doc-pdf-actions">
                  <button className="btn" onClick={onDownload}>Download</button>
                </div>
              </div>
            )}
          </div>
          <div className="doc-modal-actions">
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
