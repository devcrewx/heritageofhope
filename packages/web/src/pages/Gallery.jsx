import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { resolve, text } from '../utils/i18n'

function Gallery() {
  const { language, siteContent } = useOutletContext()
  const { gallery } = siteContent
  const page = gallery.pageContent || {}
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: page.filterChipAll || text('All', 'সব') },
    { id: 'education', label: page.filterChipEducation || text('Education', 'শিক্ষা') },
    { id: 'healthcare', label: page.filterChipHealthcare || text('Healthcare', 'স্বাস্থ্য') },
    { id: 'welfare', label: page.filterChipWelfare || text('Welfare', 'কল্যাণ') },
  ]

  const visibleItems = useMemo(() => {
    if (!gallery.items) return []

    if (activeCategory === 'all') {
      return gallery.items
    }

    return gallery.items.filter((item) => {
      const itemCategory = (item.category || '').toLowerCase()
      return itemCategory === activeCategory
    })
  }, [activeCategory, gallery.items])

  return (
    <main className="page-stack">
      <section className="panel split-panel">
        <div>
          <p className="eyebrow">{resolve(language, page.eyebrow)}</p>
          <h1 className="page-title">{resolve(language, page.heading)}</h1>
          <p>{resolve(language, page.intro)}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, page.filterLabel)}</p>
          <p>{resolve(language, page.filterText)}</p>
        </div>
      </section>

      <section className="panel">
        <div className="filter-row" role="group" aria-label={resolve(language, page.filterAriaLabel || text('Gallery categories', 'ছবির বিভাগ'))}>
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
            <article key={item.id || item.url} className="gallery-card">
              <img loading="lazy" src={item.url} alt={item.altEn || ''} />
              <div>
                <span className="pill">{item.category || ''}</span>
                <h3>{resolve(language, { en: item.altEn, bn: item.altBn })}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Gallery
