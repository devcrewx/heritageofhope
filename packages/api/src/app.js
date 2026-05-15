import express from 'express'
import helmet from 'helmet'
import cors from 'cors'

import publicRoutes from './routes/public/index.js'
import adminRoutes from './routes/admin/index.js'

export function createApp() {
  const app = express()
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

  app.use('/api', publicRoutes)
  app.use('/api/admin', adminRoutes)

  return app
}
