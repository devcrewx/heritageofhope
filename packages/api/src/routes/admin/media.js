import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../../lib/cloudinary.js'
import { upload } from '../../middleware/uploadMiddleware.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'
import { invalidateCache } from '../../lib/contentCache.js'

const router = Router()
router.use(verifyJWT)

/**
 * POST /api/admin/media/hero
 * Upload hero photo for a specific page
 * Body: page (string), section (optional), data.file + data.altEn + data.altBn
 */
router.post('/hero', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const { page, section = 'hero' } = req.body
    if (!page) {
      return res.status(400).json({ error: 'page parameter is required' })
    }

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ error: 'Cloudinary not configured' })
    }

    // Upload to Cloudinary
    const cloudinaryData = await uploadToCloudinary(req.file.buffer, `heritage-of-hope/heroes/${page}`, {
      resourceType: 'image',
      transformation: [{ width: 1920, crop: 'limit', quality: 'auto:good' }],
    })

    // Store in site_content as a special key
    const fieldKey = 'heroImage'
    const existing = await prisma.siteContent.findFirst({
      where: { page, section, fieldKey },
    })

    let content
    if (existing) {
      // Delete old image from Cloudinary if it exists
      if (existing.valueBn) {
        try {
          await deleteFromCloudinary(existing.valueBn)
        } catch (err) {
          console.warn('Could not delete old Cloudinary asset:', err)
        }
      }

      content = await prisma.siteContent.update({
        where: { id: existing.id },
        data: {
          valueEn: cloudinaryData.secure_url,
          valueBn: cloudinaryData.public_id, // Store public_id for deletion
          updatedAt: new Date(),
        },
      })
    } else {
      content = await prisma.siteContent.create({
        data: {
          page,
          section,
          fieldKey,
          valueEn: cloudinaryData.secure_url,
          valueBn: cloudinaryData.public_id,
        },
      })
    }

    // Log audit
    await logAudit(req.user.sub, 'UPLOAD_HERO', 'site_content', content.id, `Hero image for ${page}/${section}`)
    invalidateCache()

    res.json({
      success: true,
      data: {
        id: content.id,
        page,
        section,
        url: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
      },
    })
  } catch (error) {
    console.error('Hero photo upload error:', error)
    res.status(500).json({ error: `Upload failed: ${error.message}` })
  }
})

/**
 * DELETE /api/admin/media/hero/:page/:section
 * Delete hero photo for a specific page/section
 */
router.delete('/hero/:page/:section', async (req, res) => {
  try {
    const { page, section } = req.params

    const content = await prisma.siteContent.findFirst({
      where: { page, section, fieldKey: 'heroImage' },
    })

    if (!content) {
      return res.status(404).json({ error: 'Hero image not found' })
    }

    // Delete from Cloudinary
    if (content.valueBn) {
      try {
        await deleteFromCloudinary(content.valueBn)
      } catch (err) {
        console.warn('Could not delete Cloudinary asset:', err)
      }
    }

    await prisma.siteContent.delete({ where: { id: content.id } })

    // Log audit
    await logAudit(req.user.sub, 'DELETE_HERO', 'site_content', content.id, `Deleted hero image for ${page}/${section}`)
    invalidateCache()

    res.json({ success: true, message: 'Hero image deleted' })
  } catch (error) {
    console.error('Hero delete error:', error)
    res.status(500).json({ error: 'Failed to delete hero image' })
  }
})

/**
 * POST /api/admin/media/upi-qr
 * Upload UPI QR code image
 */
router.post('/upi-qr', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ error: 'Cloudinary not configured' })
    }

    // Upload QR code - no compression to maintain scanability
    const cloudinaryData = await uploadToCloudinary(req.file.buffer, `heritage-of-hope/upi`, {
      resourceType: 'image',
      transformation: [{ width: 600, crop: 'limit', quality: '100' }],
    })

    // Store in site_content
    const existing = await prisma.siteContent.findFirst({
      where: { page: 'getInvolved', section: 'upi', fieldKey: 'qrUrl' },
    })

    let content
    if (existing) {
      // Delete old QR from Cloudinary
      if (existing.valueBn) {
        try {
          await deleteFromCloudinary(existing.valueBn)
        } catch (err) {
          console.warn('Could not delete old QR image:', err)
        }
      }

      content = await prisma.siteContent.update({
        where: { id: existing.id },
        data: {
          valueEn: cloudinaryData.secure_url,
          valueBn: cloudinaryData.public_id,
          updatedAt: new Date(),
        },
      })
    } else {
      content = await prisma.siteContent.create({
        data: {
          page: 'getInvolved',
          section: 'upi',
          fieldKey: 'qrUrl',
          valueEn: cloudinaryData.secure_url,
          valueBn: cloudinaryData.public_id,
        },
      })
    }

    // Log audit
    await logAudit(req.user.sub, 'UPLOAD_UPI_QR', 'site_content', content.id, 'UPI QR code image')
    invalidateCache()

    res.json({
      success: true,
      data: {
        id: content.id,
        url: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
      },
    })
  } catch (error) {
    console.error('UPI QR upload error:', error)
    res.status(500).json({ error: `Upload failed: ${error.message}` })
  }
})

