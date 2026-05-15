import express from 'express';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();

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

export default router;
