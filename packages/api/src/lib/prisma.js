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
    // swallow – Prisma will still surface a clear error if DB URL absent
  }
}

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: process.env.DATABASE_URL ? { db: { url: process.env.DATABASE_URL } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
