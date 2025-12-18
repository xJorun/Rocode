import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Sentry } from '../lib/sentry'
import { logger } from '../lib/logger'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = req.headers['x-request-id'] as string || 'unknown'

  if (err instanceof ZodError) {
    logger.warn('Validation error', {
      requestId,
      path: req.path,
      errors: err.errors,
    })
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors,
      requestId,
    })
  }

  if (err instanceof AppError) {
    logger.warn('Application error', {
      requestId,
      path: req.path,
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
    })
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      requestId,
    })
  }

  logger.error('Unhandled error', {
    requestId,
    path: req.path,
    error: err.message,
    stack: err.stack,
  })

  Sentry.captureException(err, {
    tags: { requestId, path: req.path },
    extra: { body: req.body, query: req.query },
  })

  return res.status(500).json({
    error: 'Internal server error',
    requestId,
  })
}

