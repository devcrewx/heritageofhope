import { Link, useOutletContext } from 'react-router-dom'
import { resolve, text } from '../utils/i18n'
import CountUp from '../components/CountUp'

function Home() {
  const { language, siteContent } = useOutletContext()
  const { home, siteMeta } = siteContent
  const hero = home.hero
  const page = home.pageContent
  const mission = home.mission
  const cta = home.cta

  return (
    <main className="page-stack page-home">
      <section className="hero-panel" id="home" data-reveal>
        <div className="hero-content">
          <p className="eyebrow">{resolve(language, hero.eyebrow)}</p>
          <h1>{resolve(language, hero.headline)}</h1>
          <p>{resolve(language, hero.intro)}</p>
          <div className="hero-cta">
            <Link className="btn btn-solid" to="/get-involved#donate">
              Support a Program
            </Link>
            <Link className="btn btn-outline" to="/our-work">
              Explore Our Work
            </Link>
          </div>
          <div className="trust-strip">
            <span>{resolve(language, hero.badge1)}</span>
            <span>{resolve(language, hero.badge2)}</span>
            <span>{resolve(language, hero.badge3)}</span>
          </div>
          <p className="hero-footnote">{resolve(language, hero.heroFootnote)}</p>
        </div>

        <aside className="hero-media editorial-hero">
          <figure className="hero-photo-frame">
            <img loading="lazy" src={hero.heroImage} alt={resolve(language, hero.figcaption)} />
            <figcaption>{resolve(language, hero.figcaption)}</figcaption>
          </figure>
          <div className="hero-cert">
            <img
              loading="lazy"
              src={hero.regCertThumb}
              alt="Registration certificate preview"
            />
            <p>{resolve(language, text('Registration proof available on About page', 'নিবন্ধনের প্রমাণ "আমাদের কথা" পাতায়'))}</p>
          </div>
        </aside>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{resolve(language, page.statsLabel)}</p>
          <h2>{resolve(language, page.statsHeading)}</h2>
        </div>
        <div className="metric-grid">
          {home.impactMetrics && home.impactMetrics.length > 0
            ? home.impactMetrics.map((metric) => (
                <article key={resolve(language, metric.label)} className="metric-card">
                  <h3><CountUp value={metric.value} /></h3>
                  <p>{resolve(language, metric.label)}</p>
                </article>
              ))
            : null}
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{resolve(language, page.pillarLabel)}</p>
          <h2>{resolve(language, mission.heading)}</h2>
        </div>
        <div className="card-grid">
          {home.featuredPrograms && home.featuredPrograms.length > 0
            ? home.featuredPrograms.slice(0, 3).map((program) => (
                <article key={program.slug} className="card program-card" data-reveal>
                  <img loading="lazy" src={program.image} alt={resolve(language, program.title)} />
                  <div className="card-body">
                    <span className="pill">{resolve(language, program.category)}</span>
                    <h3>{resolve(language, program.title)}</h3>
                    <p>{resolve(language, program.description)}</p>
                  </div>
                </article>
              ))
            : null}
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{resolve(language, page.activityLabel)}</p>
          <h2>{resolve(language, page.activityHeading)}</h2>
        </div>
        <div className="story-layout">
          <div className="post-list">
            {home.facebookPosts && home.facebookPosts.length > 0
              ? home.facebookPosts.slice(0, 4).map((post) => (
                  <article key={post.date} className="post-card compact-row" data-reveal>
                    <img loading="lazy" className="post-thumb" src={post.image} alt={resolve(language, post.title)} />
                    <div className="card-body">
                      <p className="meta">{post.date}</p>
                      <h3>{resolve(language, post.title)}</h3>
                      <p>{resolve(language, post.excerpt)}</p>
                    </div>
                  </article>
                ))
              : null}
          </div>
          <div className="photo-mosaic">
            {home.showcaseImages && home.showcaseImages.length > 0
              ? home.showcaseImages.map((photo) => (
                  <figure key={resolve(language, photo.label)} className="mosaic-tile" data-reveal>
                    <img loading="lazy" src={photo.image} alt={resolve(language, photo.label)} />
                    <figcaption>{resolve(language, photo.label)}</figcaption>
                  </figure>
                ))
              : null}
          </div>
        </div>
      </section>

      <section className="panel donation-cta" data-reveal>
        <div>
          <p className="eyebrow">{resolve(language, page.donationLabel)}</p>
          <h2>{resolve(language, cta.headline)}</h2>
          <p>{resolve(language, cta.body)}</p>
        </div>
        <Link className="btn btn-solid" to="/get-involved#donate">
          {resolve(language, cta.buttonLabel)}
        </Link>
      </section>
    </main>
  )
}

export default Home
