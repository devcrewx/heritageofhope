import { useOutletContext } from 'react-router-dom'
import { partners, resolve, teamMembers, text } from '../content'

function About() {
  const { language } = useOutletContext()

  const copy = {
    en: {
      title: 'Rooted in community. Driven by impact.',
      intro:
        'We work directly with the people we serve, ensuring every initiative brings lasting, positive change.',
      mission: 'Mission',
      vision: 'Vision',
      values: 'Core values',
      legal: 'Legally registered and transparent',
      storyTitle: 'Our story',
      storyBody:
        'The foundation began from direct work with children and women in underserved areas.',
    },
    bn: {
      title: 'কমিউনিটিই আমাদের শক্তি। মানুষের পাশে থাকাই আমাদের কাজ।',
      intro:
        'আমরা যাদের পাশে থাকি, তাদের সাথেই সরাসরি কাজ করি, যাতে কাজের ফলটা সত্যিই কাজে লাগে।',
      mission: 'আমাদের লক্ষ্য',
      vision: 'ভবিষ্যতের ভাবনা',
      values: 'আমাদের আদর্শ',
      legal: 'আইনগতভাবে নিবন্ধিত আর খোলামেলা',
      storyTitle: 'আমাদের গল্প',
      storyBody:
        'শিশু আর নারীদের সঙ্গে কাজ করতে করতেই ফাউন্ডেশনের শুরু।',
    },
  }

  const values = [
    text('Compassion', 'সহানুভূতি'),
    text('Transparency', 'স্বচ্ছতা'),
    text('Community', 'জনসেবা'),
    text('Empowerment', 'ক্ষমতায়ন'),
  ]

  const documents = [
    { href: '/docs/trust-registration-certificate.pdf', title: resolve(language, text('Trust Registration Certificate', 'ট্রাস্ট নিবন্ধন সার্টিফিকেট')), meta: 'May 18, 2024' },
    { href: '/docs/ngo-darpan-niti-ayog.pdf', title: 'NGO DARPAN (NITI AAYOG)', meta: 'WB/2024/0426882' },
    { href: '/docs/hhp-12a.pdf', title: '12A (provisional)', meta: 'AY 2026–2029' },
    { href: '/docs/hhp-80g.pdf', title: '80G (provisional)', meta: 'AY 2026–2029' },
    { href: '/docs/csr-1-hhf.pdf', title: 'MCA CSR Registration (CSR-1)', meta: 'CSR00100906' },
    { href: '/docs/upi-qr.jpeg', title: resolve(language, text('UPI QR (donate)', 'UPI কিউআর (দান)')), meta: '' },
    { href: '/docs/empty-cheque.jpeg', title: resolve(language, text('Bank details (specimen cheque)', 'ব্যাংক বিবরণী (চেক)')), meta: '' },
    { href: '/docs/gratitude-certificate.jpeg', title: resolve(language, text('Certificates & awards', 'শংসাপত্র ও পুরস্কার')), meta: 'Jul 28, 2024' },
  ]

  return (
    <main className="page-stack page-about">
      <section className="panel split-panel" data-reveal>
        <div>
          <p className="eyebrow">{resolve(language, text('About', 'আমাদের কথা'))}</p>
          <h1 className="page-title">{copy[language].title}</h1>
          <p>{copy[language].intro}</p>
        </div>
        <div className="image-frame framed">
          <img loading="lazy" src="/assets/foundation.webp" alt={resolve(language, text('Heritage of Hope Foundation', 'Heritage of Hope Foundation'))} />
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{resolve(language, text('Documents', 'দলিল'))}</p>
          <h2>{resolve(language, text('Official documents & donation details', 'আধিকারিক দলিল এবং অনুদানের বিবরণ'))}</h2>
        </div>
        <div className="card-grid docs-grid">
          {documents.map((doc) => (
            <article key={doc.href} className="card doc-card" data-reveal>
              <div className="card-body">
                <h3>{doc.title}</h3>
                {doc.meta ? <p className="muted">{doc.meta}</p> : null}
                <div style={{ marginTop: '0.75rem' }}>
                  <a className="btn btn-ghost" href={doc.href} target="_blank" rel="noopener noreferrer">
                    {resolve(language, text('View', 'দেখুন'))}
                  </a>
                  {doc.href.endsWith('.pdf') ? (
                    <a className="btn" style={{ marginLeft: '0.5rem' }} href={doc.href} download>
                      {resolve(language, text('Download', 'ডাউনলোড'))}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{copy[language].storyTitle}</p>
            <h2>{resolve(language, text('Grounded in field realities', 'মাঠের কাজের গল্প'))}</h2>
          </div>
          <p>{copy[language].storyBody}</p>
        </div>
        <div className="dual-card">
          <article>
            <p className="meta">{copy[language].mission}</p>
            <p>
              {resolve(
                language,
                text(
                  'Improve lives through education, healthcare, and basic support.',
                  'শিক্ষা, স্বাস্থ্য আর দরকারি সাহায্যের মাধ্যমে মানুষের জীবন একটু সহজ করা।',
                ),
              )}
            </p>
          </article>
          <article>
            <p className="meta">{copy[language].vision}</p>
            <p>
              {resolve(
                language,
                text(
                  'A Bengal where every child can learn and live with dignity.',
                  'এমন এক বাংলা, যেখানে সব বাচ্চা পড়তে পারবে আর সম্মান নিয়ে বড় হবে।',
                ),
              )}
            </p>
          </article>
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{copy[language].values}</p>
          <h2>{resolve(language, text('How we work', 'আমাদের কাজের ধরন'))}</h2>
        </div>
        <div className="card-grid four-up">
          {values.map((value) => (
            <article key={resolve(language, value)} className="card value-card" data-reveal>
              <div className="card-body">
                <h3>{resolve(language, value)}</h3>
                <p>
                  {resolve(
                    language,
                    text(
                      'Each program is built on local trust and measurable impact.',
                      'আমাদের প্রতিটি কাজ এলাকার মানুষের ভরসা আর খোলামেলা কাজের ওপর দাঁড়িয়ে আছে।',
                    ),
                  )}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split-panel" data-reveal>
        <div className="image-frame framed">
          <img
            src="/assets/reg_cert.webp"
            alt={resolve(language, text('Registration certificate', 'নিবন্ধনের কাগজ'))}
          />
        </div>
        <div>
          <div className="section-head">
            <p>{copy[language].legal}</p>
            <h2>{resolve(language, text('Registration and accountability', 'নিবন্ধন ও স্বচ্ছতা'))}</h2>
          </div>
          <div className="stack-list">
            <article className="stack-card">
              <p className="meta">{resolve(language, text('Registration certificate', 'নিবন্ধনের কাগজ'))}</p>
              <p>
                {resolve(
                  language,
                  text(
                    'Heritage of Hope Foundation is a registered NGO committed to transparency and dedicated service in West Bengal.',
                    'হেরিটেজ অফ হোপ ফাউন্ডেশন একটি নিবন্ধিত এনজিও, যা পশ্চিমবঙ্গে নিয়ম মেনে আর খোলামেলা ভাবে কাজ করছে।',
                  ),
                )}
              </p>
            </article>
            <article className="stack-card">
              <p className="meta">{resolve(language, text('Partners', 'সহযোগীরা'))}</p>
              <div className="partner-list" role="list" aria-label={resolve(language, text('Partners', 'সহযোগীরা'))}>
                {partners.map((partner) => (
                  <span key={resolve(language, partner)} className="pill partner-pill" role="listitem">
                    {resolve(language, partner)}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{copy[language].values}</p>
          <h2>{resolve(language, text('Team snapshot', 'টিমের এক ঝলক'))}</h2>
        </div>
        <div className="card-grid">
          {teamMembers.map((member) => (
            <article key={resolve(language, member.name)} className="card person-card" data-reveal>
              <img loading="lazy" src={member.image} alt={resolve(language, member.name)} />
              <div className="card-body">
                <h3>{resolve(language, member.name)}</h3>
                <p>{resolve(language, member.role)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default About
