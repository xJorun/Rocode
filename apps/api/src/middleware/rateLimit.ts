import rateLimit from 'express-rate-limit'
import RedisStore, { type SendCommandFn } from 'rate-limit-redis'
import Redis from 'ioredis'

// Initialize Redis with error handling - make it optional
let redis: Redis | null = null
let useRedis = false

if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      retryStrategy: () => null, // Disable retries
      maxRetriesPerRequest: 1,
      lazyConnect: true, // Don't connect immediately
      enableOfflineQueue: false, // Don't queue commands when offline
    })

    redis.on('error', (err) => {
      console.error('Redis error:', err.message)
      useRedis = false
    })

    redis.on('connect', () => {
      useRedis = true
    })

    redis.on('ready', () => {
      useRedis = true
    })

    // Attempt connection asynchronously, don't block
    redis.connect().catch(() => {
      useRedis = false
    })
  } catch (error) {
    console.error('Failed to initialize Redis:', error)
    useRedis = false
  }
}

// Helper function to properly type the sendCommand
const createSendCommand = (): SendCommandFn => {
  return async (...args: string[]) => {
    if (!redis) {
      throw new Error('Redis not initialized')
    }
    try {
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
    } catch (error) {
      // If Redis call fails, throw to let the store handle it
      throw error
    }
  }
}

// Helper to create rate limiter with optional Redis store
const createLimiter = (config: {
  windowMs: number
  max: number
  message?: { error: string }
  keyGenerator?: (req: any) => string
  prefix: string
}) => {
  const baseConfig = {
    windowMs: config.windowMs,
    max: config.max,
    standardHeaders: true,
    legacyHeaders: false,
    ...(config.message && { message: config.message }),
    ...(config.keyGenerator && { keyGenerator: config.keyGenerator }),
  }

  // Only use Redis store if Redis URL is provided and Redis is initialized
  // The store will handle connection errors gracefully
  if (process.env.REDIS_URL && redis) {
    try {
      return rateLimit({
        ...baseConfig,
        store: new RedisStore({
          sendCommand: createSendCommand(),
          prefix: config.prefix,
        }),
      })
    } catch (error) {
      console.error(`Failed to create Redis store for ${config.prefix}, falling back to memory:`, error)
    }
  }

  // Fallback to in-memory store (default)
  return rateLimit(baseConfig)
}

export const authLimiter = createLimiter({
  windowMs: 5 * 60 * 1000,
  max: 10,
  prefix: 'rl:auth:',
  message: { error: 'Too many authentication attempts, please try again later' },
})

export const runLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 30,
  prefix: 'rl:run:',
  keyGenerator: (req) => req.user?.id || req.ip || 'anonymous',
  message: { error: 'Too many run requests, please slow down' },
})

export const submitLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 10,
  prefix: 'rl:submit:',
  keyGenerator: (req) => req.user?.id || req.ip || 'anonymous',
  message: { error: 'Too many submission requests, please slow down' },
})

export const generalLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 100,
  prefix: 'rl:general:',
})

