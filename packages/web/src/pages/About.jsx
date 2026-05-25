import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { resolve } from '../utils/i18n'
import DocumentModal from '../components/DocumentModal'

function About() {
  const { language, siteContent } = useOutletContext()
  const { about } = siteContent
  const page = about.pageContent || {}
  const documents = about.documents || []
  const hero = about.hero
  const story = about.story
  const registration = about.registration

  const [modalOpen, setModalOpen] = useState(false)
  const [modalDocIndex, setModalDocIndex] = useState(null)

  const modalDoc = modalDocIndex !== null ? documents[modalDocIndex] : null

  const isPdfUrl = (url) => url && url !== '#' && (url.endsWith('.pdf') || url.includes('/raw/upload/'))

  const handleDownload = async (doc) => {
    if (!doc?.pdfUrl || doc.pdfUrl === '#') return
    const title = resolve(language, doc.title) || 'document'
    try {
      const resp = await fetch(doc.pdfUrl)
      if (!resp.ok) throw new Error('Fetch failed')
      const blob = await resp.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = title + '.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
    } catch {
      window.open(doc.pdfUrl, '_blank')
    }
  }

  const openDoc = (d) => {
    const index = documents.findIndex((doc) => doc.pdfUrl === d.pdfUrl)
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
          <p className="eyebrow">{resolve(language, page.eyebrow)}</p>
          <h1 className="page-title">{resolve(language, hero.pageTitle)}</h1>
          <p>{resolve(language, hero.intro)}</p>
        </div>
        <div className="image-frame framed">
          <img loading="lazy" src={hero.heroImage} alt="Heritage of Hope Foundation" />
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{resolve(language, page.documentsLabel)}</p>
          <h2>{resolve(language, page.documentsHeading)}</h2>
        </div>
        <DocumentModal
          open={modalOpen}
          onClose={closeDoc}
          title={resolve(language, modalDoc?.title || '')}
          thumbUrl={modalDoc?.thumbUrl || ''}
          downloadUrl={modalDoc?.pdfUrl || ''}
          onDownload={() => handleDownload(modalDoc)}
          type={isPdfUrl(modalDoc?.pdfUrl) ? 'pdf' : 'image'}
          onNext={nextDoc}
          onPrev={prevDoc}
          hasNext={modalDocIndex !== null && modalDocIndex < documents.length - 1}
          hasPrev={modalDocIndex !== null && modalDocIndex > 0}
        />
        <div className="card-grid docs-grid">
          {documents && documents.length > 0 ? documents.map((doc, idx) => {
            const titleText = resolve(language, doc?.title)
            const descText = resolve(language, doc?.description)
            const dateText = doc?.date || ''

            return (
            <article
              key={`${doc?.pdfUrl || 'doc'}-${idx}`}
              className="card doc-card"
              data-reveal
            >
              <div className="doc-thumb-wrap">
                <img className="doc-thumb" src={doc?.thumbUrl || 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210277/heritage-of-hope/docs/thumbs/pdf-thumb.svg'} alt={titleText} />
              </div>
              <div className="card-body">
                <h3>{titleText}</h3>
                {dateText ? <p className="muted">{dateText}</p> : null}
                {descText ? <p className="muted small">{descText}</p> : null}
                <div style={{ marginTop: '0.75rem' }}>
                  <button type="button" className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); openDoc(doc); }}>
                    {resolve(language, { en: 'View', bn: 'দেখুন' })}
                  </button>
                  {isPdfUrl(doc?.pdfUrl) ? (
                    <button type="button" className="btn" style={{ marginLeft: '0.5rem' }} onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}>
                      {resolve(language, { en: 'Download', bn: 'ডাউনলোড করুন' })}
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
            )
          }) : null}
        </div>
      </section>

      <section className="panel split-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, page.storyLabel)}</p>
            <h2>{resolve(language, story.heading)}</h2>
          </div>
          <p>{resolve(language, story.body)}</p>
        </div>
        <div className="dual-card">
          <article>
            <p className="meta">{resolve(language, page.missionLabel)}</p>
            <p>{resolve(language, about.mission)}</p>
          </article>
          <article>
            <p className="meta">{resolve(language, page.visionLabel)}</p>
            <p>{resolve(language, about.vision)}</p>
          </article>
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{resolve(language, page.valuesLabel)}</p>
          <h2>{resolve(language, page.valuesHeading)}</h2>
        </div>
        <div className="card-grid four-up">
          {about.values && about.values.length > 0
            ? about.values.map((value, idx) => (
                <article key={idx} className="card value-card" data-reveal>
                  <div className="card-body">
                    <h3>{resolve(language, value.title)}</h3>
                    <p>{resolve(language, value.description)}</p>
                  </div>
                </article>
              ))
            : null}
        </div>
      </section>

      <section className="panel split-panel" data-reveal>
        <div className="image-frame framed">
          <img
            src={registration.certImage}
            alt="Registration certificate"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
        <div>
          <div className="section-head">
            <p>{resolve(language, page.regLabel)}</p>
            <h2>{resolve(language, page.regHeading)}</h2>
          </div>
          <div className="stack-list">
            <article className="stack-card">
              <p className="meta">{resolve(language, page.certLabel)}</p>
              <p>{resolve(language, registration.body)}</p>
            </article>
            <article className="stack-card">
              <p className="meta">{resolve(language, page.partnersLabel)}</p>
              <div className="partner-list" role="list" aria-label="Partners">
                {about.partners && about.partners.length > 0
                  ? about.partners.map((partner) => (
                      <span key={resolve(language, partner)} className="pill partner-pill" role="listitem">
                        {resolve(language, partner)}
                      </span>
                    ))
                  : null}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{resolve(language, page.teamLabel)}</p>
          <h2>{resolve(language, page.teamHeading)}</h2>
        </div>
        <div className="card-grid">
          {about.teamMembers && about.teamMembers.length > 0
            ? about.teamMembers.map((member) => (
                <article key={resolve(language, member.name)} className="card person-card" data-reveal>
                  <img loading="lazy" src={member.image} alt={resolve(language, member.name)} />
                  <div className="card-body">
                    <h3>{resolve(language, member.name)}</h3>
                    <p>{resolve(language, member.role)}</p>
                  </div>
                </article>
              ))
            : null}
        </div>
      </section>
    </main>
  )
}

export default About
