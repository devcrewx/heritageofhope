import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'

const router = Router()

// Apply JWT verification to all routes
router.use(verifyJWT)

/**
 * PATCH /api/admin/content/settings/:fieldKey
 * Simple settings endpoint for basic NGO contact info
 * Body: { valueEn, valueBn }
 */
router.patch('/settings/:fieldKey', async (req, res) => {
  try {
    const { fieldKey } = req.params
    const { valueEn, valueBn } = req.body

    const page = 'settings'
    const section = 'general'

    // First try to find existing record
    const existing = await prisma.siteContent.findFirst({
      where: { page, section, fieldKey },
    })

    let content
    if (existing) {
      content = await prisma.siteContent.update({
        where: { id: existing.id },
        data: {
          valueEn: valueEn || existing.valueEn,
          valueBn: valueBn || existing.valueBn,
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

    res.json({
      success: true,
      data: content,
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    res.status(500).json({ error: 'Failed to update settings' })
  }
})

/**
 * PATCH /api/admin/content/:page/:section/:fieldKey
 * Update or create a single site content field
 * Body: { valueEn, valueBn }
 */
router.patch('/:page/:section/:fieldKey', async (req, res) => {
  try {
    const { page, section, fieldKey } = req.params
    const { valueEn, valueBn } = req.body

    if (!valueEn && !valueBn) {
      return res.status(400).json({ error: 'At least one language value is required' })
    }

    // First try to find existing record
    const existing = await prisma.siteContent.findFirst({
      where: { page, section, fieldKey },
    })

    let content
    if (existing) {
      content = await prisma.siteContent.update({
        where: { id: existing.id },
        data: {
          valueEn: valueEn || existing.valueEn,
          valueBn: valueBn || existing.valueBn,
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

    res.json({
      success: true,
      data: content,
    })
  } catch (error) {
    console.error('Error updating content:', error)
    res.status(500).json({ error: 'Failed to update content' })
  }
})

/**
 * GET /api/admin/content/:page
 * Fetch all content for a page
 */
router.get('/:page', async (req, res) => {
  try {
    const { page } = req.params

    const contents = await prisma.siteContent.findMany({
      where: { page },
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
      page,
      sections: organized,
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    res.status(500).json({ error: 'Failed to fetch content' })
  }
})

/**
 * GET /api/content/settings
 * Public endpoint: fetch all settings (no auth required)
 */
router.get('/', async (req, res) => {
  try {
    const contents = await prisma.siteContent.findMany({
      where: { page: 'settings' },
    })

    res.json(contents)
  } catch (error) {
    console.error('Error fetching settings:', error)
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
})

export default router
