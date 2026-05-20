import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// If DATABASE_URL isn't set (some runtimes inject env differently), try loading
// it directly from the local .env so Prisma can initialise reliably.
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      const parsed = dotenv.parse(fs.readFileSync(envPath))
      if (parsed.DATABASE_URL) process.env.DATABASE_URL = parsed.DATABASE_URL
    }
  } catch (e) {
    console.warn('Failed to parse .env file:', e.message)
  }
}

const globalForPrisma = globalThis

function buildDbUrl(base) {
  if (!base) return undefined
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}connection_limit=5&pool_timeout=10`
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: process.env.DATABASE_URL ? { db: { url: buildDbUrl(process.env.DATABASE_URL) } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
