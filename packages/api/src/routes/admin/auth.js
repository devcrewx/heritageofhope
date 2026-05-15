import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma.js'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
})

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: String(email).toLowerCase().trim() },
  })

  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash)
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const expiresIn = process.env.JWT_EXPIRY || '7d'
  const token = jwt.sign(
    {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn }
  )

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  })

  return res.json({
    token,
    expiresIn,
    user: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
  })
})

export default router
