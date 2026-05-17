import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import { prisma } from '../../lib/prisma.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../../lib/cloudinary.js'
import { upload } from '../../middleware/uploadMiddleware.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'
import {
  handleValidationErrors,
  validateGalleryItem,
  validateId,
} from '../../middleware/validation.js'

const router = Router()

router.use(verifyJWT)

// GET /api/admin/gallery
router.get('/', async (_req, res) => {
  try {
    const items = await prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' } })
    res.json({ success: true, items })
  } catch (err) {
    console.error('Failed fetching gallery items:', err)
    res.status(500).json({ error: 'Failed to fetch gallery items' })
  }
})

// POST /api/admin/gallery
// Supports the current admin UI contract: multipart/form-data with `files`
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' })
    }

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ error: 'Cloudinary not configured' })
    }

    const highestSort = await prisma.galleryItem.aggregate({ _max: { sortOrder: true } })
    let nextSortOrder = (highestSort._max.sortOrder ?? -1) + 1

    const category = req.body.category || 'gallery'
    const altEn = req.body.altEn || ''
    const altBn = req.body.altBn || ''
    const uploaded = []

    for (const file of req.files) {
      const cloudinaryData = await uploadToCloudinary(file.buffer, 'heritage-of-hope/gallery', {
        resourceType: 'image',
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto:good' }],
      })

      const item = await prisma.galleryItem.create({
        data: {
          url: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          altEn: altEn || file.originalname,
          altBn: altBn || file.originalname,
          category,
          sortOrder: nextSortOrder,
        },
      })

      uploaded.push(item)
      nextSortOrder += 1
    }

    res.json({ success: true, uploaded, count: uploaded.length })
  } catch (error) {
    console.error('Gallery upload error:', error)
    res.status(500).json({ error: `Upload failed: ${error.message}` })
  }
})

// PATCH /api/admin/gallery/reorder
router.patch('/reorder', async (req, res) => {
  try {
    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No reorder items provided' })
    }

    const updated = await Promise.all(
      items.map((item) =>
        prisma.galleryItem.update({
          where: { id: Number(item.id) },
          data: { sortOrder: Number(item.sortOrder) },
        })
      )
    )

    res.json({ success: true, updated })
  } catch (error) {
    console.error('Failed updating gallery order:', error)
    res.status(500).json({ error: 'Failed to update sort order' })
  }
})

// PATCH /api/admin/gallery/:id
router.patch(
  '/:id',
  [
    validateId('id'),
    ...validateGalleryItem(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params
      const { category, altEn, altBn } = req.body

      const item = await prisma.galleryItem.update({
        where: { id: Number(id) },
        data: {
          ...(category !== undefined && { category: category.trim() }),
          ...(altEn !== undefined && { altEn: altEn.trim() }),
          ...(altBn !== undefined && { altBn: altBn.trim() }),
        },
      })

      res.json({ success: true, item })
    } catch (error) {
      console.error('Failed updating gallery item:', error)
      res.status(500).json({ error: 'Failed to update gallery item' })
    }
  }
)

// DELETE /api/admin/gallery/:id
router.delete(
  '/:id',
  [validateId('id')],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params

      const item = await prisma.galleryItem.findUnique({ where: { id: Number(id) } })

      if (!item) {
        return res.status(404).json({ error: 'Gallery item not found' })
      }

      if (item.publicId) {
        try {
          await deleteFromCloudinary(item.publicId)
        } catch (deleteErr) {
          console.warn('Failed to delete Cloudinary asset:', deleteErr)
        }
      }

      await prisma.galleryItem.delete({ where: { id: Number(id) } })
      res.json({ success: true, message: 'Gallery item deleted' })
    } catch (error) {
      console.error('Gallery delete error:', error)
      res.status(500).json({ error: 'Failed to delete gallery item' })
    }
  }
)

export default router
