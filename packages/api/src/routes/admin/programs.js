import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../../lib/cloudinary.js'
import fs from 'fs'
import { upload } from '../../middleware/uploadMiddleware.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'

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
router.post('/', upload.single('image'), async (req, res) => {
  try {
    try {
      fs.appendFileSync('/tmp/programs-debug.log', `[${new Date().toISOString()}] POST /api/admin/programs entered. bodyKeys=${Object.keys(req.body).join(',')} file=${req.file ? 'yes' : 'no'}\n`)
      if (req.file) {
        fs.appendFileSync('/tmp/programs-debug.log', `[${new Date().toISOString()}] file: mimetype=${req.file.mimetype} size=${req.file.size}\n`)
      }
    } catch (e) {}
    const { slug, categoryEn, categoryBn, titleEn, titleBn, descriptionEn, descriptionBn, highlightEn, highlightBn, sortOrder } = req.body

    if (!slug || !titleEn) {
      return res.status(400).json({ error: 'slug and titleEn are required' })
    }

    let imageUrl = null
    let imagePublicId = null

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        try { fs.appendFileSync('/tmp/programs-debug.log', `[${new Date().toISOString()}] before uploadToCloudinary\n`) } catch (e) {}
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
          const msg = 'Cloudinary not configured; aborting upload'
          console.warn(msg)
          fs.appendFileSync('/tmp/programs-error.log', `[${new Date().toISOString()}] ${msg}\n`)
          return res.status(500).json({ error: 'Cloudinary not configured on server' })
        }

        const result = await uploadToCloudinary(req.file.buffer, 'heritage-of-hope/programs', {
          resourceType: 'image',
          transformation: [
            { width: 1200, crop: 'limit', quality: 'auto:good' },
          ],
        })
        try { fs.appendFileSync('/tmp/programs-debug.log', `[${new Date().toISOString()}] upload result: ${JSON.stringify(result)}\n`) } catch (e) {}
        imageUrl = result.secure_url
        imagePublicId = result.public_id
      } catch (uploadErr) {
        console.error('Cloudinary upload failed:', uploadErr)
        try { fs.appendFileSync('/tmp/programs-debug.log', `[${new Date().toISOString()}] uploadErr: ${uploadErr.stack || uploadErr}\n`) } catch (e) {}
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

    res.json({ success: true, data: item })
  } catch (err) {
    console.error('Failed creating program:', err)
    try { fs.appendFileSync('/tmp/programs-debug.log', `[${new Date().toISOString()}] createErr: ${err.stack || err}\n`) } catch (e) {}
    res.status(500).json({ error: 'Failed to create program' })
  }
})

// PATCH reorder
router.patch('/reorder', async (req, res) => {
  try {
    const { items } = req.body
    if (!Array.isArray(items)) return res.status(400).json({ error: 'items must be array' })

    const updated = await Promise.all(
      items.map((it) =>
        prisma.program.update({ where: { id: Number(it.id) }, data: { sortOrder: Number(it.sortOrder) } })
      )
    )

    res.json({ success: true, updated })
  } catch (err) {
    console.error('Failed reordering programs:', err)
    res.status(500).json({ error: 'Failed to reorder' })
  }
})

// PATCH /api/admin/programs/:id (with optional image replacement)
router.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params
    const data = { ...req.body }

    // Handle image replacement
    if (req.file) {
      const program = await prisma.program.findUnique({ where: { id: Number(id) } })
      if (program && program.imagePublicId) {
        try {
          await deleteFromCloudinary(program.imagePublicId)
        } catch (deleteErr) {
          console.warn('Failed to delete old Cloudinary image:', deleteErr)
        }
      }

      try {
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
          console.warn('Cloudinary not configured; aborting upload')
          return res.status(500).json({ error: 'Cloudinary not configured on server' })
        }

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
    res.json({ success: true, data: item })
  } catch (err) {
    console.error('Failed updating program:', err)
    res.status(500).json({ error: 'Failed to update program' })
  }
})

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
    res.json({ success: true, message: 'Program deleted' })
  } catch (err) {
    console.error('Failed deleting program:', err)
    res.status(500).json({ error: 'Failed to delete program' })
  }
})

export default router
