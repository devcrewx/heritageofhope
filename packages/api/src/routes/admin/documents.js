import { Router } from 'express'
import multer from 'multer'
import { prisma } from '../../lib/prisma.js'
import { invalidateCache } from '../../lib/contentCache.js'
import { cloudinary, uploadToCloudinary, deleteFromCloudinary } from '../../lib/cloudinary.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'

const router = Router()
const storage = multer.memoryStorage()

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
    return
  }
  cb(new Error('Only PDF files are allowed'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
})

router.use(verifyJWT)

router.get('/', async (_req, res) => {
  try {
    const items = await prisma.document.findMany({ orderBy: { sortOrder: 'asc' } })
    res.json({ success: true, items })
  } catch (err) {
    console.error('Failed fetching documents:', err)
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
})

router.post('/', upload.fields([{ name: 'pdf', maxCount: 1 }]), async (req, res) => {
  try {
    const { titleEn, titleBn, descriptionEn, descriptionBn, date } = req.body
    const pdfFile = req.files?.pdf?.[0]

    if (!titleEn) return res.status(400).json({ error: 'titleEn is required' })
    if (!pdfFile) return res.status(400).json({ error: 'PDF file is required' })

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ error: 'Cloudinary not configured' })
    }

    const highestSort = await prisma.document.aggregate({ _max: { sortOrder: true } })
    const nextSortOrder = (highestSort._max.sortOrder ?? -1) + 1

    const pdfData = await uploadToCloudinary(pdfFile.buffer, 'heritage-of-hope/documents', {
      resourceType: 'image',
    })

    const previewImgUrl = cloudinary.url(pdfData.public_id, {
      resource_type: 'image',
      transformation: [{ width: 400, crop: 'limit' }],
      format: 'jpg',
      page: 1,
    })

    const item = await prisma.document.create({
      data: {
        titleEn,
        titleBn: titleBn || null,
        descriptionEn: descriptionEn || null,
        descriptionBn: descriptionBn || null,
        date: date ? new Date(date) : null,
        pdfUrl: pdfData.secure_url,
        pdfPublicId: pdfData.public_id,
        previewImgUrl,
        sortOrder: nextSortOrder,
      },
    })

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true, data: item })
  } catch (err) {
    console.error('Failed creating document:', err)
    res.status(500).json({ error: `Failed to create document: ${err.message}` })
  }
})

router.patch('/reorder', async (req, res) => {
  try {
    const { items } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be array' })
    }
    if (!items.every((item) => Number.isInteger(Number(item.id)) && Number(item.id) > 0 && Number.isInteger(Number(item.sortOrder)))) {
      return res.status(400).json({ error: 'Each item must have a valid id and sortOrder' })
    }

    const updated = await Promise.all(
      items.map((item) =>
        prisma.document.update({
          where: { id: Number(item.id) },
          data: { sortOrder: Number(item.sortOrder) },
        })
      )
    )

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true, updated })
  } catch (err) {
    console.error('Failed reordering documents:', err)
    res.status(500).json({ error: 'Failed to reorder documents' })
  }
})

router.patch('/:id', upload.fields([{ name: 'pdf', maxCount: 1 }]), async (req, res) => {
  try {
    const { id } = req.params
    const { titleEn, titleBn, descriptionEn, descriptionBn, date } = req.body
    const pdfFile = req.files?.pdf?.[0]

    const existing = await prisma.document.findUnique({ where: { id: Number(id) } })
    if (!existing) return res.status(404).json({ error: 'Document not found' })

    const data = {}
    if (titleEn !== undefined) data.titleEn = titleEn
    if (titleBn !== undefined) data.titleBn = titleBn || null
    if (descriptionEn !== undefined) data.descriptionEn = descriptionEn || null
    if (descriptionBn !== undefined) data.descriptionBn = descriptionBn || null
    if (date !== undefined) data.date = date ? new Date(date) : null

    if (pdfFile) {
      if (existing.pdfPublicId) {
        try { await deleteFromCloudinary(existing.pdfPublicId) } catch (e) { console.warn('Failed deleting old PDF:', e) }
      }
      const pdfData = await uploadToCloudinary(pdfFile.buffer, 'heritage-of-hope/documents', { resourceType: 'image' })
      data.pdfUrl = pdfData.secure_url
      data.pdfPublicId = pdfData.public_id
      data.previewImgUrl = cloudinary.url(pdfData.public_id, {
        resource_type: 'image',
        transformation: [{ width: 400, crop: 'limit' }],
        format: 'jpg',
        page: 1,
      })
    }

    const item = await prisma.document.update({ where: { id: Number(id) }, data })

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true, data: item })
  } catch (err) {
    console.error('Failed updating document:', err)
    res.status(500).json({ error: `Failed to update document: ${err.message}` })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const item = await prisma.document.findUnique({ where: { id: Number(id) } })
    if (!item) return res.status(404).json({ error: 'Document not found' })

    if (item.pdfPublicId) {
      try { await deleteFromCloudinary(item.pdfPublicId) } catch (e) { console.warn('Failed deleting PDF:', e) }
    }
    if (item.previewImgPublicId) {
      try { await deleteFromCloudinary(item.previewImgPublicId) } catch (e) { console.warn('Failed deleting preview:', e) }
    }

    await prisma.document.delete({ where: { id: Number(id) } })

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true })
  } catch (err) {
    console.error('Failed deleting document:', err)
    res.status(500).json({ error: `Failed to delete document: ${err.message}` })
  }
})

export default router
