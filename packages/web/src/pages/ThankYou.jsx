import { Link, useOutletContext } from 'react-router-dom'
import { resolve, text } from '../content'

function ThankYou() {
  const { language } = useOutletContext()

  return (
    <main className="page-stack">
      <section className="panel split-panel">
        <div>
          <p className="eyebrow">{resolve(language, text('Submission received', 'আপনার বার্তাটি আমরা পেয়েছি'))}</p>
          <h1 className="page-title">
            {resolve(language, text('Thank you for reaching out.', 'যোগাযোগ করার জন্য ধন্যবাদ।'))}
          </h1>
          <p>
            {resolve(
              language,
              text(
                'We will review your message and respond as soon as possible.',
                'আপনার বার্তাটা দেখে আমরা দ্রুতই যোগাযোগ করব।',
              ),
            )}
          </p>
        </div>
        <Link className="btn btn-solid" to="/">
          {resolve(language, text('Return home', 'মূল পাতায় ফিরে যান'))}
        </Link>
      </section>
    </main>
  )
}

export default ThankYou
