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
      title: 'কমিউনিটিই আমাদের ভিত্তি। সেবার মাধ্যমেই আমাদের পথচলা।',
      intro:
        'আমরা যাদের সেবা করি তাদের সাথে সরাসরি কাজ করি, নিশ্চিত করে যে প্রতিটি উদ্যোগ স্থায়ী ও ইতিবাচক পরিবর্তন নিয়ে আসে।',
      mission: 'আমাদের লক্ষ্য',
      vision: 'ভবিষ্যত পরিকল্পনা',
      values: 'আমাদের আদর্শ',
      legal: 'আইনগতভাবে নিবন্ধিত ও স্বচ্ছ',
      storyTitle: 'আমাদের গল্প',
      storyBody:
        'শিশু ও নারীদের সঙ্গে সরাসরি কাজের অভিজ্ঞতা থেকেই ফাউন্ডেশনের শুরু।',
    },
  }

  const values = [
    text('Compassion', 'সহানুভূতি'),
    text('Transparency', 'স্বচ্ছতা'),
    text('Community', 'জনসেবা'),
    text('Empowerment', 'ক্ষমতায়ন'),
  ]

  return (
    <main className="page-stack page-about">
      <section className="panel split-panel" data-reveal>
        <div>
          <p className="eyebrow">About</p>
          <h1 className="page-title">{copy[language].title}</h1>
          <p>{copy[language].intro}</p>
        </div>
        <div className="image-frame framed">
          <img src="/assets/foundation.webp" alt="Heritage of Hope Foundation" />
        </div>
      </section>

      <section className="panel split-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{copy[language].storyTitle}</p>
            <h2>{resolve(language, text('Grounded in field realities', 'বাস্তব অভিজ্ঞতার ভিত্তিতে পথচলা'))}</h2>
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
                  'শিক্ষা, স্বাস্থ্যসেবা ও জরুরি সহায়তার মাধ্যমে মানুষের জীবনযাত্রার মান উন্নত করা।',
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
                  'এমন এক আগামীর বাংলা, যেখানে প্রতিটি শিশু শিক্ষা ও সম্মানের সাথে বড় হবে।',
                ),
              )}
            </p>
          </article>
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{copy[language].values}</p>
          <h2>{resolve(language, text('How we work', 'আমরা কীভাবে কাজ করি'))}</h2>
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
                      'আমাদের প্রতিটি উদ্যোগ স্থানীয় মানুষের আস্থা ও কাজের স্বচ্ছতার ওপর ভিত্তি করে পরিচালিত হয়।',
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
          <img src="/assets/reg_cert.webp" alt="Registration certificate" />
        </div>
        <div>
          <div className="section-head">
            <p>{copy[language].legal}</p>
            <h2>{resolve(language, text('Registration and accountability', 'নিবন্ধন ও জবাবদিহিতা'))}</h2>
          </div>
          <div className="stack-list">
            <article className="stack-card">
              <p className="meta">Registration certificate</p>
              <p>
                {resolve(
                  language,
                  text(
                    'Heritage of Hope Foundation is a registered NGO committed to transparency and dedicated service in West Bengal.',
                    'হেরিটেজ অফ হোপ ফাউন্ডেশন একটি নিবন্ধিত এনজিও, যা পশ্চিমবঙ্গে স্বচ্ছতা ও একনিষ্ঠ সমাজসেবার প্রতিশ্রুতি নিয়ে কাজ করছে।',
                  ),
                )}
              </p>
            </article>
            <article className="stack-card">
              <p className="meta">Partners</p>
              <div className="partner-list" role="list" aria-label="Partners">
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
          <h2>{resolve(language, text('Team snapshot', 'আমাদের টিমের এক ঝলক'))}</h2>
        </div>
        <div className="card-grid">
          {teamMembers.map((member) => (
            <article key={resolve(language, member.name)} className="card person-card" data-reveal>
              <img src={member.image} alt={resolve(language, member.name)} />
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
