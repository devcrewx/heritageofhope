import { Link, useOutletContext } from 'react-router-dom'
import { featuredPrograms, resolve, text } from '../content'

function OurWork() {
  const { language } = useOutletContext()

  const copy = {
    en: {
      title: 'Initiatives designed for real-world impact.',
      intro:
        'Our active programs focus on education, healthcare, and community welfare to bring comprehensive support to those who need it most.',
    },
    bn: {
      title: 'আমাদের কাজগুলো আসল দরকার মাথায় রেখেই করা হয়।',
      intro:
        'শিক্ষা, স্বাস্থ্য আর সমাজকল্যাণ—এই তিন দিকেই আমরা কাজ করি, যাতে মানুষের কাছে ঠিক সময়ে সাহায্য পৌঁছে যায়।',
    },
  }

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
          <p>{resolve(language, text('Education | Healthcare | Welfare', 'শিক্ষা | স্বাস্থ্য | কল্যাণ'))}</p>
        </div>
      </section>

      <section className="panel">
        <div className="card-grid program-grid">
          {featuredPrograms.map((program) => (
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
            <h2>{resolve(language, text('How we execute programs', 'কীভাবে আমরা কাজগুলো করি'))}</h2>
          </div>
          <ol className="timeline">
            <li>{resolve(language, text('Identify community needs', 'পাড়ার দরকারটা আগে বুঝে নিই'))}</li>
            <li>{resolve(language, text('Collaborate with local partners', 'স্থানীয় মানুষদের সাথে হাত মিলাই'))}</li>
            <li>{resolve(language, text('Execute program and track impact', 'কাজটা করি আর কী হলো দেখি'))}</li>
            <li>{resolve(language, text('Provide ongoing support and review', 'চলতে থাকা সহায়তা আর খোঁজখবর রাখি'))}</li>
          </ol>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, text('Join the mission', 'আমাদের সাথে থাকুন'))}</p>
          <p>
            {resolve(
              language,
              text(
                'By partnering with us or volunteering, you help us bring these programs to life in underserved communities.',
                'আমাদের সাথে যুক্ত হয়ে আপনিও প্রান্তিক মানুষের কাছে এই সেবাগুলো পৌঁছে দিতে পারেন।',
              ),
            )}
          </p>
          <Link className="btn btn-solid" to="/get-involved#donate">
            {resolve(language, text('Support this work', 'এই কাজটায় পাশে থাকুন'))}
          </Link>
        </div>
      </section>
    </main>
  )
}

export default OurWork