/**
 * DELETE /api/admin/media/upi-qr
 * Delete UPI QR code image
 */
router.delete('/upi-qr', async (req, res) => {
  try {
    const content = await prisma.siteContent.findFirst({
      where: { page: 'getInvolved', section: 'upi', fieldKey: 'qrUrl' },
    })

    if (!content) {
      return res.status(404).json({ error: 'UPI QR image not found' })
    }

    // Delete from Cloudinary
    if (content.valueBn) {
      try {
        await deleteFromCloudinary(content.valueBn)
      } catch (err) {
        console.warn('Could not delete QR image:', err)
      }
    }

    await prisma.siteContent.delete({ where: { id: content.id } })

    // Log audit
    await logAudit(req.user.sub, 'DELETE_UPI_QR', 'site_content', content.id, 'Deleted UPI QR image')
    invalidateCache()

    res.json({ success: true, message: 'UPI QR code deleted' })
  } catch (error) {
    console.error('UPI QR delete error:', error)
    res.status(500).json({ error: 'Failed to delete UPI QR code' })
  }
})

/**
 * POST /api/admin/media/upload
 * Generic image upload — stores URL in SiteContent at (page, section, fieldKey)
 * Body: multipart with file + page + section + fieldKey
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const { page, section, fieldKey } = req.body
    if (!page || !section || !fieldKey) {
      return res.status(400).json({ error: 'page, section, and fieldKey are required' })
    }

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ error: 'Cloudinary not configured' })
    }

    const folder = `heritage-of-hope/${page}/${section}`
    const cloudinaryData = await uploadToCloudinary(req.file.buffer, folder, {
      resourceType: 'image',
      transformation: [{ width: 1920, crop: 'limit', quality: 'auto:good' }],
    })

    const existing = await prisma.siteContent.findFirst({
      where: { page, section, fieldKey },
    })

    let content
    if (existing) {
      if (existing.valueBn) {
        try {
          await deleteFromCloudinary(existing.valueBn)
        } catch (err) {
          console.warn('Could not delete old Cloudinary asset:', err)
        }
      }
      content = await prisma.siteContent.update({
        where: { id: existing.id },
        data: {
          valueEn: cloudinaryData.secure_url,
          valueBn: cloudinaryData.public_id,
          updatedAt: new Date(),
        },
      })
    } else {
      content = await prisma.siteContent.create({
        data: { page, section, fieldKey, valueEn: cloudinaryData.secure_url, valueBn: cloudinaryData.public_id },
      })
    }

    await logAudit(req.user.sub, 'UPLOAD_IMAGE', 'site_content', content.id, `Image for ${page}/${section}/${fieldKey}`)
    invalidateCache()

    res.json({
      success: true,
      data: { id: content.id, page, section, fieldKey, url: cloudinaryData.secure_url, publicId: cloudinaryData.public_id },
    })
  } catch (error) {
    console.error('Image upload error:', error)
    res.status(500).json({ error: `Upload failed: ${error.message}` })
  }
})

/**
 * DELETE /api/admin/media/:page/:section/:fieldKey
 * Delete any image stored in SiteContent
 */
router.delete('/:page/:section/:fieldKey', async (req, res) => {
  try {
    const { page, section, fieldKey } = req.params

    const content = await prisma.siteContent.findFirst({
      where: { page, section, fieldKey },
    })

    if (!content) {
      return res.status(404).json({ error: 'Image not found' })
    }

    if (content.valueBn) {
      try {
        await deleteFromCloudinary(content.valueBn)
      } catch (err) {
        console.warn('Could not delete Cloudinary asset:', err)
      }
    }

    await prisma.siteContent.delete({ where: { id: content.id } })

    await logAudit(req.user.sub, 'DELETE_IMAGE', 'site_content', content.id, `Deleted image for ${page}/${section}/${fieldKey}`)
    invalidateCache()

    res.json({ success: true, message: 'Image deleted' })
  } catch (error) {
    console.error('Image delete error:', error)
    res.status(500).json({ error: 'Failed to delete image' })
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
