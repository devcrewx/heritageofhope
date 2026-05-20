import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'
import {
  handleValidationErrors,
  validateTextInput,
  validateEmail,
  validateUrl,
} from '../../middleware/validation.js'
import { body } from 'express-validator'

const router = Router()

// Public route - get all settings
router.get('/', async (req, res) => {
  try {
    const contents = await prisma.siteContent.findMany({
      where: { page: 'settings' },
    })

    // Organize by field
    const settings = {}
    contents.forEach((item) => {
      settings[item.fieldKey] = {
        en: item.valueEn,
        bn: item.valueBn,
      }
    })

    res.json({ success: true, data: settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
})

// Admin routes
router.use(verifyJWT)

/**
 * PATCH /api/admin/settings
 * Update multiple settings at once
 */
router.patch(
  '/',
  [
    body('org_name').optional().trim().isLength({ min: 2, max: 200 }),
    body('phone').optional().trim().isLength({ min: 5, max: 20 }),
    body('email').optional().isEmail(),
    body('address').optional().trim().isLength({ min: 10, max: 500 }),
    body('facebook_url').optional().isURL(),
    body('registered_badge').optional().trim().isLength({ max: 100 }),
    body('est_year').optional().trim().isLength({ max: 50 }),
    body('navbar_subtitle').optional().trim().isLength({ max: 200 }),
    body('footer_mission').optional().trim().isLength({ max: 500 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { org_name, phone, email, address, facebook_url, registered_badge, est_year, navbar_subtitle, footer_mission } =
        req.body

      const updates = {
        org_name,
        phone,
        email,
        address,
        facebook_url,
        registered_badge,
        est_year,
        navbar_subtitle,
        footer_mission,
      }

      const saved = {}

      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          const existing = await prisma.siteContent.findFirst({
            where: { page: 'settings', fieldKey: key },
          })

          let content
          if (existing) {
            content = await prisma.siteContent.update({
              where: { id: existing.id },
              data: { valueEn: value, updatedAt: new Date() },
            })
          } else {
            content = await prisma.siteContent.create({
              data: { page: 'settings', section: 'org', fieldKey: key, valueEn: value },
            })
          }

          saved[key] = value
        }
      }

      // Log audit
      await logAudit(req.user.sub, 'UPDATE_SETTINGS', 'site_content', null, `Updated settings: ${Object.keys(saved).join(', ')}`)

      res.json({ success: true, data: saved })
    } catch (error) {
      console.error('Error updating settings:', error)
      res.status(500).json({ error: 'Failed to update settings' })
    }
  },
)

/**
 * GET /api/admin/settings/:key
 * Get specific setting
 */
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params

    const content = await prisma.siteContent.findFirst({
      where: { page: 'settings', fieldKey: key },
    })

    if (!content) {
      return res.status(404).json({ error: 'Setting not found' })
    }

    res.json({
      success: true,
      data: {
        key,
        en: content.valueEn,
        bn: content.valueBn,
      },
    })
  } catch (error) {
    console.error('Error fetching setting:', error)
    res.status(500).json({ error: 'Failed to fetch setting' })
  }
})

/**
 * Helper: Log audit trail
 */
async function logAudit(adminId, action, tableName, recordId, note = '') {
  try {
    await prisma.auditLog.create({
      data: {
        adminId,
        action,
        tableName,
        recordId,
        note,
      },
    })
  } catch (err) {
    console.warn('Failed to log audit:', err)
  }
}

export default router
