import 'dotenv/config'
import * as Sentry from '@sentry/node'

const SENTRY_DSN = process.env.SENTRY_DSN
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.SENTRY_ENV || process.env.NODE_ENV || 'development',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    enableLogs: true,
    sendDefaultPii: true,
    profileSessionSampleRate: parseFloat(process.env.SENTRY_PROFILE_SAMPLE_RATE || '0'),
    integrations: [
      Sentry.expressIntegration(),
    ],
  })
}
