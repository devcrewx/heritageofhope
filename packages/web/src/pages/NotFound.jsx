import { Link, useOutletContext } from 'react-router-dom'
import { resolve, text } from '../content'

function NotFound() {
  const { language } = useOutletContext()

  return (
    <main className="page-stack">
      <section className="panel split-panel">
        <div>
          <p className="eyebrow">404</p>
          <h1 className="page-title">{resolve(language, text('Page not found', 'পেজ পাওয়া যায়নি'))}</h1>
          <p>
            {resolve(
              language,
              text('Return to the homepage to continue exploring.', 'হোমপেজে ফিরে গিয়ে আবার ঘুরে দেখুন।'),
            )}
          </p>
        </div>
        <Link className="btn btn-solid" to="/">
          {resolve(language, text('Go home', 'মূল পাতায় ফিরে যান'))}
        </Link>
      </section>
    </main>
  )
}

export default NotFound
