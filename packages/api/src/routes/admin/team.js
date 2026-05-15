import express from 'express';
import multer from 'multer';
import { uploadToCloudinary, deleteFromCloudinary } from '../../lib/cloudinary.js';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// PATCH reorder team members (must come BEFORE /:id routes)
router.patch('/reorder', async (req, res) => {
  try {
    const { members: memberUpdates } = req.body;

    if (!Array.isArray(memberUpdates)) {
      return res.status(400).json({ error: 'Invalid reorder data' });
    }

    const updated = await Promise.all(
      memberUpdates.map(m =>
        prisma.teamMember.update({
          where: { id: m.id },
          data: { sortOrder: m.sortOrder }
        })
      )
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error reordering team members:', error);
    res.status(500).json({ error: 'Failed to reorder team members' });
  }
});

// GET all team members
router.get('/', async (req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// POST create team member with photo
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, roleEn, roleBn } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Member name is required' });
    }

    let photoUrl = null;
    let photoPublicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        `heritage-of-hope/team/${Date.now()}`,
        { resource_type: 'auto' }
      );
      photoUrl = result.secure_url;
      photoPublicId = result.public_id;
    }

    // Get max sortOrder
    const maxSort = await prisma.teamMember.aggregate({
      _max: { sortOrder: true }
    });
    const sortOrder = (maxSort._max.sortOrder || 0) + 1;

    const member = await prisma.teamMember.create({
      data: {
        name,
        roleEn,
        roleBn,
        photoUrl,
        photoPublicId,
        sortOrder
      }
    });

    res.status(201).json({ success: true, data: member });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// PATCH update team member
router.patch('/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roleEn, roleBn } = req.body;

    // Get existing member
    const existing = await prisma.teamMember.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    let photoUrl = existing.photoUrl;
    let photoPublicId = existing.photoPublicId;

    // If new file provided, upload it and delete old one
    if (req.file) {
      if (existing.photoPublicId) {
        await deleteFromCloudinary(existing.photoPublicId);
      }

      const result = await uploadToCloudinary(
        req.file.buffer,
        `heritage-of-hope/team/${Date.now()}`,
        { resource_type: 'auto' }
      );
      photoUrl = result.secure_url;
      photoPublicId = result.public_id;
    }

    const member = await prisma.teamMember.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existing.name,
        roleEn: roleEn || existing.roleEn,
        roleBn: roleBn || existing.roleBn,
        photoUrl,
        photoPublicId
      }
    });

    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// DELETE team member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const member = await prisma.teamMember.findUnique({
      where: { id: parseInt(id) }
    });

    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Delete from Cloudinary
    if (member.photoPublicId) {
      await deleteFromCloudinary(member.photoPublicId);
    }

    await prisma.teamMember.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

export default router;
