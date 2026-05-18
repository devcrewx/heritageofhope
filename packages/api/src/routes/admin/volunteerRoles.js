import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { invalidateCache } from '../../lib/contentCache.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'

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

router.post('/', async (req, res) => {
  try {
    const { titleEn, titleBn, descriptionEn, descriptionBn, sortOrder } = req.body

    if (!titleEn) {
      return res.status(400).json({ error: 'titleEn is required' })
    }

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

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true, data: item })
  } catch {
    res.status(500).json({ error: 'Failed to create volunteer role' })
  }
})

router.patch('/reorder', async (req, res) => {
  try {
    const { items } = req.body

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items must be an array' })
    }

    const updated = await Promise.all(
      items.map((item) =>
        prisma.volunteerRole.update({
          where: { id: Number(item.id) },
          data: { sortOrder: Number(item.sortOrder) },
        })
      )
    )

    // Invalidate cache so changes appear immediately
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
    await prisma.volunteerRole.delete({ where: { id: Number(id) } })

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true, message: 'Volunteer role deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete volunteer role' })
  }
})

export default router