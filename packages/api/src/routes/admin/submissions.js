import express from 'express'
import { prisma } from '../../lib/prisma.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'

const router = express.Router()
router.use(verifyJWT)

// GET /api/admin/forms/submissions - Get all submissions (paginated, filterable by type)
router.get('/submissions', async (req, res) => {
  try {
    const { type = 'all', page = 1, limit = 20 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    let submissions = []
    let total = 0

    if (type === 'all' || type === 'contact') {
      const contact = await prisma.contactSubmission.findMany({
        skip: type === 'all' ? 0 : skip,
        take: type === 'all' ? 1000 : parseInt(limit),
        orderBy: { createdAt: 'desc' },
      })
      const contactTotal = await prisma.contactSubmission.count()
      submissions = submissions.concat(contact.map(s => ({ ...s, type: 'contact' })))
      if (type === 'contact') {
        total = contactTotal
      }
    }

    if (type === 'all' || type === 'volunteer') {
      const volunteer = await prisma.volunteerSubmission.findMany({
        skip: type === 'all' ? 0 : skip,
        take: type === 'all' ? 1000 : parseInt(limit),
        orderBy: { createdAt: 'desc' },
      })
      const volunteerTotal = await prisma.volunteerSubmission.count()
      submissions = submissions.concat(volunteer.map(s => ({ ...s, type: 'volunteer' })))
      if (type === 'volunteer') {
        total = volunteerTotal
      }
    }

    if (type === 'all' || type === 'partner') {
      const partner = await prisma.partnerSubmission.findMany({
        skip: type === 'all' ? 0 : skip,
        take: type === 'all' ? 1000 : parseInt(limit),
        orderBy: { createdAt: 'desc' },
      })
      const partnerTotal = await prisma.partnerSubmission.count()
      submissions = submissions.concat(partner.map(s => ({ ...s, type: 'partner' })))
      if (type === 'partner') {
        total = partnerTotal
      }
    }

    // Sort all submissions by date descending if viewing all
    if (type === 'all') {
      submissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      total = submissions.length
      submissions = submissions.slice(skip, skip + parseInt(limit))
    }

    res.json({
      data: submissions,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    res.status(500).json({ error: 'Failed to fetch submissions' })
  }
})

// GET /api/admin/forms/submissions/contact/:id - Get single contact submission
router.get('/submissions/contact/:id', async (req, res) => {
  try {
    const submission = await prisma.contactSubmission.findUnique({
      where: { id: parseInt(req.params.id) },
    })
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }
    res.json({ ...submission, type: 'contact' })
  } catch (error) {
    console.error('Error fetching submission:', error)
    res.status(500).json({ error: 'Failed to fetch submission' })
  }
})

// GET /api/admin/forms/submissions/volunteer/:id - Get single volunteer submission
router.get('/submissions/volunteer/:id', async (req, res) => {
  try {
    const submission = await prisma.volunteerSubmission.findUnique({
      where: { id: parseInt(req.params.id) },
    })
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }
    res.json({ ...submission, type: 'volunteer' })
  } catch (error) {
    console.error('Error fetching submission:', error)
    res.status(500).json({ error: 'Failed to fetch submission' })
  }
})

// GET /api/admin/forms/submissions/partner/:id - Get single partner submission
router.get('/submissions/partner/:id', async (req, res) => {
  try {
    const submission = await prisma.partnerSubmission.findUnique({
      where: { id: parseInt(req.params.id) },
    })
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }
    res.json({ ...submission, type: 'partner' })
  } catch (error) {
    console.error('Error fetching submission:', error)
    res.status(500).json({ error: 'Failed to fetch submission' })
  }
})

// GET /api/admin/forms/stats - Get submission counts by type
router.get('/stats', async (req, res) => {
  try {
    const contactCount = await prisma.contactSubmission.count()
    const volunteerCount = await prisma.volunteerSubmission.count()
    const partnerCount = await prisma.partnerSubmission.count()

    res.json({
      contact: contactCount,
      volunteer: volunteerCount,
      partner: partnerCount,
      total: contactCount + volunteerCount + partnerCount,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router
