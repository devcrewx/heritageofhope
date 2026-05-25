import { useEffect, useRef, useCallback } from 'react'

export function usePreviewSync(iframeRef, draft, page, fullContent) {
  const debounceRef = useRef(null)
  const retryRef = useRef(null)

  const sendUpdate = useCallback(() => {
    const iframe = iframeRef?.current
    if (!iframe || !fullContent) return

    const win = iframe.contentWindow
    if (!win) return

    const merged = {
      ...fullContent,
      [page]: {
        ...fullContent[page],
        ...draft,
      },
    }

    win.postMessage(
      { type: 'PREVIEW_UPDATE', payload: merged },
      import.meta.env.VITE_WEB_ORIGIN || window.location.origin,
    )
  }, [iframeRef, draft, page, fullContent])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (retryRef.current) clearTimeout(retryRef.current)

    const trySend = () => {
      const iframe = iframeRef?.current
      if (iframe?.contentWindow && fullContent) {
        sendUpdate()
      } else {
        retryRef.current = setTimeout(trySend, 300)
      }
    }

    debounceRef.current = setTimeout(trySend, 150)
    return () => {
      clearTimeout(debounceRef.current)
      clearTimeout(retryRef.current)
    }
  }, [sendUpdate])
}
