import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'

const router = Router()

router.use(verifyJWT)

router.get('/', async (_req, res) => {
  try {
    const items = await prisma.fundAllocation.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    res.json({ success: true, items })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fund allocation' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { categoryEn, categoryBn, percentage, sortOrder = 0 } = req.body

    if (!categoryEn || percentage === undefined) {
      return res.status(400).json({ error: 'categoryEn and percentage are required' })
    }

    const item = await prisma.fundAllocation.create({
      data: {
        categoryEn,
        categoryBn,
        percentage: Number(percentage),
        sortOrder: Number(sortOrder),
      },
    })

    res.json({ success: true, data: item })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create fund allocation' })
  }
})

router.patch('/batch', async (req, res) => {
  try {
    const { items } = req.body

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items must be an array' })
    }

    const updated = await Promise.all(
      items.map((item) =>
        prisma.fundAllocation.update({
          where: { id: Number(item.id) },
          data: {
            categoryEn: item.categoryEn,
            categoryBn: item.categoryBn,
            percentage: Number(item.percentage),
            sortOrder: Number(item.sortOrder),
          },
        })
      )
    )

    res.json({ success: true, updated })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fund allocation batch' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { categoryEn, categoryBn, percentage, sortOrder } = req.body

    const item = await prisma.fundAllocation.update({
      where: { id: Number(id) },
      data: {
        ...(categoryEn !== undefined && { categoryEn }),
        ...(categoryBn !== undefined && { categoryBn }),
        ...(percentage !== undefined && { percentage: Number(percentage) }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    })

    res.json({ success: true, data: item })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fund allocation' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.fundAllocation.delete({
      where: { id: Number(id) },
    })

    res.json({ success: true, message: 'Fund allocation deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete fund allocation' })
  }
})

export default router