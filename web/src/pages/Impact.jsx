import { useOutletContext } from 'react-router-dom'
import { fundAllocation, impactMetrics, resolve, text } from '../content'
import CountUp from '../components/CountUp'

function Impact() {
  const { language } = useOutletContext()

  const copy = {
    en: {
      title: 'Transparency and measurable change.',
      intro:
        'Explore the numbers and stories that showcase the direct results of our community-driven approach.',
    },
    bn: {
      title: 'স্বচ্ছতা এবং পরিমাপযোগ্য পরিবর্তন।',
      intro:
        'আমাদের সমাজসেবামূলক কাজের বাস্তব ফলাফল ও মানুষের বদলে যাওয়ার গল্পগুলো দেখুন।',
    },
  }

  return (
    <main className="page-stack page-impact">
      <section className="panel split-panel" data-reveal>
        <div>
          <p className="eyebrow">{resolve(language, text('Impact', 'প্রভাব'))}</p>
          <h1 className="page-title">{copy[language].title}</h1>
          <p>{copy[language].intro}</p>
        </div>
        <div className="mini-panel">
          <p className="meta">{resolve(language, text('Our Promise', 'আমাদের প্রতিশ্রুতি'))}</p>
          <p>{resolve(language, text('Accountability to our donors and community.', 'দাতাদের প্রতি স্বচ্ছতা ও মানুষের প্রতি আমাদের দায়িত্ববোধ।'))}</p>
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="metric-grid">
          {impactMetrics.map((metric) => (
            <article key={resolve(language, metric.label)} className="metric-card" data-reveal>
              <h3><CountUp value={metric.value} /></h3>
              <p>{resolve(language, metric.label)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, text('Fund utilization', 'তহবিলের ব্যবহার'))}</p>
            <h2>{resolve(language, text('How support is used', 'আপনাদের সাহায্য কীভাবে ব্যবহৃত হয়'))}</h2>
          </div>
          <div className="stack-list">
            {fundAllocation.map((item) => (
              <article key={resolve(language, item.label)} className="stack-card progress-card" data-reveal>
                <div className="progress-line">
                  <span>{resolve(language, item.label)}</span>
                  <strong>{item.value}%</strong>
                </div>
                <div className="bar"><span style={{ width: `${item.value}%` }} /></div>
              </article>
            ))}
          </div>
        </div>
        <div className="stack-list">
          <article className="stack-card quote-card" data-reveal>
            <p className="meta">{resolve(language, text('Community Feedback', 'মানুষের কথা'))}</p>
            <p>
              {resolve(
                language,
                text(
                  '"Thanks to Kishalaya Pathsala and the Foundation, our children receive dedicated guidance and winter support that keeps them learning year-round."',
                  '"কিশলয় পাঠশালা ও ফাউন্ডেশনের কারণে আমাদের ছেলেমেয়েরা যত্নশীল শিক্ষা ও শীতের সহায়তা পাচ্ছে, যা তাদের সারা বছর পড়াশোনায় যুক্ত রাখে।"',
                ),
              )}
            </p>
          </article>
          <article className="stack-card quote-card" data-reveal>
            <p className="meta">{resolve(language, text('Annual report', 'বার্ষিক প্রতিবেদন'))}</p>
            <p>
              {resolve(
                language,
                text(
                  'Our 2025-2026 Impact Report is currently being compiled and will be available for download soon.',
                  '২০২৫-২৬ সালের কাজের বার্ষিক প্রতিবেদন তৈরির কাজ চলছে, শীঘ্রই এখানে দেখতে পাবেন।',
                ),
              )}
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Impact
