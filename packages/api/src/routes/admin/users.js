import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'
import bcrypt from 'bcrypt'

const router = Router()
router.use(verifyJWT)

/**
 * POST /api/admin/users/change-password
 * Body: { currentPassword, newPassword }
 */
router.post('/change-password', async (req, res) => {
  try {
    const adminId = req.user?.sub || req.user?.id
    if (!adminId) return res.status(401).json({ error: 'Unauthorized' })

    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' })
    if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' })

    const admin = await prisma.adminUser.findUnique({ where: { id: adminId } })
    if (!admin) return res.status(404).json({ error: 'User not found' })

    const ok = await bcrypt.compare(currentPassword, admin.passwordHash)
    if (!ok) return res.status(400).json({ error: 'Current password is incorrect' })

    const saltRounds = 12
    const hash = await bcrypt.hash(newPassword, saltRounds)

    await prisma.adminUser.update({ where: { id: adminId }, data: { passwordHash: hash } })

    res.json({ success: true, message: 'Password changed' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Failed to change password' })
  }
})

export default router
