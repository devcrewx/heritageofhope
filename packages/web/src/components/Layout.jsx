import { NavLink, Outlet, Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { resolve, text } from '../content'

function Layout({ language, setLanguage, siteContent }) {
  const navCopy = {
    en: { donate: 'Donate Now', switchTo: 'বাংলা' },
    bn: { donate: 'সহযোগিতার হাত বাড়িয়ে দিন', switchTo: 'EN' },
  }

  useEffect(() => {
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en'
  }, [language])

  const [navOpen, setNavOpen] = useState(false)
  const navRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    if (!navOpen) return

    const container = navRef.current
    const focusableSelectors =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const focusable = container ? Array.from(container.querySelectorAll(focusableSelectors)) : []
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const previouslyFocused = document.activeElement

    if (first) first.focus()

    function onKey(e) {
      if (e.key === 'Escape') {
        setNavOpen(false)
        return
      }

      if (e.key === 'Tab') {
        if (!focusable.length) {
          e.preventDefault()
          return
        }

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    function onClickOutside(e) {
      if (!container) return
      if (toggleRef.current && toggleRef.current.contains(e.target)) return
      if (!container.contains(e.target)) setNavOpen(false)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClickOutside)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClickOutside)
      document.body.style.overflow = prevOverflow
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus()
    }
  }, [navOpen])

  return (
    <div className={`site-shell ${language === 'bn' ? 'lang-bn' : 'lang-en'}`}>
      <header className="topbar" data-reveal>
        <Link
          className="brand"
          to="/"
          aria-label="Heritage of Hope Foundation"
        >
          <img src="/assets/profile_pic.webp" alt="" />
          <div>
            <p className="brand-name">Heritage of Hope Foundation</p>
            <p className="brand-sub" aria-hidden="true">{resolve(language, text('Registered NGO | West Bengal', 'নিবন্ধিত সংস্থা | পশ্চিমবঙ্গ'))}</p>
          </div>
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className={`nav-toggle ${navOpen ? 'open' : ''}`}
          aria-controls="primary-nav"
          aria-expanded={navOpen}
          aria-label={resolve(language, text('Open navigation', 'মেনু খুলুন'))}
          onClick={() => setNavOpen((s) => !s)}
        >
          <span className="hamburger" aria-hidden />
        </button>

        <nav
          id="primary-nav"
          ref={navRef}
          className={`nav-links ${navOpen ? 'open' : ''}`}
          aria-label={resolve(language, text('Primary navigation', 'প্রধান মেনু'))}
        >
          {siteContent.navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setNavOpen(false)}
            >
              {resolve(language, item.label)}
            </NavLink>
          ))}
        </nav>

        <div role="presentation" className={`nav-overlay ${navOpen ? 'active' : ''}`} aria-hidden={!navOpen} onClick={() => setNavOpen(false)} />

        <div className="topbar-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            aria-label={navCopy[language].switchTo}
          >
            {navCopy[language].switchTo}
          </button>
          <Link className="btn btn-solid" to="/get-involved#donate">
            {navCopy[language].donate}
          </Link>
        </div>
      </header>

      <div id="main-content" aria-hidden={navOpen}>
        <Outlet context={{ language, setLanguage, siteContent }} />

        <footer className="footer">
          <div>
            <p className="footer-title">Heritage of Hope Foundation</p>
            <p>
              {resolve(
                language,
                text('Children, women and communities in South 24 Parganas, West Bengal.', 'দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের পাশে আমরা কাজ করি।'),
              )}
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <a href={siteContent.contact.contactDetails.facebookUrl || 'https://www.facebook.com/profile.php?id=61559891799273'} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem 0', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
                {resolve(language, text('Follow us on Facebook', 'ফেসবুকে আমাদের সঙ্গে থাকুন'))}
              </a>
            </div>
          </div>
          <div>
            <p>{siteContent.contact.contactDetails.phone}</p>
            <p>{siteContent.contact.contactDetails.email}</p>
            <p>{siteContent.contact.contactDetails.address}</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Layout
