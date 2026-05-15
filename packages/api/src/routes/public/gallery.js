import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'

const router = Router()

// GET /api/gallery
router.get('/', async (_req, res) => {
  try {
    const items = await prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' } })
    res.json(items)
  } catch (err) {
    console.error('Failed fetching public gallery:', err)
    res.status(500).json({ error: 'Failed to fetch gallery' })
  }
})

export default router
