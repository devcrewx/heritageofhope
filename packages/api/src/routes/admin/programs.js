import { Router } from 'express'
import { body } from 'express-validator'
import { prisma } from '../../lib/prisma.js'
import { invalidateCache } from '../../lib/contentCache.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../../lib/cloudinary.js'
import { upload } from '../../middleware/uploadMiddleware.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'
import { handleValidationErrors } from '../../middleware/validation.js'

const router = Router()

router.use(verifyJWT)

// GET /api/admin/programs
router.get('/', async (_req, res) => {
  try {
    const items = await prisma.program.findMany({ orderBy: { sortOrder: 'asc' } })
    res.json({ success: true, items })
  } catch (err) {
    console.error('Failed fetching programs:', err)
    res.status(500).json({ error: 'Failed to fetch programs' })
  }
})

// POST /api/admin/programs (with image upload)
router.post(
  '/',
  upload.single('image'),
  [
    body('slug').trim().notEmpty().isLength({ max: 200 }).withMessage('slug is required and must be ≤200 characters'),
    body('titleEn').trim().notEmpty().isLength({ max: 200 }).withMessage('titleEn is required and must be ≤200 characters'),
    body('titleBn').if(body('titleBn').notEmpty()).trim().isLength({ max: 200 }),
    body('categoryEn').if(body('categoryEn').notEmpty()).trim().isLength({ max: 100 }),
    body('categoryBn').if(body('categoryBn').notEmpty()).trim().isLength({ max: 100 }),
    body('descriptionEn').if(body('descriptionEn').notEmpty()).trim().isLength({ max: 5000 }),
    body('descriptionBn').if(body('descriptionBn').notEmpty()).trim().isLength({ max: 5000 }),
    body('highlightEn').if(body('highlightEn').notEmpty()).trim().isLength({ max: 500 }),
    body('highlightBn').if(body('highlightBn').notEmpty()).trim().isLength({ max: 500 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { slug, categoryEn, categoryBn, titleEn, titleBn, descriptionEn, descriptionBn, highlightEn, highlightBn, sortOrder } = req.body

      if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(500).json({ error: 'Cloudinary not configured on server' })
      }

      let imageUrl = null
      let imagePublicId = null

      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file.buffer, 'heritage-of-hope/programs', {
            resourceType: 'image',
            transformation: [
              { width: 1200, crop: 'limit', quality: 'auto:good' },
            ],
          })
          imageUrl = result.secure_url
          imagePublicId = result.public_id
        } catch (uploadErr) {
          console.error('Cloudinary upload failed:', uploadErr)
          return res.status(500).json({ error: 'Image upload to Cloudinary failed' })
        }
      } else {
        return res.status(400).json({ error: 'Image file is required' })
      }

      const maxResult = await prisma.program.aggregate({ _max: { sortOrder: true } })
      const nextSort = sortOrder !== undefined ? Number(sortOrder) : (maxResult._max.sortOrder ?? -1) + 1

      const item = await prisma.program.create({
        data: {
          slug,
          imageUrl,
          imagePublicId,
          categoryEn,
          categoryBn,
          titleEn,
          titleBn,
          descriptionEn,
          descriptionBn,
          highlightEn,
          highlightBn,
          sortOrder: Number.isNaN(nextSort) ? 0 : nextSort,
        },
      })

      invalidateCache()

      res.json({ success: true, data: item })
    } catch (err) {
      console.error('Failed creating program:', err)
      res.status(500).json({ error: 'Failed to create program' })
    }
  }
)

// PATCH reorder
router.patch('/reorder', async (req, res) => {
  try {
    const { items } = req.body
    if (!Array.isArray(items)) return res.status(400).json({ error: 'items must be array' })
    if (!items.every((it) => Number.isInteger(Number(it.id)) && Number(it.id) > 0 && Number.isInteger(Number(it.sortOrder)))) {
      return res.status(400).json({ error: 'Each item must have a valid id and sortOrder' })
    }

    const updated = await Promise.all(
      items.map((it) =>
        prisma.program.update({ where: { id: Number(it.id) }, data: { sortOrder: Number(it.sortOrder) } })
      )
    )

    invalidateCache()

    res.json({ success: true, updated })
  } catch (err) {
    console.error('Failed reordering programs:', err)
    res.status(500).json({ error: 'Failed to reorder' })
  }
})

// PATCH /api/admin/programs/:id (with optional image replacement)
router.patch(
  '/:id',
  upload.single('image'),
  [
    body('slug').if(body('slug').notEmpty()).trim().isLength({ max: 200 }),
    body('titleEn').if(body('titleEn').notEmpty()).trim().isLength({ max: 200 }),
    body('titleBn').if(body('titleBn').notEmpty()).trim().isLength({ max: 200 }),
    body('categoryEn').if(body('categoryEn').notEmpty()).trim().isLength({ max: 100 }),
    body('categoryBn').if(body('categoryBn').notEmpty()).trim().isLength({ max: 100 }),
    body('descriptionEn').if(body('descriptionEn').notEmpty()).trim().isLength({ max: 5000 }),
    body('descriptionBn').if(body('descriptionBn').notEmpty()).trim().isLength({ max: 5000 }),
    body('highlightEn').if(body('highlightEn').notEmpty()).trim().isLength({ max: 500 }),
    body('highlightBn').if(body('highlightBn').notEmpty()).trim().isLength({ max: 500 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params
      const data = { ...req.body }

      if (req.file) {
        const program = await prisma.program.findUnique({ where: { id: Number(id) } })
        if (program && program.imagePublicId) {
          try {
            await deleteFromCloudinary(program.imagePublicId)
          } catch (deleteErr) {
            console.warn('Failed to delete old Cloudinary image:', deleteErr)
          }
        }

        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
          return res.status(500).json({ error: 'Cloudinary not configured on server' })
        }

        try {
          const result = await uploadToCloudinary(req.file.buffer, 'heritage-of-hope/programs', {
            resourceType: 'image',
            transformation: [
              { width: 1200, crop: 'limit', quality: 'auto:good' },
            ],
          })
          data.imageUrl = result.secure_url
          data.imagePublicId = result.public_id
        } catch (uploadErr) {
          console.error('Cloudinary upload failed:', uploadErr)
          return res.status(500).json({ error: 'Image upload to Cloudinary failed' })
        }
      }

      const item = await prisma.program.update({ where: { id: Number(id) }, data })

      invalidateCache()

      res.json({ success: true, data: item })
    } catch (err) {
      console.error('Failed updating program:', err)
      res.status(500).json({ error: 'Failed to update program' })
    }
  }
)

// DELETE /api/admin/programs/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const program = await prisma.program.findUnique({ where: { id: Number(id) } })

    if (program && program.imagePublicId) {
      try {
        await deleteFromCloudinary(program.imagePublicId)
      } catch (deleteErr) {
        console.warn('Failed to delete Cloudinary image:', deleteErr)
      }
    }

    await prisma.program.delete({ where: { id: Number(id) } })

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true, message: 'Program deleted' })
  } catch (err) {
    console.error('Failed deleting program:', err)
    res.status(500).json({ error: 'Failed to delete program' })
  }
})

export default router
