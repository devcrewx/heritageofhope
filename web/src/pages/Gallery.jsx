import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { galleryItems, resolve, text } from '../content'

function Gallery() {
  const { language } = useOutletContext()
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Education', 'Healthcare', 'Welfare']

  const visibleItems = useMemo(() => {
    if (activeCategory === 'All') {
      return galleryItems
    }

    return galleryItems.filter((item) => resolve(language, item.category) === activeCategory)
  }, [activeCategory, language])

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
          <p className="eyebrow">Gallery</p>
          <h1 className="page-title">{copy[language].title}</h1>
          <p>{copy[language].intro}</p>
        </div>
        <div className="mini-panel">
          <p className="meta">{resolve(language, text('Explore', 'ঘুরে দেখুন'))}</p>
          <p>{resolve(language, text('Filter photos by our core impact areas.', 'বিভাগ অনুযায়ী ছবিগুলো দেখুন।'))}</p>
        </div>
      </section>

      <section className="panel">
        <div className="filter-row" role="tablist" aria-label="Gallery categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={category === activeCategory ? 'filter-chip active' : 'filter-chip'}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {visibleItems.map((item) => (
            <article key={resolve(language, item.title)} className="gallery-card">
              <img src={item.image} alt={resolve(language, item.title)} />
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
