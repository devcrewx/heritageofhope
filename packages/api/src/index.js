import 'dotenv/config'
import { createApp } from './app.js'
import { prisma } from './lib/prisma.js'
import { logger } from './lib/logger.js'

const app = createApp()
const port = process.env.PORT || 3001
const server = app.listen(port, '0.0.0.0', () => {
  logger.info({ port }, 'API listening')
})

function shutdown(signal) {
  logger.warn({ signal }, 'Shutdown signal received')
  server.close(async () => {
    await prisma.$disconnect()
    logger.info('Prisma disconnected. Goodbye.')
    process.exit(0)
  })
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.')
    process.exit(1)
  }, 10_000)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled Rejection')
})

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught Exception')
})
