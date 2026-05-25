import { Router } from 'express'
import { getSiteContent } from '../../data/siteContent.js'
import { getCachedContent, setCachedContent } from '../../lib/contentCache.js'
import { prisma } from '../../lib/prisma.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    // Try cached version first
    const cached = getCachedContent()
    if (cached) {
      return res.json(cached)
    }

    // Fetch fresh from database (batched to reduce connection pool strain)
    const content = await getSiteContent()
    
    // Cache for 1 minute
    setCachedContent(content)
    
    res.json(content)
  } catch (error) {
    console.error('Error fetching content:', error)
    
    // If freshness fails, try serving stale cache as degraded response
    const stale = getCachedContent()
    if (stale) {
      console.warn('Serving stale cache due to database error')
      return res.json(stale)
    }
    
    res.status(500).json({ error: 'Failed to fetch site content' })
  }
})

router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.siteContent.findMany({
      where: { page: 'settings' },
    })
    res.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
})

router.get('/home', async (req, res) => {
  try {
    const contents = await prisma.siteContent.findMany({
      where: { page: 'home' },
    })

    // Organize by section
    const organized = {}
    contents.forEach((item) => {
      if (!organized[item.section]) {
        organized[item.section] = {}
      }
      organized[item.section][item.fieldKey] = {
        en: item.valueEn,
        bn: item.valueBn,
      }
    })

    res.json({
      success: true,
      page: 'home',
      sections: organized,
    })
  } catch (error) {
    console.error('Error fetching home content:', error)
    res.status(500).json({ error: 'Failed to fetch home content' })
  }
})

router.get('/:page', async (req, res) => {
  try {
    const content = await getSiteContent()
    const page = req.params.page

    if (page in content) {
      res.json(content[page])
      return
    }

    res.status(404).json({ error: 'Page content not found' })
  } catch (error) {
    console.error('Error fetching content:', error)
    res.status(500).json({ error: 'Failed to fetch site content' })
  }
})

export default router
