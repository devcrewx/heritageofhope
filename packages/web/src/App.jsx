import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import OurWork from './pages/OurWork'
import Impact from './pages/Impact'
import Gallery from './pages/Gallery'
import GetInvolved from './pages/GetInvolved'
import Contact from './pages/Contact'
import ThankYou from './pages/ThankYou'
import NotFound from './pages/NotFound'
import { fallbackSiteContent } from './content.js'
import './App.css'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return null
}

function RevealOnScroll({ language }) {
  const location = useLocation()

  useEffect(() => {
    function observeElements() {
      const elements = Array.from(document.querySelectorAll('[data-reveal]'))
      const sectionCounters = new Map()
      const easing = 'cubic-bezier(0.22, 1, 0.36, 1)'

      elements.forEach((element) => {
        const scope = element.closest('.hero-panel, .panel, .topbar') ?? document.body
        const currentIndex = sectionCounters.get(scope) ?? 0
        sectionCounters.set(scope, currentIndex + 1)

        const isHero = element.classList.contains('hero-panel') || element.classList.contains('topbar')
        const isSection = element.classList.contains('panel')
        const baseDelay = isHero ? 40 : isSection ? 90 : 120
        const delay = Math.min(baseDelay + currentIndex * 55, 340)
        const duration = isHero ? 760 : isSection ? 620 : 520

        element.style.setProperty('--reveal-delay', `${delay}ms`)
        element.style.setProperty('--reveal-duration', `${duration}ms`)
        element.style.setProperty('--reveal-ease', easing)
        element.classList.remove('is-revealed')
        observer.observe(element)
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -30px 0px',
      },
    )

    observeElements()

    const domWatcher = new MutationObserver(() => observeElements())
    domWatcher.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      domWatcher.disconnect()
    }
  }, [location.pathname])

  return null
}

function App() {
  const [language, setLanguage] = useState('en')
  const [siteContent, setSiteContent] = useState(fallbackSiteContent)
  const [contentLoading, setContentLoading] = useState(true)
  const [contentError, setContentError] = useState(null)
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? ''
      : '')

  useEffect(() => {
    let cancelled = false
    let pollInterval = null

    async function loadSiteContent() {
      try {
        setContentLoading(true)
        setContentError(null)
        const response = await fetch(`${apiBase}/api/content`)

        if (!response.ok) {
          throw new Error(`Failed to load site content: ${response.status}`)
        }

        const data = await response.json()
        if (!cancelled) {
          setSiteContent(data)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load site content:', error)
          setContentError(error.message)
        }
      } finally {
        if (!cancelled) {
          setContentLoading(false)
        }
      }
    }

    // Load content on mount
    loadSiteContent()

    // Poll for content updates every 30 seconds
    pollInterval = setInterval(loadSiteContent, 30000)

    return () => {
      cancelled = true
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <RevealOnScroll language={language} />
      <Routes>
          <Route element={<Layout language={language} setLanguage={setLanguage} siteContent={siteContent} contentLoading={contentLoading} contentError={contentError} />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="our-work" element={<OurWork />} />
          <Route path="impact" element={<Impact />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="get-involved" element={<GetInvolved />} />
          <Route path="contact" element={<Contact />} />
          <Route path="thank-you" element={<ThankYou />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
