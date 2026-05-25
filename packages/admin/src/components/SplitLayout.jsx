import { useState, useRef, useCallback, useEffect } from 'react'
import PreviewPane from './PreviewPane'
import PreviewToolbar from './PreviewToolbar'

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

export default function SplitLayout({ children, previewPage, iframeRef }) {
  const isSmallScreen = useMediaQuery('(max-width: 1023px)')
  const [splitPct, setSplitPct] = useState(48)
  const [previewOpen, setPreviewOpen] = useState(!isSmallScreen)
  const [device, setDevice] = useState('desktop')
  const [language, setLanguage] = useState('en')
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const onMouseDown = useCallback(() => { dragging.current = true }, [])
  const onMouseUp = useCallback(() => { dragging.current = false }, [])
  const onMouseMove = useCallback((e) => {
    if (!dragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    setSplitPct(Math.min(Math.max(pct, 25), 75))
  }, [])

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [onMouseUp, onMouseMove])

  return (
    <div className="split-layout" ref={containerRef}>
      <div
        className="split-editor"
        style={{ width: previewOpen ? `${splitPct}%` : '100%' }}
      >
        <div className="split-editor-inner">
          {children}
        </div>
      </div>

      {previewOpen && (
        <div className="split-handle" onMouseDown={onMouseDown} title="Drag to resize" />
      )}

      {previewOpen && (
        <div className="split-preview" style={{ width: `${100 - splitPct}%` }}>
          <PreviewToolbar
            device={device}
            setDevice={setDevice}
            language={language}
            setLanguage={setLanguage}
            previewPage={previewPage}
            iframeRef={iframeRef}
          />
          <PreviewPane
            page={previewPage}
            device={device}
            language={language}
            iframeRef={iframeRef}
          />
        </div>
      )}

      <button
        className="split-toggle"
        onClick={() => setPreviewOpen(v => !v)}
        title={previewOpen ? 'Hide preview' : 'Show preview'}
      >
        {previewOpen ? '⟩' : '⟨ Preview'}
      </button>
    </div>
  )
}
