import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'
import { invalidateCache } from '../../lib/contentCache.js'

const router = Router()

// Public route - fetch home content
router.get('/', async (req, res) => {
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

// Admin routes
router.use(verifyJWT)

/**
 * PATCH /api/admin/content/home/:section/:fieldKey
 * Update home page content field
 */
router.patch('/:section/:fieldKey', async (req, res) => {
  try {
    const { section, fieldKey } = req.params
    const { valueEn, valueBn } = req.body

    const page = 'home'

    const existing = await prisma.siteContent.findFirst({
      where: { page, section, fieldKey },
    })

    let content
    if (existing) {
      content = await prisma.siteContent.update({
        where: { id: existing.id },
        data: {
          valueEn: valueEn !== undefined ? valueEn : existing.valueEn,
          valueBn: valueBn !== undefined ? valueBn : existing.valueBn,
          updatedAt: new Date(),
        },
      })
    } else {
      content = await prisma.siteContent.create({
        data: {
          page,
          section,
          fieldKey,
          valueEn,
          valueBn,
        },
      })
    }

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({
      success: true,
      data: content,
    })
  } catch (error) {
    console.error('Error updating home content:', error)
    res.status(500).json({ error: 'Failed to update home content' })
  }
})

export default router
