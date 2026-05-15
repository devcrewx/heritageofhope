import express from 'express';
import multer from 'multer';
import { uploadToCloudinary, deleteFromCloudinary } from '../../lib/cloudinary.js';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// PATCH reorder activity posts (must come BEFORE /:id routes)
router.patch('/reorder', async (req, res) => {
  try {
    const { posts: postUpdates } = req.body;

    if (!Array.isArray(postUpdates)) {
      return res.status(400).json({ error: 'Invalid reorder data' });
    }

    const updated = await Promise.all(
      postUpdates.map(p =>
        prisma.activityPost.update({
          where: { id: p.id },
          data: { sortOrder: p.sortOrder }
        })
      )
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error reordering posts:', error);
    res.status(500).json({ error: 'Failed to reorder posts' });
  }
});

// GET all activity posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.activityPost.findMany({
      orderBy: { sortOrder: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity posts' });
  }
});

// POST create activity post with photo
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { date, titleEn, titleBn, bodyEn, bodyBn, isPublished } = req.body;

    if (!date || !titleEn) {
      return res.status(400).json({ error: 'Date and English title are required' });
    }

    let photoUrl = null;
    let photoPublicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        `heritage-of-hope/activity-posts/${Date.now()}`,
        { resource_type: 'auto' }
      );
      photoUrl = result.secure_url;
      photoPublicId = result.public_id;
    }

    // Get max sortOrder
    const maxSort = await prisma.activityPost.aggregate({
      _max: { sortOrder: true }
    });
    const sortOrder = (maxSort._max.sortOrder || 0) + 1;

    const post = await prisma.activityPost.create({
      data: {
        date: new Date(date),
        titleEn,
        titleBn,
        bodyEn,
        bodyBn,
        photoUrl,
        photoPublicId,
        isPublished: isPublished === 'true' || isPublished === true || isPublished === undefined,
        sortOrder
      }
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('Error creating activity post:', error);
    res.status(500).json({ error: 'Failed to create activity post' });
  }
});

// PATCH update activity post
router.patch('/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { date, titleEn, titleBn, bodyEn, bodyBn, isPublished } = req.body;

    // Get existing post
    const existing = await prisma.activityPost.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Activity post not found' });
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
        `heritage-of-hope/activity-posts/${Date.now()}`,
        { resource_type: 'auto' }
      );
      photoUrl = result.secure_url;
      photoPublicId = result.public_id;
    }

    const post = await prisma.activityPost.update({
      where: { id: parseInt(id) },
      data: {
        date: date ? new Date(date) : existing.date,
        titleEn: titleEn || existing.titleEn,
        titleBn: titleBn || existing.titleBn,
        bodyEn: bodyEn || existing.bodyEn,
        bodyBn: bodyBn || existing.bodyBn,
        photoUrl,
        photoPublicId,
        isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : existing.isPublished
      }
    });

    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Error updating activity post:', error);
    res.status(500).json({ error: 'Failed to update activity post' });
  }
});

// DELETE activity post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.activityPost.findUnique({
      where: { id: parseInt(id) }
    });

    if (!post) {
      return res.status(404).json({ error: 'Activity post not found' });
    }

    // Delete from Cloudinary
    if (post.photoPublicId) {
      await deleteFromCloudinary(post.photoPublicId);
    }

    await prisma.activityPost.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity post:', error);
    res.status(500).json({ error: 'Failed to delete activity post' });
  }
});

export default router;
