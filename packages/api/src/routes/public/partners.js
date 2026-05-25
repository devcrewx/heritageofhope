import express from 'express';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();

// GET all active partners
router.get('/', async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json(partners);
  } catch {
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

export default router;
