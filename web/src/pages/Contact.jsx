import { useOutletContext } from 'react-router-dom'
import { facebookPosts, resolve, showcaseImages, text } from '../content'
import { contactDetails } from '../content'

function Contact() {
  const { language } = useOutletContext()

  const copy = {
    en: {
      title: 'We’d love to hear from you.',
      intro:
        'Reach out to us for inquiries, partnerships, or just to say hello.',
    },
    bn: {
      title: 'আমরা আপনার কথা শুনতে চাই।',
      intro:
        'যেকোনো তথ্যের জন্য বা আমাদের কাজের অংশীদার হতে নির্দ্বিধায় যোগাযোগ করুন।',
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
          <p className="meta">{resolve(language, text('Response time', 'উত্তর দেওয়ার সময়'))}</p>
          <p>{resolve(language, text('Usually within 2 business days', 'আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব'))}</p>
        </div>
      </section>

      <section className="panel card-grid two-up" data-reveal>
        <article className="card value-card" data-reveal>
          <div className="card-body">
            <p className="meta">{resolve(language, text('Phone', 'ফোন নম্বর'))}</p>
            <h3>{contactDetails.phone}</h3>
          </div>
        </article>
        <article className="card value-card" data-reveal>
          <div className="card-body">
            <p className="meta">{resolve(language, text('Email', 'ইমেল'))}</p>
            <h3>{contactDetails.email}</h3>
          </div>
        </article>
        <article className="card value-card wide-card" data-reveal>
          <div className="card-body">
            <p className="meta">{resolve(language, text('Address', 'ঠিকানা'))}</p>
            <h3>{contactDetails.address}</h3>
          </div>
        </article>
      </section>

      <section className="panel split-panel" data-reveal>
        <div className="map-frame" data-reveal>
          <iframe
            title="Heritage of Hope Foundation location"
            src="https://www.google.com/maps?q=Sukantapally,+Subhas+Gram,+West+Bengal+700147&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <form className="contact-form form-panel" name="contact-form" method="POST" action="/thank-you" data-netlify="true" netlify-honeypot="bot-field" data-reveal>
          <input type="hidden" name="form-name" value="contact-form" />
          <input type="hidden" name="bot-field" />
          <input type="hidden" name="_redirect" value="/thank-you" />
          <div className="section-head">
            <p>{resolve(language, text('Contact form', 'যোগাযোগের ফর্ম'))}</p>
            <h2>{resolve(language, text('Send us a direct message', 'আমাদের সরাসরি লিখুন'))}</h2>
          </div>
          <div className="field">
            <label htmlFor="name">{resolve(language, text('Name', 'নাম'))}</label>
            <input id="name" name="name" type="text" required placeholder={resolve(language, text('Your name', 'আপনার নাম'))} />
          </div>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="email">{resolve(language, text('Email', 'ইমেল'))}</label>
              <input id="email" name="email" type="email" required placeholder="you@example.com" />
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
              placeholder={resolve(language, text('Tell us how you want to help', 'আপনার বার্তার বিস্তারিত এখানে লিখুন'))}
            />
          </div>
          <button type="submit" className="btn btn-solid">
            {resolve(language, text('Send message', 'বার্তা পাঠান'))}
          </button>
        </form>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <p>{resolve(language, text('Featured from Facebook', 'ফেসবুকের বিশেষ মুহূর্ত'))}</p>
            <h2>{resolve(language, text('Recent moments from the page', 'পেজের সাম্প্রতিক মুহূর্ত'))}</h2>
          </div>
          <a href="https://www.facebook.com/profile.php?id=61559891799273" target="_blank" rel="noopener noreferrer" className="btn btn-solid" style={{ borderRadius: '999px', fontSize: '0.9rem', padding: '10px 20px' }}>
            {resolve(language, text('Visit Official Facebook Page', 'অফিসিয়াল ফেসবুক পেজ দেখুন'))} &rarr;
          </a>
        </div>
        <div className="story-layout contact-story-layout">
          <div className="stack-list">
            {facebookPosts.slice(3, 6).map((post) => (
              <article key={post.date} className="post-card compact-post" data-reveal>
                <img src={post.image} alt={resolve(language, post.title)} />
                <div className="card-body">
                  <p className="meta">{post.date}</p>
                  <h3>{resolve(language, post.title)}</h3>
                  <p>{resolve(language, post.excerpt)}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="photo-mosaic">
            {showcaseImages.map((photo) => (
              <figure key={resolve(language, photo.label)} className="mosaic-tile" data-reveal>
                <img src={photo.image} alt={resolve(language, photo.label)} />
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
