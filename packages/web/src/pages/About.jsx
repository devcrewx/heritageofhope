import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { resolve, text } from '../content'
import DocumentModal from '../components/DocumentModal'

function About() {
  const { language, siteContent } = useOutletContext()
  const { about } = siteContent
  const documents = about.documents || []

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
      title: 'মানুষের মধ্যেই আমাদের শিকড়। কাজের ফলই আমাদের পথ দেখায়।',
      intro:
        'আমরা সরাসরি মানুষের পাশে দাঁড়াই — যাতে প্রতিটি উদ্যোগ সত্যিকারের ও দীর্ঘস্থায়ী পরিবর্তন আনে।',
      mission: 'আমাদের লক্ষ্য',
      vision: 'আমাদের দৃষ্টিভঙ্গি',
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
    text('Community', 'সম্প্রদায়'),
    text('Empowerment', 'স্বনির্ভরতা'),
  ]

  const [modalOpen, setModalOpen] = useState(false)
  const [modalDocIndex, setModalDocIndex] = useState(null)

  const modalDoc = modalDocIndex !== null ? documents[modalDocIndex] : null

  const openDoc = (d) => {
    const index = documents.findIndex((doc) => doc.href === d.href)
    setModalDocIndex(index)
    setModalOpen(true)
  }

  const closeDoc = () => {
    setModalOpen(false)
    setModalDocIndex(null)
  }

  const nextDoc = () => {
    if (modalDocIndex !== null && modalDocIndex < documents.length - 1) {
      setModalDocIndex(modalDocIndex + 1)
    }
  }

  const prevDoc = () => {
    if (modalDocIndex !== null && modalDocIndex > 0) {
      setModalDocIndex(modalDocIndex - 1)
    }
  }

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
          <h2>{resolve(language, text('Official documents', 'সরকারি কাগজপত্র'))}</h2>
        </div>
        <DocumentModal
          open={modalOpen}
          onClose={closeDoc}
          title={modalDoc?.title || ''}
          src={modalDoc?.href || ''}
          type={modalDoc && modalDoc.href.match(/\.pdf$/i) ? 'pdf' : 'image'}
          onNext={nextDoc}
          onPrev={prevDoc}
          hasNext={modalDocIndex !== null && modalDocIndex < documents.length - 1}
          hasPrev={modalDocIndex !== null && modalDocIndex > 0}
        />
        <div className="card-grid docs-grid">
          {documents.map((doc) => (
            <article
              key={doc.href}
              className="card doc-card"
              data-reveal
              role="button"
              tabIndex={0}
              onClick={() => openDoc(doc)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openDoc(doc)
              }}
            >
              <div className="doc-thumb-wrap">
                <img className="doc-thumb" src={doc.thumb || '/docs/thumbs/pdf-thumb.svg'} alt={resolve(language, doc.title)} />
              </div>
              <div className="card-body">
                <h3>{resolve(language, doc.title)}</h3>
                {doc.meta ? <p className="muted">{doc.meta}</p> : null}
                {doc.caption ? <p className="muted small">{resolve(language, doc.caption)}</p> : null}
                <div style={{ marginTop: '0.75rem' }}>
                  <button type="button" className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); openDoc(doc); }}>
                    {resolve(language, text('View', 'দেখুন'))}
                  </button>
                  {doc.href.endsWith('.pdf') ? (
                    <a className="btn" style={{ marginLeft: '0.5rem' }} href={doc.href} download onClick={(e) => e.stopPropagation()}>
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
            <h2>{resolve(language, text('Grounded in field realities', 'মানুষের মাঝ থেকে'))}</h2>
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
                {about.partners.map((partner) => (
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
          <h2>{resolve(language, text('Team snapshot', 'আমাদের দলের এক ঝলক'))}</h2>
        </div>
        <div className="card-grid">
          {about.teamMembers.map((member) => (
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
