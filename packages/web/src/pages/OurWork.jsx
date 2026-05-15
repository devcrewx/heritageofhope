import { Link, useOutletContext } from 'react-router-dom'
import { resolve, text } from '../content'

function OurWork() {
  const { language, siteContent } = useOutletContext()
  const { ourWork } = siteContent

  const pageContent = ourWork.pageContent || {}

  const copy = {
    en: {
      title: pageContent.title?.en || 'Initiatives designed for real-world impact.',
      intro:
        pageContent.intro?.en ||
        'Our active programs focus on education, healthcare, and community welfare to bring comprehensive support to those who need it most.',
    },
    bn: {
      title: pageContent.title?.bn || 'আমাদের কাজগুলো আসল দরকার মাথায় রেখেই করা হয়।',
      intro:
        pageContent.intro?.bn ||
        'শিক্ষা, স্বাস্থ্য আর সমাজকল্যাণ—এই তিন দিকেই আমরা কাজ করি, যাতে মানুষের কাছে ঠিক সময়ে সাহায্য পৌঁছে যায়।',
    },
  }

  const focusTags = pageContent.focusTags?.length
    ? pageContent.focusTags
    : [text('Education', 'শিক্ষা'), text('Healthcare', 'স্বাস্থ্য'), text('Welfare', 'কল্যাণ')]

  const approachHeading = pageContent.approachHeading || text('How we execute programs', 'কীভাবে আমরা কাজগুলো করি')
  const approachSteps = pageContent.approachSteps?.length
    ? pageContent.approachSteps
    : [
        text('Identify community needs', 'পাড়ার দরকারটা আগে বুঝে নিই'),
        text('Collaborate with local partners', 'স্থানীয় অংশীদারদের সাথে যৌথ উদ্যোগ'),
        text('Execute program and track impact', 'কাজটা করি আর কী হলো দেখি'),
        text('Provide ongoing support and review', 'চলতে থাকা সহায়তা আর খোঁজখবর রাখি'),
      ]

  const joinMeta = pageContent.joinMeta || text('Join the mission', 'আমাদের সাথে থাকুন')
  const joinBody = pageContent.joinBody || text(
    'By partnering with us or volunteering, you help us bring these programs to life in underserved communities.',
    'আমাদের সাথে যুক্ত হয়ে আপনিও প্রান্তিক মানুষের কাছে এই সেবাগুলো পৌঁছে দিতে পারেন।',
  )
  const joinButton = pageContent.joinButton || text('Support this work', 'এই কাজটায় পাশে থাকুন')

  return (
    <main className="page-stack">
      <section className="panel split-panel">
        <div>
          <p className="eyebrow">{resolve(language, text('Our Work', 'আমাদের কাজ'))}</p>
          <h1 className="page-title">{copy[language].title}</h1>
          <p>{copy[language].intro}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, text('Focus', 'যেখানে আমরা কাজ করি'))}</p>
          <div className="pill-row">
            {focusTags.map((tag, index) => (
              <span key={`${resolve(language, tag)}-${index}`} className="pill">
                {resolve(language, tag)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="card-grid program-grid">
          {ourWork.featuredPrograms.map((program) => (
            <article key={program.slug} className="card program-card">
              <img loading="lazy" src={program.image} alt={resolve(language, program.title)} />
              <div className="card-body">
                <span className="pill">{resolve(language, program.category)}</span>
                <h3>{resolve(language, program.title)}</h3>
                <p>{resolve(language, program.description)}</p>
                <p className="meta">{resolve(language, program.highlight)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split-panel">
        <div>
          <div className="section-head">
            <p>{resolve(language, text('Our Approach', 'আমাদের কাজের ধরন'))}</p>
            <h2>{resolve(language, approachHeading)}</h2>
          </div>
          <ol className="timeline">
            {approachSteps.map((step) => (
              <li key={resolve(language, step)}>{resolve(language, step)}</li>
            ))}
          </ol>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, joinMeta)}</p>
          <p>{resolve(language, joinBody)}</p>
          <Link className="btn btn-solid" to="/get-involved#donate">
            {resolve(language, joinButton)}
          </Link>
        </div>
      </section>
    </main>
  )
}

export default OurWork
