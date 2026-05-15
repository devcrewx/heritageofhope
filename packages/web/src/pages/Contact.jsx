import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { resolve, text } from '../content'
import { submitFormWeb3 } from '../utils/web3forms'

function Contact() {
  const { language, siteContent } = useOutletContext()
  const { contact } = siteContent
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const copy = {
    en: {
      title: 'We’d love to hear from you.',
      intro:
        'Reach out to us for inquiries, partnerships, or just to say hello.',
    },
    bn: {
      title: 'আমরা আপনার কথা শুনতে চাই।',
      intro:
        'কিছু জানতে চাইলে বা আমাদের সঙ্গে কাজ করতে চাইলে সহজেই যোগাযোগ করুন।',
    },
  }

  return (
    <main className="page-stack page-contact">
      <section className="panel split-panel" data-reveal>
        <div>
          <p className="eyebrow">{resolve(language, text('Contact', 'যোগাযোগ'))}</p>
          <h1 className="page-title">{copy[language].title}</h1>
          <p>{copy[language].intro}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, text('Response time', 'কত তাড়াতাড়ি উত্তর পাবেন'))}</p>
          <p>{resolve(language, text('Usually within 2 business days', 'সাধারণত ২ কর্মদিবসের মধ্যে'))}</p>
        </div>
      </section>

      <section className="panel card-grid two-up" data-reveal>
        <article className="card value-card" data-reveal>
          <div className="card-body">
            <p className="meta">{resolve(language, text('Phone', 'ফোন নম্বর'))}</p>
            <h3>{contact.contactDetails.phone}</h3>
          </div>
        </article>
        <article className="card value-card" data-reveal>
          <div className="card-body">
            <p className="meta">{resolve(language, text('Email', 'ইমেল'))}</p>
            <h3>{contact.contactDetails.email}</h3>
          </div>
        </article>
        <article className="card value-card wide-card" data-reveal>
          <div className="card-body">
            <p className="meta">{resolve(language, text('Address', 'ঠিকানা'))}</p>
            <h3>{contact.contactDetails.address}</h3>
          </div>
        </article>
      </section>

      <section className="panel split-panel" data-reveal>
        <div className="map-frame" data-reveal>
          <iframe
            title={resolve(language, text('Heritage of Hope Foundation location', 'Heritage of Hope Foundation-এর মানচিত্র'))}
            src="https://www.google.com/maps?q=Sukantapally,+Subhas+Gram,+West+Bengal+700147&output=embed"
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
                window.location.href = '/thank-you'
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
            <p>{resolve(language, text('Contact form', 'যোগাযোগের ফর্ম'))}</p>
            <h2>{resolve(language, text('Send us a direct message', 'সরাসরি একটা মেসেজ পাঠান'))}</h2>
          </div>
          <div className="field">
            <label htmlFor="name">{resolve(language, text('Name', 'নাম'))}</label>
            <input id="name" name="name" type="text" required placeholder={resolve(language, text('Your name', 'আপনার নাম'))} />
          </div>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="email">{resolve(language, text('Email', 'ইমেল'))}</label>
              <input id="email" name="email" type="email" required placeholder={resolve(language, text('you@example.com', 'আপনার ইমেল'))} />
            </div>
            <div className="field">
              <label htmlFor="subject">{resolve(language, text('Subject', 'বিষয়'))}</label>
              <input id="subject" name="subject" type="text" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="message">{resolve(language, text('Message', 'বার্তা'))}</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              placeholder={resolve(language, text('Tell us how you want to help', 'আপনার কথা এখানে লিখুন'))}
            />
          </div>
          <button type="submit" className="btn btn-solid" disabled={isSubmitting}>
            {isSubmitting ? resolve(language, text('Sending...', 'পাঠাচ্ছি...')) : resolve(language, text('Send message', 'বার্তা পাঠান'))}
          </button>
        </form>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <p>{resolve(language, text('Featured from Facebook', 'ফেসবুকের কিছু ঝলক'))}</p>
            <h2>{resolve(language, text('Recent moments from the page', 'পেজের সাম্প্রতিক কিছু ছবি'))}</h2>
          </div>
          <a href="https://www.facebook.com/profile.php?id=61559891799273" target="_blank" rel="noopener noreferrer" className="btn btn-solid" style={{ borderRadius: '999px', fontSize: '0.9rem', padding: '10px 20px' }}>
          <a href={contact.contactDetails.facebookUrl || 'https://www.facebook.com/profile.php?id=61559891799273'} target="_blank" rel="noopener noreferrer" className="btn btn-solid" style={{ borderRadius: '999px', fontSize: '0.9rem', padding: '10px 20px' }}>
            {resolve(language, text('Visit Official Facebook Page', 'অফিসিয়াল ফেসবুক পেজে যান'))} &rarr;
          </a>
        </div>
        <div className="story-layout contact-story-layout">
          <div className="stack-list">
            {contact.facebookPosts.slice(3, 6).map((post) => (
              <article key={post.date} className="post-card compact-post" data-reveal>
                <img loading="lazy" src={post.image} alt={resolve(language, post.title)} />
                <div className="card-body">
                  <p className="meta">{post.date}</p>
                  <h3>{resolve(language, post.title)}</h3>
                  <p>{resolve(language, post.excerpt)}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="photo-mosaic">
            {contact.showcaseImages.map((photo) => (
              <figure key={resolve(language, photo.label)} className="mosaic-tile" data-reveal>
                <img loading="lazy" src={photo.image} alt={resolve(language, photo.label)} />
                <figcaption>{resolve(language, photo.label)}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
