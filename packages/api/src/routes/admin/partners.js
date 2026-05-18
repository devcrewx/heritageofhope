import express from 'express';
import multer from 'multer';
import { uploadToCloudinary, deleteFromCloudinary } from '../../lib/cloudinary.js';
import { prisma } from '../../lib/prisma.js';
import { invalidateCache } from '../../lib/contentCache.js';
import { verifyJWT } from '../../middleware/verifyJWT.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public GET: list partners
router.get('/', async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } })
    res.json(partners)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partners' })
  }
})

// Protect admin mutations
router.use(verifyJWT)

// PATCH reorder partners
router.patch('/reorder', async (req, res) => {
  try {
    const { partners: partnerUpdates } = req.body;

    if (!Array.isArray(partnerUpdates)) {
      return res.status(400).json({ error: 'Invalid reorder data' });
    }

    const updated = await Promise.all(
      partnerUpdates.map(p =>
        prisma.partner.update({
          where: { id: p.id },
          data: { sortOrder: p.sortOrder }
        })
      )
    );

    // Invalidate cache so changes appear immediately
    invalidateCache();

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error reordering partners:', error);
    res.status(500).json({ error: 'Failed to reorder partners' });
  }
});

// GET all partners
router.get('/', async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// POST create partner with logo
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Partner name is required' });
    }

    let logoUrl = null;
    let logoPublicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        `heritage-of-hope/partners/${Date.now()}`,
        { resource_type: 'auto' }
      );
      logoUrl = result.secure_url;
      logoPublicId = result.public_id;
    }

    // Get max sortOrder
    const maxSort = await prisma.partner.aggregate({
      _max: { sortOrder: true }
    });
    const sortOrder = (maxSort._max.sortOrder || 0) + 1;

    const partner = await prisma.partner.create({
      data: {
        name,
        logoUrl,
        logoPublicId,
        isActive: isActive === 'true' || isActive === true,
        sortOrder
      }
    });

    // Invalidate cache so changes appear immediately
    invalidateCache();

    res.status(201).json({ success: true, data: partner });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ error: 'Failed to create partner' });
  }
});

// PATCH update partner
router.patch('/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    // Get existing partner
    const existing = await prisma.partner.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    let logoUrl = existing.logoUrl;
    let logoPublicId = existing.logoPublicId;

    // If new file provided, upload it and delete old one
    if (req.file) {
      if (existing.logoPublicId) {
        await deleteFromCloudinary(existing.logoPublicId);
      }

      const result = await uploadToCloudinary(
        req.file.buffer,
        `heritage-of-hope/partners/${Date.now()}`,
        { resource_type: 'auto' }
      );
      logoUrl = result.secure_url;
      logoPublicId = result.public_id;
    }

    const partner = await prisma.partner.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existing.name,
        isActive: isActive !== undefined ? isActive === 'true' || isActive === true : existing.isActive,
        logoUrl,
        logoPublicId
      }
    });

    // Invalidate cache so changes appear immediately
    invalidateCache();

    res.json({ success: true, data: partner });
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ error: 'Failed to update partner' });
  }
});

// DELETE partner
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await prisma.partner.findUnique({
      where: { id: parseInt(id) }
    });

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Delete from Cloudinary
    if (partner.logoPublicId) {
      await deleteFromCloudinary(partner.logoPublicId);
    }

    await prisma.partner.delete({
      where: { id: parseInt(id) }
    });

    // Invalidate cache so changes appear immediately
    invalidateCache();

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ error: 'Failed to delete partner' });
  }
});

export default router;
