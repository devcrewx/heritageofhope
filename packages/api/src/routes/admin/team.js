import express from 'express'
import multer from 'multer'
import { body } from 'express-validator'
import { uploadToCloudinary, deleteFromCloudinary } from '../../lib/cloudinary.js'
import { prisma } from '../../lib/prisma.js'
import { invalidateCache } from '../../lib/contentCache.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'
import {
  handleValidationErrors,
  validateTeamMember,
  validateId,
} from '../../middleware/validation.js'

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public GET: list team members
router.get('/', async (req, res) => {
  try {
    const members = await prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } })
    res.json(members)
  } catch {
    res.status(500).json({ error: 'Failed to fetch team members' })
  }
})

// Protect the following admin routes
router.use(verifyJWT)

// PATCH reorder team members
router.patch('/reorder', async (req, res) => {
  try {
    const { members: memberUpdates } = req.body;

    if (!Array.isArray(memberUpdates)) {
      return res.status(400).json({ error: 'Invalid reorder data' });
    }
    if (!memberUpdates.every((m) => Number.isInteger(Number(m.id)) && Number(m.id) > 0 && Number.isInteger(Number(m.sortOrder)))) {
      return res.status(400).json({ error: 'Each item must have a valid id and sortOrder' })
    }

    const updated = await Promise.all(
      memberUpdates.map(m =>
        prisma.teamMember.update({
          where: { id: Number(m.id) },
          data: { sortOrder: Number(m.sortOrder) }
        })
      )
    );

    // Invalidate cache so changes appear immediately
    invalidateCache();

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error reordering team members:', error);
    res.status(500).json({ error: 'Failed to reorder team members' });
  }
});


// POST create team member with photo
router.post(
  '/',
  [
    ...validateTeamMember(),
  ],
  handleValidationErrors,
  upload.single('file'),
  async (req, res) => {
    try {
      const { name, roleEn, roleBn } = req.body

      let photoUrl = null
      let photoPublicId = null

      if (req.file) {
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
          return res.status(500).json({ error: 'Cloudinary not configured on server' })
        }
        const result = await uploadToCloudinary(
          req.file.buffer,
          `heritage-of-hope/team/${Date.now()}`,
          { resource_type: 'auto' }
        )
        photoUrl = result.secure_url
        photoPublicId = result.public_id
      }

      // Get max sortOrder
      const maxSort = await prisma.teamMember.aggregate({
        _max: { sortOrder: true }
      })
      const sortOrder = (maxSort._max.sortOrder || 0) + 1

      const member = await prisma.teamMember.create({
        data: {
          name: name.trim(),
          roleEn: roleEn?.trim() || null,
          roleBn: roleBn?.trim() || null,
          photoUrl,
          photoPublicId,
          sortOrder
        }
      })

      // Invalidate cache so changes appear immediately
      invalidateCache()

      res.status(201).json({ success: true, data: member })
    } catch (error) {
      console.error('Error creating team member:', error)
      res.status(500).json({ error: 'Failed to create team member' })
    }
  }
)

// PATCH update team member
router.patch(
  '/:id',
  [
    validateId('id'),
    body('name')
      .if(body('name').notEmpty())
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('roleEn')
      .if(body('roleEn').notEmpty())
      .trim()
      .isLength({ max: 100 })
      .withMessage('Role (English) must be at most 100 characters'),
    body('roleBn')
      .if(body('roleBn').notEmpty())
      .trim()
      .isLength({ max: 100 })
      .withMessage('Role (Bengali) must be at most 100 characters'),
  ],
  handleValidationErrors,
  upload.single('file'),
  async (req, res) => {
    try {
      const { id } = req.params
      const { name, roleEn, roleBn } = req.body

      // Get existing member
      const existing = await prisma.teamMember.findUnique({
        where: { id: parseInt(id) }
      })

      if (!existing) {
        return res.status(404).json({ error: 'Team member not found' })
      }

      let photoUrl = existing.photoUrl
      let photoPublicId = existing.photoPublicId

      // If new file provided, upload it and delete old one
      if (req.file) {
        if (existing.photoPublicId) {
          await deleteFromCloudinary(existing.photoPublicId)
        }

        const result = await uploadToCloudinary(
          req.file.buffer,
          `heritage-of-hope/team/${Date.now()}`,
          { resource_type: 'auto' }
        )
        photoUrl = result.secure_url
        photoPublicId = result.public_id
      }

      const member = await prisma.teamMember.update({
        where: { id: parseInt(id) },
        data: {
          ...(name && { name: name.trim() }),
          ...(roleEn !== undefined && { roleEn: roleEn.trim() || null }),
          ...(roleBn !== undefined && { roleBn: roleBn.trim() || null }),
          photoUrl,
          photoPublicId
        }
      })

      // Invalidate cache so changes appear immediately
      invalidateCache()

      res.json({ success: true, data: member })
    } catch (error) {
      console.error('Error updating team member:', error)
      res.status(500).json({ error: 'Failed to update team member' })
    }
  }
)

// DELETE team member
router.delete(
  '/:id',
  [validateId('id')],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params

      const member = await prisma.teamMember.findUnique({
        where: { id: parseInt(id) }
      })

      if (!member) {
        return res.status(404).json({ error: 'Team member not found' })
      }

      // Delete from Cloudinary
      if (member.photoPublicId) {
        try {
          await deleteFromCloudinary(member.photoPublicId)
        } catch (err) {
          console.warn('Failed to delete photo from Cloudinary:', err)
        }
      }

      await prisma.teamMember.delete({
        where: { id: parseInt(id) }
      })

      // Invalidate cache so changes appear immediately
      invalidateCache()

      res.json({ success: true, message: 'Team member deleted' })
    } catch (error) {
      console.error('Error deleting team member:', error)
      res.status(500).json({ error: 'Failed to delete team member' })
    }
  }
)

export default router;
