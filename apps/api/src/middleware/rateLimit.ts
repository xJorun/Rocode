import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// Type helper for Redis reply
type RedisReply = string | number | Buffer | null | undefined

// Helper function to properly type the sendCommand
const createSendCommand = () => {
  return async (...args: string[]): Promise<RedisReply> => {
    const result = await redis.call(args[0], ...args.slice(1))
    return result as RedisReply
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

