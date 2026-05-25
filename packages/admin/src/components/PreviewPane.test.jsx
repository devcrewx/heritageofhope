import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PreviewPane from './PreviewPane'

function createPreviewPane(props = {}) {
  return render(
    <PreviewPane
      page="/"
      device="desktop"
      language="en"
      iframeRef={{ current: null }}
      {...props}
    />,
  )
}

describe('PreviewPane', () => {
  it('renders iframe with correct src', () => {
    createPreviewPane({ page: '/about' })
    const iframe = screen.getByTitle('Preview — /about')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', 'http://localhost:5173/about?preview=1')
  })

  it('renders iframe with lang attribute', () => {
    createPreviewPane({ language: 'bn' })
    const iframe = screen.getByTitle('Preview — /')
    expect(iframe).toHaveAttribute('lang', 'bn')
  })

  it('shows loading indicator initially', () => {
    createPreviewPane()
    expect(screen.getByText('Loading preview...')).toBeInTheDocument()
  })

  it('hides loading indicator once iframe loads', () => {
    createPreviewPane()
    const iframe = screen.getByTitle('Preview — /')
    fireEvent.load(iframe)
    expect(screen.queryByText('Loading preview...')).not.toBeInTheDocument()
  })

  it('applies mobile device width', () => {
    createPreviewPane({ device: 'mobile' })
    const inner = document.querySelector('.preview-pane-inner')
    expect(inner.style.maxWidth).toBe('390px')
  })

  it('applies tablet device width', () => {
    createPreviewPane({ device: 'tablet' })
    const inner = document.querySelector('.preview-pane-inner')
    expect(inner.style.maxWidth).toBe('768px')
  })

  it('hides iframe until loaded', () => {
    createPreviewPane()
    const iframe = screen.getByTitle('Preview — /')
    expect(iframe.style.opacity).toBe('0')
    fireEvent.load(iframe)
    expect(iframe.style.opacity).toBe('1')
  })
})
