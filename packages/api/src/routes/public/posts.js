import express from 'express';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();

// GET all published activity posts sorted by sortOrder descending (newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.activityPost.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity posts' });
  }
});

export default router;
