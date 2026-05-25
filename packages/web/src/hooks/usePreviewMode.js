import { useEffect } from 'react'

export function usePreviewMode(setSiteContent, setLanguage) {
  const isPreviewMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('preview')

  useEffect(() => {
    if (!isPreviewMode) return

    const ADMIN_ORIGIN = import.meta.env.VITE_ADMIN_ORIGIN || window.location.origin

    function handleMessage(event) {
      if (event.origin !== ADMIN_ORIGIN) return

      const { type, payload } = event.data || {}

      if (type === 'PREVIEW_UPDATE' && payload) {
        setSiteContent(payload)
      }

      if (type === 'PREVIEW_LANGUAGE' && payload?.language) {
        setLanguage(payload.language)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isPreviewMode, setSiteContent, setLanguage])

  return isPreviewMode
}
