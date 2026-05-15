import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { resolve, text } from '../content'

function Gallery() {
  const { language, siteContent } = useOutletContext()
  const { gallery } = siteContent
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: text('All', 'সব') },
    { id: 'education', label: text('Education', 'শিক্ষা') },
    { id: 'healthcare', label: text('Healthcare', 'স্বাস্থ্য') },
    { id: 'welfare', label: text('Welfare', 'কল্যাণ') },
  ]

  const visibleItems = useMemo(() => {
    if (activeCategory === 'all') {
      return gallery.galleryItems
    }

    return gallery.galleryItems.filter((item) => {
      const itemCategory = resolve('en', item.category).toLowerCase()
      return itemCategory === activeCategory
    })
  }, [activeCategory, gallery.galleryItems])

  const copy = {
    en: {
      title: 'Moments of hope and action.',
      intro:
        'A visual journey through our health camps, learning centers, and community outreach events.',
    },
    bn: {
      title: 'আমাদের সমাজসেবামূলক কাজের কিছু বিশেষ মুহূর্ত।',
      intro:
        'আমাদের স্বাস্থ্য শিবির, শিক্ষাকেন্দ্র এবং বিভিন্ন সামাজিক অনুষ্ঠানের কিছু খণ্ডচিত্র।',
    },
  }

  return (
    <main className="page-stack">
      <section className="panel split-panel">
        <div>
          <p className="eyebrow">{resolve(language, text('Gallery', 'ছবিঘর'))}</p>
          <h1 className="page-title">{copy[language].title}</h1>
          <p>{copy[language].intro}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, text('Explore', 'ঘুরে দেখুন'))}</p>
          <p>{resolve(language, text('Filter photos by our core impact areas.', 'কোন কাজের ছবি দেখতে চান, সেটা বেছে নিন।'))}</p>
        </div>
      </section>

      <section className="panel">
        <div className="filter-row" role="tablist" aria-label={resolve(language, text('Gallery categories', 'ছবির বিভাগ'))}>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={category.id === activeCategory ? 'filter-chip active' : 'filter-chip'}
              onClick={() => setActiveCategory(category.id)}
            >
              {resolve(language, category.label)}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {visibleItems.map((item) => (
            <article key={resolve(language, item.title)} className="gallery-card">
              <img loading="lazy" src={item.image} alt={resolve(language, item.title)} />
              <div>
                <span className="pill">{resolve(language, item.category)}</span>
                <h3>{resolve(language, item.title)}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Gallery
