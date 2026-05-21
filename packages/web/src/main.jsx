import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.jsx'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENV || 'production',
    tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    integrations: [Sentry.browserTracingIntegration()],
  })
}

createRoot(document.getElementById('root')).render(
  SENTRY_DSN ? <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}><App /></Sentry.ErrorBoundary> : <App />,
)
