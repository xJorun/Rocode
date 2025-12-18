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
  if (!sentryInitialized) {
    return {
      requestHandler: () => (req: any, res: any, next: any) => next(),
      tracingHandler: () => (req: any, res: any, next: any) => next(),
      errorHandler: () => (err: any, req: any, res: any, next: any) => next(err),
    }
  }
  
  // For Sentry v8+, use setupExpressErrorHandler and setupExpressRequestDataHandler
  // But since we're using expressIntegration, we just need the error handler
  return {
    requestHandler: Sentry.setupExpressRequestDataHandler,
    tracingHandler: () => (req: any, res: any, next: any) => next(),
    errorHandler: Sentry.setupExpressErrorHandler,
  }
}

export { Sentry }

