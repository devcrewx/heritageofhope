import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import pinoHttp from 'pino-http'
import { logger } from './lib/logger.js'
import publicRoutes from './routes/public/index.js'
import adminRoutes from './routes/admin/index.js'

const SENTRY_DSN = process.env.SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    integrations: [],
  })
  logger.info('Sentry initialized')
}

export function createApp() {
  const app = express()
  app.set('trust proxy', 1)
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (SENTRY_DSN) {
    app.use(Sentry.Handlers.requestHandler())
    app.use(Sentry.Handlers.tracingHandler())
  }

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
    app.use(Sentry.Handlers.errorHandler())
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
