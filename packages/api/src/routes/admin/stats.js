import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'
import { invalidateCache } from '../../lib/contentCache.js'

const router = Router()

// Public route - fetch all stats
router.get('/', async (req, res) => {
  try {
    const stats = await prisma.impactStat.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    res.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Admin routes
router.use(verifyJWT)

/**
 * POST /api/admin/stats
 * Create a new impact stat
 */
router.post('/', async (req, res) => {
  try {
    const { value, labelEn, labelBn } = req.body

    if (!value || !labelEn) {
      return res.status(400).json({ error: 'Value and labelEn are required' })
    }

    const stat = await prisma.impactStat.create({
      data: {
        value,
        labelEn,
        labelBn,
        sortOrder: 0,
      },
    })

    // Invalidate cache so changes appear immediately
    invalidateCache()

    res.json({
      success: true,
      data: stat,
    })
  } catch (error) {
    console.error('Error creating stat:', error)
    res.status(500).json({ error: 'Failed to create stat' })
  }
})

/**
 * PATCH /api/admin/stats/:id
 * Update an impact stat
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { value, labelEn, labelBn, sortOrder } = req.body

    const stat = await prisma.impactStat.update({
      where: { id: parseInt(id) },
      data: {
        ...(value !== undefined && { value }),
        ...(labelEn !== undefined && { labelEn }),
        ...(labelBn !== undefined && { labelBn }),
        ...(sortOrder !== undefined && { sortOrder }),
    // Invalidate cache so changes appear immediately
    invalidateCache()

      },
    })

    res.json({
      success: true,
      data: stat,
    })
  } catch (error) {
    console.error('Error updating stat:', error)
    res.status(500).json({ error: 'Failed to update stat' })
  }
})

/**
 * DELETE /api/admin/stats/:id
 * Delete an impact stat
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.impactStat.delete({
    // Invalidate cache so changes appear immediately
    invalidateCache()

      where: { id: parseInt(id) },
    })

    res.json({
      success: true,
      message: 'Stat deleted',
    })
  } catch (error) {
    console.error('Error deleting stat:', error)
    res.status(500).json({ error: 'Failed to delete stat' })
  }
})

export default router
