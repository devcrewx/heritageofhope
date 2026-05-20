import { Router } from 'express'
import { body } from 'express-validator'
import { prisma } from '../../lib/prisma.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'
import { invalidateCache } from '../../lib/contentCache.js'
import { handleValidationErrors } from '../../middleware/validation.js'

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
router.post(
  '/',
  [
    body('value').trim().notEmpty().isLength({ max: 50 }).withMessage('value is required and must be ≤50 characters'),
    body('labelEn').trim().notEmpty().isLength({ min: 2, max: 200 }).withMessage('labelEn is required and must be 2-200 characters'),
    body('labelBn').if(body('labelBn').notEmpty()).trim().isLength({ max: 200 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { value, labelEn, labelBn } = req.body

      const stat = await prisma.impactStat.create({
        data: {
          value,
          labelEn,
          labelBn,
          sortOrder: 0,
        },
      })

      invalidateCache()

      res.json({
        success: true,
        data: stat,
      })
    } catch (error) {
      console.error('Error creating stat:', error)
      res.status(500).json({ error: 'Failed to create stat' })
    }
  }
)

/**
 * PATCH /api/admin/stats/:id
 * Update an impact stat
 */
router.patch(
  '/:id',
  [
    body('value').if(body('value').notEmpty()).trim().isLength({ max: 50 }),
    body('labelEn').if(body('labelEn').notEmpty()).trim().isLength({ min: 2, max: 200 }),
    body('labelBn').if(body('labelBn').notEmpty()).trim().isLength({ max: 200 }),
  ],
  handleValidationErrors,
  async (req, res) => {
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
        },
      })

      invalidateCache()

      res.json({
        success: true,
        data: stat,
      })
    } catch (error) {
      console.error('Error updating stat:', error)
      res.status(500).json({ error: 'Failed to update stat' })
    }
  }
)

/**
 * DELETE /api/admin/stats/:id
 * Delete an impact stat
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.impactStat.delete({
      where: { id: parseInt(id) },
    })

    // Invalidate cache so changes appear immediately
    invalidateCache()

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
