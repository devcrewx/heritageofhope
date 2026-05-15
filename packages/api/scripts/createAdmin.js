import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma.js'

dotenv.config()

function getArg(name) {
  const match = process.argv.find((arg) => arg.startsWith(`--${name}=`))
  return match ? match.split('=').slice(1).join('=') : null
}

async function main() {
  const email = getArg('email')
  const password = getArg('password')
  const role = getArg('role') || 'superadmin'

  if (!email || !password) {
    throw new Error('Usage: npm run create-admin -- --email=admin@example.com --password=strong-password [--role=superadmin]')
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existing = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } })

  if (existing) {
    throw new Error(`Admin user already exists: ${normalizedEmail}`)
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const admin = await prisma.adminUser.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      role,
    },
    select: { id: true, email: true, role: true },
  })

  console.log('Created admin user:', admin)
}

main()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
