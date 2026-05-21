import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import pinoHttp from 'pino-http'
import { logger } from './lib/logger.js'
import publicRoutes from './routes/public/index.js'
import adminRoutes from './routes/admin/index.js'

const SENTRY_DSN = process.env.SENTRY_DSN

export function createApp() {
  const app = express()
  app.set('trust proxy', 1)
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  app.use(helmet())
  app.use(
    cors({
      origin: allowedOrigins.length ? allowedOrigins : true,
      credentials: true,
    })
  )
  app.use(express.json())
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => req.url === '/api/health',
      },
    })
  )

  app.use('/api', publicRoutes)
  app.use('/api/admin', adminRoutes)

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  if (SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app)
  }

  app.use((err, _req, res, _next) => {
    logger.error({ err }, 'Unhandled error')
    const status = err.status || err.statusCode || 500
    res.status(status).json({
      error: status === 500 ? 'Internal server error' : err.message,
    })
  })

  return app
}
