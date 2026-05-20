import { Link, useOutletContext } from 'react-router-dom'
import { resolve } from '../utils/i18n'

function ThankYou() {
  const { language, siteContent } = useOutletContext()
  const page = siteContent?.thankYou?.pageContent || {}

  return (
    <main className="page-stack">
      <section className="panel split-panel">
        <div>
          <p className="eyebrow">{resolve(language, page.eyebrow)}</p>
          <h1 className="page-title">
            {resolve(language, page.heading)}
          </h1>
          <p>{resolve(language, page.body)}</p>
        </div>
        <Link className="btn btn-solid" to="/">
          {resolve(language, page.buttonLabel)}
        </Link>
      </section>
    </main>
  )
}

export default ThankYou
