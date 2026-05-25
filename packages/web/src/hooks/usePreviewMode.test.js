import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePreviewMode } from './usePreviewMode'

afterEach(() => {
  vi.restoreAllMocks()
})

function setPreviewUrl(enabled) {
  const url = enabled ? 'http://localhost:5173/?preview=1' : 'http://localhost:5173/'
  Object.defineProperty(window, 'location', {
    value: new URL(url),
    writable: true,
  })
}

describe('usePreviewMode', () => {
  beforeEach(() => {
    setPreviewUrl(false)
  })

  it('returns true when preview=1 is in URL', () => {
    setPreviewUrl(true)
    const { result } = renderHook(() => usePreviewMode(vi.fn(), vi.fn()))
    expect(result.current).toBe(true)
  })

  it('returns false when preview is not in URL', () => {
    const { result } = renderHook(() => usePreviewMode(vi.fn(), vi.fn()))
    expect(result.current).toBe(false)
  })

  it('calls setSiteContent on PREVIEW_UPDATE message', () => {
    setPreviewUrl(true)
    const setSiteContent = vi.fn()
    renderHook(() => usePreviewMode(setSiteContent, vi.fn()))

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: { type: 'PREVIEW_UPDATE', payload: { home: { title: 'Test' } } },
        origin: 'http://localhost:5174',
      }))
    })

    expect(setSiteContent).toHaveBeenCalledWith({ home: { title: 'Test' } })
  })

  it('calls setLanguage on PREVIEW_LANGUAGE message', () => {
    setPreviewUrl(true)
    const setLanguage = vi.fn()
    renderHook(() => usePreviewMode(vi.fn(), setLanguage))

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: { type: 'PREVIEW_LANGUAGE', payload: { language: 'bn' } },
        origin: 'http://localhost:5174',
      }))
    })

    expect(setLanguage).toHaveBeenCalledWith('bn')
  })

  it('ignores messages from wrong origin', () => {
    setPreviewUrl(true)
    const setSiteContent = vi.fn()
    renderHook(() => usePreviewMode(setSiteContent, vi.fn()))

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: { type: 'PREVIEW_UPDATE', payload: { home: { title: 'Test' } } },
        origin: 'https://evil.com',
      }))
    })

    expect(setSiteContent).not.toHaveBeenCalled()
  })

  it('ignores unknown message types', () => {
    setPreviewUrl(true)
    const setSiteContent = vi.fn()
    renderHook(() => usePreviewMode(setSiteContent, vi.fn()))

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: { type: 'UNKNOWN_TYPE', payload: {} },
        origin: 'http://localhost:5174',
      }))
    })

    expect(setSiteContent).not.toHaveBeenCalled()
  })

  it('does nothing when not in preview mode', () => {
    setPreviewUrl(false)
    const setSiteContent = vi.fn()
    renderHook(() => usePreviewMode(setSiteContent, vi.fn()))

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: { type: 'PREVIEW_UPDATE', payload: {} },
        origin: 'http://localhost:5174',
      }))
    })

    expect(setSiteContent).not.toHaveBeenCalled()
  })

  it('removes event listener on unmount', () => {
    setPreviewUrl(true)
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => usePreviewMode(vi.fn(), vi.fn()))
    unmount()

    expect(removeSpy).toHaveBeenCalledWith('message', expect.any(Function))
  })
})
