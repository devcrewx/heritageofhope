import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
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

const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
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

router.post('/forgot-password', forgotLimiter, async (req, res) => {
  const { email } = req.body ?? {}

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const normalizedEmail = String(email).toLowerCase().trim()
  const admin = await prisma.adminUser.findUnique({
    where: { email: normalizedEmail },
  })

  if (!admin) {
    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      resetToken: token,
      resetTokenExpires: expiresAt,
    },
  })

  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`
  try {
    const { sendEmail } = await import('../../lib/mailer.js')
    await sendEmail({
      to: admin.email,
      subject: 'Password Reset — Heritage of Hope Admin',
      html: `<p>You requested a password reset.</p>
<p>Click the link below to reset your password. This link expires in <strong>1 hour</strong>.</p>
<p><a href="${resetUrl}">${resetUrl}</a></p>
<p>If you did not request this, please ignore this email.</p>`,
    })
    console.log('Password reset email sent to', admin.email)
  } catch (err) {
    console.error('Failed to send password reset email:', err)
  }

  return res.json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
  })
})

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body ?? {}

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' })
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' })
  }

  const admin = await prisma.adminUser.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: { gt: new Date() },
    },
  })

  if (!admin) {
    return res.status(400).json({ error: 'Invalid or expired reset token' })
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpires: null,
    },
  })

  return res.json({ success: true, message: 'Password reset successfully. You can now sign in with your new password.' })
})

export default router
