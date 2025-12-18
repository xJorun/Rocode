import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import { expressIntegration } from '@sentry/node'

let sentryInitialized = false

export function initSentry() {
  if (!process.env.SENTRY_DSN) {
    return
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      expressIntegration(),
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  })
  sentryInitialized = true
}

export function getSentryHandlers() {
  // For Sentry v8+ with expressIntegration, request/tracing are handled automatically
  // We provide no-op middleware for request/tracing and a proper error handler
  const errorHandlerMiddleware = (err: any, req: any, res: any, next: any) => {
    if (sentryInitialized) {
      Sentry.captureException(err)
    }
    next(err)
  }

  return {
    requestHandler: () => (req: any, res: any, next: any) => next(), // No-op, handled by expressIntegration
    tracingHandler: () => (req: any, res: any, next: any) => next(), // No-op, handled by expressIntegration
    errorHandler: () => errorHandlerMiddleware,
  }
}

export { Sentry }

