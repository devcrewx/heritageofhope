import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { invalidateCache } from '../../lib/contentCache.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'

const router = Router()

router.use(verifyJWT)

router.get('/', async (_req, res) => {
  try {
    const items = await prisma.donationTier.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    res.json({ success: true, items })
  } catch {
    res.status(500).json({ error: 'Failed to fetch donation tiers' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { amount, labelEn, labelBn, sortOrder } = req.body

    if (amount === undefined || amount === '' || !labelEn) {
      return res.status(400).json({ error: 'amount and labelEn are required' })
    }

    const maxResult = await prisma.donationTier.aggregate({ _max: { sortOrder: true } })
    const nextSortOrder = sortOrder !== undefined ? Number(sortOrder) : (maxResult._max.sortOrder ?? -1) + 1

    const item = await prisma.donationTier.create({
      data: {
        amount: Number(amount),
        labelEn,
        labelBn,
        sortOrder: Number.isNaN(nextSortOrder) ? 0 : nextSortOrder,
      },
    })

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true, data: item })
  } catch {
    res.status(500).json({ error: 'Failed to create donation tier' })
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
        prisma.donationTier.update({
          where: { id: Number(item.id) },
          data: { sortOrder: Number(item.sortOrder) },
        })
      )
    )

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true, updated })
  } catch {
    res.status(500).json({ error: 'Failed to reorder donation tiers' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { amount, labelEn, labelBn, sortOrder } = req.body

    const item = await prisma.donationTier.update({
      where: { id: Number(id) },
      data: {
        ...(amount !== undefined && amount !== '' && { amount: Number(amount) }),
        ...(labelEn !== undefined && { labelEn }),
        ...(labelBn !== undefined && { labelBn }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    })

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true, data: item })
  } catch {
    res.status(500).json({ error: 'Failed to update donation tier' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.donationTier.delete({ where: { id: Number(id) } })

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({ success: true, message: 'Donation tier deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete donation tier' })
  }
})

export default router