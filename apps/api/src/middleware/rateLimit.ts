import rateLimit from 'express-rate-limit'
import RedisStore, { type SendCommandFn } from 'rate-limit-redis'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// Helper function to properly type the sendCommand
const createSendCommand = (): SendCommandFn => {
  return async (...args: string[]) => {
    const result = await redis.call(args[0], ...args.slice(1))
    // Convert result to match RedisReply type (boolean | number | string | array of those)
    // Handle null/undefined by returning a default value
    if (result === null || result === undefined) {
      return 0 // Return a number as default
    }
    // Convert Buffer to string
    if (Buffer.isBuffer(result)) {
      return result.toString()
    }
    // For arrays, convert each element
    if (Array.isArray(result)) {
      return result.map(item => {
        if (Buffer.isBuffer(item)) return item.toString()
        if (item === null || item === undefined) return 0
        // Ensure item is boolean, number, or string
        if (typeof item === 'boolean' || typeof item === 'number' || typeof item === 'string') {
          return item
        }
        return String(item)
      })
    }
    // Ensure result is boolean, number, or string
    if (typeof result === 'boolean' || typeof result === 'number' || typeof result === 'string') {
      return result
    }
    return String(result)
  }
}

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: createSendCommand(),
    prefix: 'rl:auth:',
  }),
  message: { error: 'Too many authentication attempts, please try again later' },
})

export const runLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: createSendCommand(),
    prefix: 'rl:run:',
  }),
  keyGenerator: (req) => req.user?.id || req.ip || 'anonymous',
  message: { error: 'Too many run requests, please slow down' },
})

export const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: createSendCommand(),
    prefix: 'rl:submit:',
  }),
  keyGenerator: (req) => req.user?.id || req.ip || 'anonymous',
  message: { error: 'Too many submission requests, please slow down' },
})

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: createSendCommand(),
    prefix: 'rl:general:',
  }),
})

