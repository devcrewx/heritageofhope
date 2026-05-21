import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { invalidateCache } from '../../lib/contentCache.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'

const router = Router()

// Apply JWT verification to all routes
router.use(verifyJWT)

function resolveContentFields(body) {
  const valueEn = body.valueEn !== undefined ? body.valueEn : body.en
  const valueBn = body.valueBn !== undefined ? body.valueBn : body.bn
  return { valueEn, valueBn }
}

function mergeContentValues(existing, valueEn, valueBn) {
  return {
    valueEn: valueEn !== undefined ? valueEn : existing.valueEn,
    valueBn: valueBn !== undefined ? valueBn : existing.valueBn,
    updatedAt: new Date(),
  }
}

/**
 * PATCH /api/admin/content/settings/:fieldKey
 * Simple settings endpoint for basic NGO contact info
 * Body: { valueEn, valueBn }
 */
router.patch('/settings/:fieldKey', async (req, res) => {
  try {
    const { fieldKey } = req.params
    const { valueEn, valueBn } = resolveContentFields(req.body)

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
        data: mergeContentValues(existing, valueEn, valueBn),
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

    // Invalidate cached content so next request fetches fresh data
    invalidateCache()

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
    const { valueEn, valueBn } = resolveContentFields(req.body)

    // Only reject if both language values are completely absent (undefined).
    // Allow empty strings so admins can explicitly clear content.
    if (valueEn === undefined && valueBn === undefined) {
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
        data: mergeContentValues(existing, valueEn, valueBn),
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

    // Invalidate cached content so next request fetches fresh data
    invalidateCache()

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

/**
 * DELETE /api/admin/content/:page/:section/:fieldKey
 * Delete a site content record by page, section, and fieldKey.
 */
router.delete('/:page/:section/:fieldKey', async (req, res) => {
  try {
    const { page, section, fieldKey } = req.params

    const existing = await prisma.siteContent.findFirst({
      where: { page, section, fieldKey },
    })

    if (!existing) {
      return res.status(404).json({ error: 'Not found' })
    }

    await prisma.siteContent.delete({ where: { id: existing.id } })
    invalidateCache()

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting content:', error)
    res.status(500).json({ error: 'Failed to delete content' })
  }
})

export default router
