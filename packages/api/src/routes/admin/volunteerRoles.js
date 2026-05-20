import { Router } from 'express'
import { body } from 'express-validator'
import { prisma } from '../../lib/prisma.js'
import { invalidateCache } from '../../lib/contentCache.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'
import { handleValidationErrors } from '../../middleware/validation.js'

const router = Router()

router.use(verifyJWT)

router.get('/', async (_req, res) => {
  try {
    const items = await prisma.volunteerRole.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    res.json({ success: true, items })
  } catch {
    res.status(500).json({ error: 'Failed to fetch volunteer roles' })
  }
})

router.post(
  '/',
  [
    body('titleEn').trim().notEmpty().isLength({ min: 2, max: 200 }).withMessage('titleEn is required and must be 2-200 characters'),
    body('titleBn').if(body('titleBn').notEmpty()).trim().isLength({ max: 200 }),
    body('descriptionEn').if(body('descriptionEn').notEmpty()).trim().isLength({ max: 2000 }),
    body('descriptionBn').if(body('descriptionBn').notEmpty()).trim().isLength({ max: 2000 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { titleEn, titleBn, descriptionEn, descriptionBn, sortOrder } = req.body

      const maxResult = await prisma.volunteerRole.aggregate({ _max: { sortOrder: true } })
      const nextSortOrder = sortOrder !== undefined ? Number(sortOrder) : (maxResult._max.sortOrder ?? -1) + 1

      const item = await prisma.volunteerRole.create({
        data: {
          titleEn,
          titleBn,
          descriptionEn,
          descriptionBn,
          sortOrder: Number.isNaN(nextSortOrder) ? 0 : nextSortOrder,
        },
      })

      invalidateCache()

      res.json({ success: true, data: item })
    } catch {
      res.status(500).json({ error: 'Failed to create volunteer role' })
    }
  }
)

router.patch('/reorder', async (req, res) => {
  try {
    const { items } = req.body

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items must be an array' })
    }
    if (!items.every((item) => Number.isInteger(Number(item.id)) && Number(item.id) > 0 && Number.isInteger(Number(item.sortOrder)))) {
      return res.status(400).json({ error: 'Each item must have a valid id and sortOrder' })
    }

    const updated = await Promise.all(
      items.map((item) =>
        prisma.volunteerRole.update({
          where: { id: Number(item.id) },
          data: { sortOrder: Number(item.sortOrder) },
        })
      )
    )

    invalidateCache()

    res.json({ success: true, updated })
  } catch {
    res.status(500).json({ error: 'Failed to reorder volunteer roles' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { titleEn, titleBn, descriptionEn, descriptionBn, sortOrder } = req.body

    const item = await prisma.volunteerRole.update({
      where: { id: Number(id) },
      data: {
        ...(titleEn !== undefined && { titleEn }),
        ...(titleBn !== undefined && { titleBn }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(descriptionBn !== undefined && { descriptionBn }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    })

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true, data: item })
  } catch {
    res.status(500).json({ error: 'Failed to update volunteer role' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const existing = await prisma.volunteerRole.findUnique({ where: { id: Number(id) } })
    if (!existing) return res.status(404).json({ error: 'Volunteer role not found' })

    await prisma.volunteerRole.delete({ where: { id: Number(id) } })

    invalidateCache()

    res.json({ success: true, message: 'Volunteer role deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete volunteer role' })
  }
})

export default router