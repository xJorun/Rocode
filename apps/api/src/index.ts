import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { initSentry, Sentry, getSentryHandlers } from './lib/sentry'
import { logger } from './lib/logger'
import { authRouter } from './routes/auth'
import { usersRouter } from './routes/users'
import { problemsRouter } from './routes/problems'
import { submissionsRouter } from './routes/submissions'
import { leaderboardRouter } from './routes/leaderboard'
import { billingRouter } from './routes/billing'
import { studioRouter } from './routes/studio'
import { adminRouter } from './routes/admin'
import { playgroundRouter } from './routes/playground'
import { dailyRouter } from './routes/daily'
import { errorHandler } from './middleware/error'
import { authMiddleware, optionalAuthMiddleware } from './middleware/auth'

initSentry()

const app = express()
const port = process.env.PORT || 4000

const SentryHandlers = getSentryHandlers()
app.use(SentryHandlers.requestHandler())
app.use(SentryHandlers.tracingHandler())

import { requestIdMiddleware } from './middleware/requestId'
app.use(requestIdMiddleware)

app.use(helmet())
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })
  next()
})

app.use('/auth', authRouter)
app.use('/billing/webhook', express.raw({ type: 'application/json' }))
app.use('/users', usersRouter)
app.use('/problems', optionalAuthMiddleware, problemsRouter)
app.use('/submissions', authMiddleware, submissionsRouter)
app.use('/leaderboard', leaderboardRouter)
app.use('/billing', authMiddleware, billingRouter)
app.use('/studio', authMiddleware, studioRouter)
app.use('/admin', authMiddleware, adminRouter)
app.use('/playground', playgroundRouter)
app.use('/daily', dailyRouter)

import { healthCheck } from './middleware/health'
app.get('/health', healthCheck)

app.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

app.use(SentryHandlers.errorHandler())
app.use(errorHandler)

app.listen(port, () => {
  logger.info(`API server running on port ${port}`)
})

