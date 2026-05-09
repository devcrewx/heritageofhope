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
import './App.css'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return null
}

function RevealOnScroll() {
  const location = useLocation()

  useEffect(() => {
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
    })

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

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [location.pathname])

  return null
}

function App() {
  const [language, setLanguage] = useState('en')

  return (
    <BrowserRouter>
      <ScrollToTop />
      <RevealOnScroll />
      <Routes>
        <Route element={<Layout language={language} setLanguage={setLanguage} />}>
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
