import { Router } from 'express'
import authRouter from './auth.js'
import contentRouter from './content.js'
import homeRouter from './home.js'
import statsRouter from './stats.js'
import galleryRouter from './gallery.js'
import documentsRouter from './documents.js'
import partnersRouter from './partners.js'
import teamRouter from './team.js'
import fundAllocationRouter from './fundAllocation.js'
import donationTiersRouter from './donationTiers.js'
import volunteerRolesRouter from './volunteerRoles.js'
import postsRouter from './posts.js'
import programsRouter from './programs.js'
import usersRouter from './users.js'
import submissionsRouter from './submissions.js'
import mediaRouter from './media.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'
import { adminRateLimiter } from '../../middleware/rateLimiter.js'

const router = Router()

router.use(authRouter)
router.use(adminRateLimiter)
router.use('/content/home', homeRouter)
router.use('/stats', statsRouter)
router.use('/content', contentRouter)
router.use('/gallery', galleryRouter)
router.use('/documents', documentsRouter)
router.use('/partners', partnersRouter)
router.use('/team', teamRouter)
router.use('/fund-allocation', fundAllocationRouter)
router.use('/donation-tiers', donationTiersRouter)
router.use('/volunteer-roles', volunteerRolesRouter)
router.use('/activity-posts', postsRouter)
router.use('/programs', programsRouter)
router.use('/users', usersRouter)
router.use('/forms', submissionsRouter)
router.use('/media', mediaRouter)

router.get('/me', verifyJWT, (req, res) => {
  res.json({ user: req.user })
})

router.get('/health', verifyJWT, (_req, res) => {
  res.json({ ok: true, area: 'admin' })
})

export default router
