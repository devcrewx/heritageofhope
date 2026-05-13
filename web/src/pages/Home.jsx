import { Link, useOutletContext } from 'react-router-dom'
import { facebookPosts, featuredPrograms, impactMetrics, resolve, showcaseImages, text } from '../content'
import CountUp from '../components/CountUp'

function Home() {
  const { language } = useOutletContext()

  const copy = {
    en: {
      eyebrow: 'Lighting lives, one step at a time',
      title: 'Education, healthcare and dignity for underserved communities.',
      intro:
        'Heritage of Hope Foundation works across South 24 Parganas through learning spaces, health outreach and seasonal relief.',
      heroTagline: 'Empowering Communities | Registered NGO',
      primary: 'Support a Program',
      secondary: 'Explore Our Work',
      statsTitle: 'Our footprint so far',
      pillarTitle: 'Mission pillars',
      activityTitle: 'From the Facebook timeline',
      donationTitle: 'Your small gift creates big change.',
      donationBody:
        'Even small support helps us keep classes running, respond to health needs and serve families with dignity.',
    },
    bn: {
      eyebrow: 'ছোট ছোট কাজ, বড় ভরসা',
      title: 'প্রান্তিক মানুষের জন্য শিক্ষা, স্বাস্থ্য ও মর্যাদা।',
      intro:
        'হেরিটেজ অফ হোপ ফাউন্ডেশন দক্ষিণ ২৪ পরগণায় শিক্ষাকেন্দ্র, স্বাস্থ্যসেবা ও মৌসুমি সহায়তার মাধ্যমে কাজ করে.',
      heroTagline: 'মানুষের পাশে | নিবন্ধিত সংস্থা',
      primary: 'আমাদের কর্মসূচিতে সাহায্য করুন',
      secondary: 'আমাদের কাজ দেখুন',
      statsTitle: 'আমাদের কাজের পরিধি',
      pillarTitle: 'মূল লক্ষ্য',
      activityTitle: 'ফেসবুকের পাতা থেকে',
      donationTitle: 'আপনার ছোট অনুদান বড় পরিবর্তন আনতে পারে।',
      donationBody:
        'অল্প সাহায্যেও আমাদের ক্লাস চালানো, স্বাস্থ্যকাজ সামলানো আর মানুষের পাশে থাকা সহজ হয়।',
    },
  }

  return (
    <main className="page-stack page-home">
      <section className="hero-panel" id="home" data-reveal>
        <div className="hero-content">
          <p className="eyebrow">{copy[language].eyebrow}</p>
          <h1>{copy[language].title}</h1>
          <p>{copy[language].intro}</p>
          <div className="hero-cta">
            <Link className="btn btn-solid" to="/get-involved#donate">
              {copy[language].primary}
            </Link>
            <Link className="btn btn-outline" to="/our-work">
              {copy[language].secondary}
            </Link>
          </div>
          <div className="trust-strip">
            <span>{resolve(language, text('Registered NGO', 'নিবন্ধিত সংস্থা'))}</span>
            <span>{resolve(language, text('Est. 2024', 'প্রতিষ্ঠিত ২০২৪'))}</span>
            <span>{resolve(language, text('Govt. of West Bengal', 'পশ্চিমবঙ্গ সরকার'))}</span>
          </div>
          <p className="hero-footnote">{copy[language].heroTagline}</p>
        </div>

        <aside className="hero-media editorial-hero">
          <figure className="hero-photo-frame">
            <img loading="lazy" src="/assets/pathsala.webp" alt={resolve(language, text('Children and volunteers at a community event', 'শিশু আর স্বেচ্ছাসেবকদের একটি কমিউনিটি অনুষ্ঠানে দেখা যাচ্ছে'))} />
            <figcaption>
              {resolve(
                language,
                text(
                  'Kishalaya Pathsala, Kankandighi | Community learning moment',
                  'কিশলয় পাঠশালা, কঙ্কনদীঘি | পড়াশোনার সুন্দর মুহূর্ত',
                ),
              )}
            </figcaption>
          </figure>
          <div className="hero-cert">
            <img
              loading="lazy"
              src="/assets/reg_cert.webp"
              alt={resolve(language, text('Registration certificate preview', 'নিবন্ধন সনদের ঝলক'))}
            />
            <p>
              {resolve(
                language,
                text('Registration proof available on About page', 'নিবন্ধনের কাগজটা আমাদের "আমাদের কথা" পাতায় দেখুন'),
              )}
            </p>
          </div>
        </aside>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{copy[language].statsTitle}</p>
          <h2>{resolve(language, text('Impact snapshot', 'এক নজরে আমাদের কাজ'))}</h2>
        </div>
        <div className="metric-grid">
          {impactMetrics.map((metric) => (
            <article key={resolve(language, metric.label)} className="metric-card">
              <h3><CountUp value={metric.value} /></h3>
              <p>{resolve(language, metric.label)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{copy[language].pillarTitle}</p>
          <h2>{resolve(language, text('What we do on the ground', 'মাঠপর্যায়ে আমাদের কার্যক্রম'))}</h2>
        </div>
        <div className="card-grid">
          {featuredPrograms.slice(0, 3).map((program) => (
              <article key={program.slug} className="card program-card" data-reveal>
              <img loading="lazy" src={program.image} alt={resolve(language, program.title)} />
              <div className="card-body">
                <span className="pill">{resolve(language, program.category)}</span>
                <h3>{resolve(language, program.title)}</h3>
                <p>{resolve(language, program.description)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{copy[language].activityTitle}</p>
          <h2>{resolve(language, text('Stories, updates and event photos', 'সাফল্যের গল্প, সংবাদ ও অনুষ্ঠানের ছবি'))}</h2>
        </div>
        <div className="story-layout">
          <div className="post-list">
            {facebookPosts.slice(0, 4).map((post) => (
              <article key={post.date} className="post-card compact-row" data-reveal>
                <img loading="lazy" className="post-thumb" src={post.image} alt={resolve(language, post.title)} />
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
                <img loading="lazy" src={photo.image} alt={resolve(language, photo.label)} />
                <figcaption>{resolve(language, photo.label)}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="panel donation-cta" data-reveal>
        <div>
          <p className="eyebrow">{resolve(language, text('Donate', 'সাহায্য করুন'))}</p>
          <h2>{copy[language].donationTitle}</h2>
          <p>{copy[language].donationBody}</p>
        </div>
        <Link className="btn btn-solid" to="/get-involved#donate">
          {resolve(language, text('Donate now', 'আজই সাহায্যের হাত বাড়িয়ে দিন'))}
        </Link>
      </section>
    </main>
  )
}

export default Home
