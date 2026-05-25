import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PreviewToolbar from './PreviewToolbar'

function createToolbar(props = {}) {
  const defaults = {
    device: 'desktop',
    setDevice: vi.fn(),
    language: 'en',
    setLanguage: vi.fn(),
    previewPage: '/',
    iframeRef: { current: null },
    hasUnsavedChanges: true,
  }
  return render(<PreviewToolbar {...defaults} {...props} />)
}

describe('PreviewToolbar', () => {
  it('renders language buttons', () => {
    createToolbar()
    expect(screen.getByText('EN')).toBeInTheDocument()
    expect(screen.getByText('বাংলা')).toBeInTheDocument()
  })

  it('renders device buttons', () => {
    createToolbar()
    expect(screen.getByText('desktop')).toBeInTheDocument()
    expect(screen.getByText('tablet')).toBeInTheDocument()
    expect(screen.getByText('mobile')).toBeInTheDocument()
  })

  it('marks active language button', () => {
    createToolbar({ language: 'bn' })
    const bnBtn = screen.getByText('বাংলা')
    expect(bnBtn).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('EN')).toHaveAttribute('aria-pressed', 'false')
  })

  it('marks active device button', () => {
    createToolbar({ device: 'mobile' })
    const btn = screen.getByText('mobile')
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('desktop')).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls setDevice on device button click', () => {
    const setDevice = vi.fn()
    createToolbar({ setDevice })
    fireEvent.click(screen.getByText('tablet'))
    expect(setDevice).toHaveBeenCalledWith('tablet')
  })

  it('calls setLanguage on language button click and posts message', () => {
    const setLanguage = vi.fn()
    const postMessage = vi.fn()
    const iframeRef = { current: { contentWindow: { postMessage } } }
    createToolbar({ setLanguage, iframeRef })
    fireEvent.click(screen.getByText('বাংলা'))
    expect(setLanguage).toHaveBeenCalledWith('bn')
    expect(postMessage).toHaveBeenCalledWith(
      { type: 'PREVIEW_LANGUAGE', payload: { language: 'bn' } },
      'http://localhost:5173',
    )
  })

  it('does not crash when iframeRef is null', () => {
    const setLanguage = vi.fn()
    createToolbar({ setLanguage, iframeRef: { current: null } })
    expect(() => fireEvent.click(screen.getByText('বাংলা'))).not.toThrow()
    expect(setLanguage).toHaveBeenCalledWith('bn')
  })

  it('shows Live Preview badge when hasUnsavedChanges is true', () => {
    createToolbar({ hasUnsavedChanges: true })
    expect(screen.getByText('● Live Preview')).toBeInTheDocument()
  })

  it('hides Live Preview badge when hasUnsavedChanges is false', () => {
    createToolbar({ hasUnsavedChanges: false })
    expect(screen.queryByText('● Live Preview')).not.toBeInTheDocument()
  })

  it('renders open live site link', () => {
    createToolbar({ previewPage: '/about' })
    const link = screen.getByText('↗ Open live site')
    expect(link).toHaveAttribute('href', 'http://localhost:5173/about')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('has correct accessibility attributes', () => {
    createToolbar()
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
    expect(screen.getAllByRole('group')).toHaveLength(2)
  })
})
