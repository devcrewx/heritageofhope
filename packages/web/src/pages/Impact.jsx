import { useOutletContext } from 'react-router-dom'
import { resolve } from '../utils/i18n'
import CountUp from '../components/CountUp'

function Impact() {
  const { language, siteContent } = useOutletContext()
  const { impact } = siteContent
  const page = impact.pageContent || {}
  const hero = impact.hero
  const testimonial = impact.testimonial
  const annualReport = impact.annualReport

  return (
    <main className="page-stack page-impact">
      <section className="panel split-panel" data-reveal>
        <div>
          <p className="eyebrow">{resolve(language, page.eyebrow)}</p>
          <h1 className="page-title">{resolve(language, hero.pageTitle)}</h1>
          <p>{resolve(language, hero.subHeadline)}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, page.promiseLabel)}</p>
          <p>{resolve(language, hero.promise)}</p>
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="metric-grid">
          {impact.impactMetrics && impact.impactMetrics.length > 0
            ? impact.impactMetrics.map((metric) => (
                <article key={resolve(language, metric.label) || metric.value} className="metric-card" data-reveal>
                  <h3><CountUp value={metric.value} /></h3>
                  <p>{resolve(language, metric.label)}</p>
                </article>
              ))
            : null}
        </div>
      </section>

      <section className="panel split-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, page.fundLabel)}</p>
            <h2>{resolve(language, page.fundHeading)}</h2>
          </div>
          <div className="stack-list">
            {impact.fundAllocation && impact.fundAllocation.length > 0
              ? impact.fundAllocation.map((item) => (
                  <article key={resolve(language, item.category) || item.percentage} className="stack-card progress-card" data-reveal>
                    <div className="progress-line">
                      <span>{resolve(language, item.category)}</span>
                      <strong>{item.percentage}%</strong>
                    </div>
                    <div className="bar"><span style={{ width: `${item.percentage}%` }} /></div>
                  </article>
                ))
              : null}
          </div>
        </div>
        <div className="stack-list">
          <article className="stack-card quote-card" data-reveal>
            <p className="meta">{resolve(language, page.feedbackLabel)}</p>
            <p>{resolve(language, testimonial.quote)}</p>
          </article>
          <article className="stack-card quote-card" data-reveal>
            <p className="meta">{resolve(language, page.reportLabel)}</p>
            <p>{resolve(language, annualReport.body)}</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Impact
