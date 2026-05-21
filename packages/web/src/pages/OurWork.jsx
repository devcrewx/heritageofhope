import { Link, useOutletContext } from 'react-router-dom'
import { resolve } from '../utils/i18n'

function OurWork() {
  const { language, siteContent } = useOutletContext()
  const { ourWork } = siteContent

  const page = ourWork.pageContent || {}
  const hero = ourWork.hero
  const approach = ourWork.approach
  const joinBox = ourWork.joinBox

  const focusText = ourWork.focusTags?.length > 0
    ? ourWork.focusTags.map((t) => resolve(language, t)).join(' | ')
    : ''

  return (
    <main className="page-stack">
      <section className="panel split-panel">
        <div>
          <p className="eyebrow">{resolve(language, page.eyebrow)}</p>
          <h1 className="page-title">{resolve(language, hero.pageTitle)}</h1>
          <p>{resolve(language, hero.intro)}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, page.focusLabel || { en: 'Focus areas', bn: 'ফোকাস এরিয়া' })}</p>
          {focusText ? <p>{focusText}</p> : null}
        </div>
      </section>

      {ourWork.showcaseImages?.length > 0 ? (
        <section className="panel">
          <div className="photo-mosaic-multi">
            {ourWork.showcaseImages.map((item, idx) => (
              <div key={idx} className="mosaic-tile">
                <img loading="lazy" src={item.image} alt="" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="panel split-panel">
        <div>
          <div className="section-head">
            <p>{resolve(language, page.approachLabel)}</p>
            <h2>{resolve(language, approach.heading)}</h2>
          </div>
          <ol className="timeline">
            {approach.steps?.length > 0
              ? approach.steps.map((step) => (
                  <li key={resolve(language, step)}>{resolve(language, step)}</li>
                ))
              : null}
          </ol>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, page.joinLabel)}</p>
          <p>{resolve(language, joinBox.body)}</p>
          <Link className="btn btn-solid" to="/get-involved#donate">
            {resolve(language, joinBox.buttonLabel)}
          </Link>
        </div>
      </section>
    </main>
  )
}

export default OurWork
