import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

let sentryInitialized = false

export function initSentry() {
  if (!process.env.SENTRY_DSN) {
    return
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  })
  sentryInitialized = true
}

export function getSentryHandlers() {
  if (!sentryInitialized) {
    return {
      requestHandler: () => (req: any, res: any, next: any) => next(),
      tracingHandler: () => (req: any, res: any, next: any) => next(),
      errorHandler: () => (err: any, req: any, res: any, next: any) => next(err),
    }
  }
  return Sentry.Handlers
}

export { Sentry }

