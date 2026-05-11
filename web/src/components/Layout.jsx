import { NavLink, Outlet, Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { navItems, contactDetails, resolve, text } from '../content'

function Layout({ language, setLanguage }) {
  const navCopy = {
    en: { donate: 'Donate Now', switchTo: 'বাংলা' },
    bn: { donate: 'সহযোগিতার হাত বাড়িয়ে দিন', switchTo: 'EN' },
  }

  useEffect(() => {
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en'
  }, [language])

  const [navOpen, setNavOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    if (navOpen && navRef.current) {
      const first = navRef.current.querySelector('a, button')
      first?.focus()
    }
  }, [navOpen])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={`site-shell ${language === 'bn' ? 'lang-bn' : 'lang-en'}`}>
      <header className="topbar" data-reveal>
        <Link className="brand" to="/" aria-label={resolve(language, text('Heritage of Hope Foundation home', 'Heritage of Hope Foundation-এর হোমপেজ'))}>
          <img src="/assets/profile_pic.webp" alt={resolve(language, text('Heritage of Hope Foundation logo', 'Heritage of Hope Foundation লোগো'))} />
          <div>
            <p className="brand-name">Heritage of Hope Foundation</p>
            <p className="brand-sub">
              {resolve(language, text('Registered NGO | West Bengal', 'নিবন্ধিত সংস্থা | পশ্চিমবঙ্গ'))}
            </p>
          </div>
        </Link>

        <button
          className="nav-toggle"
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
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {resolve(language, item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="topbar-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            aria-label={resolve(language, text('Toggle language', 'ভাষা বদলান'))}
          >
            {navCopy[language].switchTo}
          </button>
          <Link className="btn btn-solid" to="/get-involved#donate">
            {navCopy[language].donate}
          </Link>
        </div>
      </header>

      <Outlet context={{ language, setLanguage }} />

      <footer className="footer">
        <div>
          <p className="footer-title">Heritage of Hope Foundation</p>
          <p>
            {resolve(
              language,
              text(
                'Children, women and communities in South 24 Parganas, West Bengal.',
                'দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের পাশে আমরা কাজ করি।',
              ),
            )}
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <a href="https://www.facebook.com/profile.php?id=61559891799273" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem 0', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
              {resolve(language, text('Follow us on Facebook', 'ফেসবুকে আমাদের সঙ্গে থাকুন'))}
            </a>
          </div>
        </div>
        <div>
          <p>{contactDetails.phone}</p>
          <p>{contactDetails.email}</p>
          <p>{contactDetails.address}</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
