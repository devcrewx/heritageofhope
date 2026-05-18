import { Link, useOutletContext } from 'react-router-dom'
import { resolve, text } from '../content'
import CountUp from '../components/CountUp'

function Home() {
  const { language, siteContent } = useOutletContext()
  const { home } = siteContent
  const siteMeta = siteContent.siteMeta || {}
  const page = home.pageContent || {}

  const copy = {
    en: {
      eyebrow: 'Lighting lives, one step at a time',
      heroFootnote: 'Empowering Communities | Registered NGO',
      title: 'Education, healthcare and dignity for underserved communities.',
      intro:
        'Heritage of Hope Foundation works across South 24 Parganas through learning spaces, health outreach and seasonal relief.',
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
      heroFootnote: 'মানুষের পাশে | নিবন্ধিত সংস্থা',
      title: 'প্রান্তিক মানুষের জন্য শিক্ষা, স্বাস্থ্য ও মর্যাদা।',
      intro:
        'হেরিটেজ অফ হোপ ফাউন্ডেশন দক্ষিণ ২৪ পরগণায় শিক্ষাকেন্দ্র, স্বাস্থ্যসেবা ও মৌসুমি সহায়তার মাধ্যমে কাজ করে.',
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
  const hero = home.hero || {}
  const mission = home.mission || {}
  const cta = home.cta || {}

  return (
    <main className="page-stack page-home">
      <section className="hero-panel" id="home" data-reveal>
        <div className="hero-content">
          <p className="eyebrow">{resolve(language, hero.eyebrow || text(copy.en.eyebrow, copy.bn.eyebrow))}</p>
          <h1>{resolve(language, hero.headline || text(copy.en.title, copy.bn.title))}</h1>
          <p>{resolve(language, hero.intro || text(copy.en.intro, copy.bn.intro))}</p>
          <div className="hero-cta">
            <Link className="btn btn-solid" to="/get-involved#donate">
              {copy[language].primary}
            </Link>
            <Link className="btn btn-outline" to="/our-work">
              {copy[language].secondary}
            </Link>
          </div>
          <div className="trust-strip">
            <span>{resolve(language, hero.badge1 || siteMeta.registeredBadge || text('Registered NGO', 'নিবন্ধিত সংস্থা'))}</span>
            <span>{resolve(language, hero.badge2 || text(siteMeta.estYear || 'Est. 2024', 'প্রতিষ্ঠিত ২০২৪'))}</span>
            <span>{resolve(language, hero.badge3 || text('Govt. of West Bengal', 'পশ্চিমবঙ্গ সরকার'))}</span>
          </div>
          <p className="hero-footnote">{resolve(language, hero.heroFootnote || text(copy.en.heroFootnote, copy.bn.heroFootnote))}</p>
        </div>

        <aside className="hero-media editorial-hero">
          <figure className="hero-photo-frame">
            <img loading="lazy" src={page.heroImage || '/assets/pathsala.webp'} alt={resolve(language, text('Children and volunteers at a community event', 'শিশু আর স্বেচ্ছাসেবকদের একটি কমিউনিটি অনুষ্ঠানে দেখা যাচ্ছে'))} />
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
          {home.impactMetrics && home.impactMetrics.length > 0
            ? home.impactMetrics.map((metric) => (
                <article key={resolve(language, metric.label)} className="metric-card">
                  <h3><CountUp value={metric.value} /></h3>
                  <p>{resolve(language, metric.label)}</p>
                </article>
              ))
            : null}
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{copy[language].pillarTitle}</p>
          <h2>{resolve(language, mission.heading || text('What we do on the ground', 'মানুষের দোরগোড়ায় আমাদের কাজ'))}</h2>
        </div>
        <div className="card-grid">
          {home.featuredPrograms && home.featuredPrograms.length > 0
            ? home.featuredPrograms.map((program) => (
                <article key={program.slug} className="card program-card" data-reveal>
                  <img loading="lazy" src={program.image} alt={resolve(language, program.title)} />
                  <div className="card-body">
                    <span className="pill">{resolve(language, program.category)}</span>
                    <h3>{resolve(language, program.title)}</h3>
                    <p>{resolve(language, program.description)}</p>
                  </div>
                </article>
              ))
            : null}
        </div>
      </section>

      <section className="panel" data-reveal>
        <div className="section-head">
          <p>{copy[language].activityTitle}</p>
          <h2>{resolve(language, text('Stories, updates and event photos', 'সাফল্যের গল্প, সংবাদ ও অনুষ্ঠানের ছবি'))}</h2>
        </div>
        <div className="story-layout">
          <div className="post-list">
            {home.facebookPosts && home.facebookPosts.length > 0
              ? home.facebookPosts.slice(0, 4).map((post) => (
                  <article key={post.date} className="post-card compact-row" data-reveal>
                    <img loading="lazy" className="post-thumb" src={post.image} alt={resolve(language, post.title)} />
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
            {home.showcaseImages && home.showcaseImages.length > 0
              ? home.showcaseImages.map((photo) => (
                  <figure key={resolve(language, photo.label)} className="mosaic-tile" data-reveal>
                    <img loading="lazy" src={photo.image} alt={resolve(language, photo.label)} />
                    <figcaption>{resolve(language, photo.label)}</figcaption>
                  </figure>
                ))
              : null}
          </div>
        </div>
      </section>

      <section className="panel donation-cta" data-reveal>
        <div>
          <p className="eyebrow">{resolve(language, text('Donate', 'সাহায্য করুন'))}</p>
          <h2>{resolve(language, cta.headline || text(copy.en.donationTitle, copy.bn.donationTitle))}</h2>
          <p>{resolve(language, cta.body || text(copy.en.donationBody, copy.bn.donationBody))}</p>
        </div>
        <Link className="btn btn-solid" to="/get-involved#donate">
          {resolve(language, text('Donate now', 'আজই সাহায্যের হাত বাড়িয়ে দিন'))}
        </Link>
      </section>
    </main>
  )
}

export default Home
