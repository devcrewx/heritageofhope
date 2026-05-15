import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const items = await prisma.document.findMany({ orderBy: { sortOrder: 'asc' } })
    res.json(items)
  } catch (err) {
    console.error('Failed fetching public documents:', err)
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
})

export default router
