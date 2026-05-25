import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePreviewSync } from './usePreviewSync'

function createMockIframe() {
  return { contentWindow: { postMessage: vi.fn() } }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('usePreviewSync', () => {
  it('sends PREVIEW_UPDATE postMessage after debounce', async () => {
    vi.useFakeTimers()
    const iframeRef = { current: createMockIframe() }
    const fullContent = { '/': { title: 'Root' }, about: { title: 'About' } }
    const draft = { title: 'Updated Root' }

    renderHook(() => usePreviewSync(iframeRef, draft, '/', fullContent))

    expect(iframeRef.current.contentWindow.postMessage).not.toHaveBeenCalled()

    act(() => { vi.advanceTimersByTime(150) })

    expect(iframeRef.current.contentWindow.postMessage).toHaveBeenCalledWith(
      {
        type: 'PREVIEW_UPDATE',
        payload: { '/': { title: 'Updated Root' }, about: { title: 'About' } },
      },
      'http://localhost:5173',
    )
    vi.useRealTimers()
  })

  it('sends nothing when iframe is not ready', () => {
    vi.useFakeTimers()
    const iframeRef = { current: null }

    renderHook(() => usePreviewSync(iframeRef, { test: 1 }, '/', { '/': { test: 0 } }))

    act(() => { vi.advanceTimersByTime(1000) })
    vi.useRealTimers()
  })

  it('retries when iframe becomes available', () => {
    vi.useFakeTimers()
    const iframeRef = { current: null }

    renderHook(() => usePreviewSync(iframeRef, { test: 1 }, '/', { '/': { test: 0 } }))

    act(() => { vi.advanceTimersByTime(300) })

    const mockIframe = createMockIframe()
    iframeRef.current = mockIframe

    act(() => { vi.advanceTimersByTime(300) })

    expect(mockIframe.contentWindow.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'PREVIEW_UPDATE' }),
      expect.any(String),
    )
    vi.useRealTimers()
  })

  it('cleans up timers on unmount', () => {
    vi.useFakeTimers()
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

    const { unmount } = renderHook(() =>
      usePreviewSync({ current: createMockIframe() }, { test: 1 }, '/', { '/': { test: 0 } }),
    )

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('posts message with correct origin', () => {
    vi.useFakeTimers()
    const iframeRef = { current: createMockIframe() }

    renderHook(() => usePreviewSync(iframeRef, {}, '/', { '/': {} }))

    act(() => { vi.advanceTimersByTime(150) })

    expect(iframeRef.current.contentWindow.postMessage).toHaveBeenCalledWith(
      expect.anything(),
      'http://localhost:5173',
    )
    vi.useRealTimers()
  })

  it('does nothing when fullContent is null', () => {
    vi.useFakeTimers()
    const iframeRef = { current: createMockIframe() }

    renderHook(() => usePreviewSync(iframeRef, { test: 1 }, '/', null))

    act(() => { vi.advanceTimersByTime(150) })

    expect(iframeRef.current.contentWindow.postMessage).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
