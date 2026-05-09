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
      title: 'আমাদের প্রতিটি উদ্যোগ বাস্তব পরিবর্তনের লক্ষ্যে পরিকল্পিত।',
      intro:
        'শিক্ষা, স্বাস্থ্যসেবা ও সমাজকল্যাণ—এই তিন ক্ষেত্রকেই আমরা গুরুত্ব দিই, যাতে প্রান্তিক মানুষের কাছে আমরা প্রকৃত সাহায্য পৌঁছে দিতে পারি।',
    },
  }

  return (
    <main className="page-stack">
      <section className="panel split-panel">
        <div>
          <p className="eyebrow">Our Work</p>
          <h1 className="page-title">{copy[language].title}</h1>
          <p>{copy[language].intro}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">Focus</p>
          <p>{resolve(language, text('Education | Healthcare | Welfare', 'শিক্ষা | স্বাস্থ্য | কল্যাণ'))}</p>
        </div>
      </section>

      <section className="panel">
        <div className="card-grid program-grid">
          {featuredPrograms.map((program) => (
            <article key={program.slug} className="card program-card">
              <img src={program.image} alt={resolve(language, program.title)} />
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
            <p>{resolve(language, text('Our Approach', 'আমাদের দৃষ্টিভঙ্গি'))}</p>
            <h2>{resolve(language, text('How we execute programs', 'কীভাবে আমরা কর্মসূচি বাস্তবায়ন করি'))}</h2>
          </div>
          <ol className="timeline">
            <li>{resolve(language, text('Identify community needs', 'স্থানীয় চাহিদা যাচাই'))}</li>
            <li>{resolve(language, text('Collaborate with local partners', 'স্থানীয় মানুষদের সাথে যৌথ উদ্যোগ'))}</li>
            <li>{resolve(language, text('Execute program and track impact', 'কাজের বাস্তবায়ন ও অগ্রগতি পর্যবেক্ষণ'))}</li>
            <li>{resolve(language, text('Provide ongoing support and review', 'ধারাবাহিক সেবা ও মূল্যায়ন'))}</li>
          </ol>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, text('Join the mission', 'আমাদের উদ্যোগে সামিল হোন'))}</p>
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
            {resolve(language, text('Support this work', 'আমাদের এই প্রচেষ্টায় সাহায্য করুন'))}
          </Link>
        </div>
      </section>
    </main>
  )
}

export default OurWork
