import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import contentRouter from './content.js'
import galleryRouter from './gallery.js'
import documentsRouter from './documents.js'
import partnersRouter from './partners.js'
import teamRouter from './team.js'
import postsRouter from './posts.js'
import formsRouter from './forms.js'

const router = Router()

router.use('/content', contentRouter)
router.use('/gallery', galleryRouter)
router.use('/documents', documentsRouter)
router.use('/partners', partnersRouter)
router.use('/team', teamRouter)
router.use('/activity-posts', postsRouter)
router.use('/forms', formsRouter)

router.get('/stats', async (req, res) => {
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

router.get('/fund-allocation', async (_req, res) => {
  try {
    const items = await prisma.fundAllocation.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    res.json(items)
  } catch (error) {
    console.error('Error fetching fund allocation:', error)
    res.status(500).json({ error: 'Failed to fetch fund allocation' })
  }
})

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'heritageofhope-api' })
})

export default router
