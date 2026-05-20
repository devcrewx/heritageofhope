import { useNavigate, useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { resolve } from '../utils/i18n'
import { submitFormWeb3 } from '../utils/web3forms'

function Contact() {
  const { language, siteContent } = useOutletContext()
  const navigate = useNavigate()
  const { contact, home, siteMeta } = siteContent
  const page = contact.pageContent || {}
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  return (
    <main className="page-stack page-contact">
      <section className="panel split-panel" data-reveal>
        <div>
          <p className="eyebrow">{resolve(language, page.eyebrow)}</p>
          <h1 className="page-title">{resolve(language, contact.pageTitle)}</h1>
          <p>{resolve(language, contact.intro)}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, contact.responseLabel)}</p>
          <p>{resolve(language, contact.responseValue)}</p>
        </div>
      </section>

      <section className="panel card-grid two-up" data-reveal>
        <article className="card value-card" data-reveal>
          <div className="card-body">
            <p className="meta">Phone</p>
            <h3>{siteMeta.phone}</h3>
          </div>
        </article>
        <article className="card value-card" data-reveal>
          <div className="card-body">
            <p className="meta">Email</p>
            <h3>{siteMeta.email}</h3>
          </div>
        </article>
        <article className="card value-card wide-card" data-reveal>
          <div className="card-body">
            <p className="meta">Address</p>
            <h3>{resolve(language, siteMeta.address)}</h3>
          </div>
        </article>
      </section>

      <section className="panel split-panel" data-reveal>
        <div className="map-frame" data-reveal>
          <iframe
            title="Heritage of Hope Foundation location"
            src={contact.mapEmbedUrl || "https://www.google.com/maps?q=Sukantapally,+Subhas+Gram,+West+Bengal+700147&output=embed"}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <form
          className="contact-form form-panel"
          data-reveal
          onSubmit={async (e) => {
            e.preventDefault()
            setIsSubmitting(true)
            setSubmitStatus(null)
            try {
              const formData = new FormData(e.target)
              const result = await submitFormWeb3(formData, 'contact')
              if (result.success) {
                setSubmitStatus({ type: 'success', message: result.message })
                e.target.reset()
                navigate('/thank-you')
              } else {
                setSubmitStatus({ type: 'error', message: result.message })
              }
            } catch (error) {
              setSubmitStatus({ type: 'error', message: 'Failed to submit form. Please try again.' })
            } finally {
              setIsSubmitting(false)
            }
          }}
        >
          {submitStatus && (
            <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '0.5rem', backgroundColor: submitStatus.type === 'success' ? '#d4edda' : '#f8d7da', color: submitStatus.type === 'success' ? '#155724' : '#721c24', border: `1px solid ${submitStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}` }}>
              {submitStatus.message}
            </div>
          )}
          <div className="section-head">
            <p>{resolve(language, contact.formLabel)}</p>
            <h2>{resolve(language, contact.formHeading)}</h2>
          </div>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required placeholder="Your name" />
          </div>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" type="text" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              placeholder="Tell us how you want to help"
            />
          </div>
          <button type="submit" className="btn btn-solid" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <p>{resolve(language, page.facebookLabel)}</p>
            <h2>{resolve(language, page.facebookHeading)}</h2>
          </div>
          <a href={siteMeta.facebookUrl} target="_blank" rel="noopener noreferrer" className="btn btn-solid" style={{ borderRadius: '999px', fontSize: '0.9rem', padding: '10px 20px' }}>
            Visit Official Facebook Page &rarr;
          </a>
        </div>
        <div className="story-layout contact-story-layout">
          <div className="stack-list">
            {contact.facebookPosts && contact.facebookPosts.length > 0
              ? contact.facebookPosts.slice(3, 6).map((post) => (
                  <article key={post.date} className="post-card compact-post" data-reveal>
                    <img loading="lazy" src={post.image} alt={resolve(language, post.title)} />
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
            {contact.mosaicImages && contact.mosaicImages.length > 0
              ? contact.mosaicImages.map((photo) => (
                  <figure key={resolve(language, photo.label)} className="mosaic-tile" data-reveal>
                    <img loading="lazy" src={photo.image} alt={resolve(language, photo.label)} />
                    <figcaption>{resolve(language, photo.label)}</figcaption>
                  </figure>
                ))
              : null}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
