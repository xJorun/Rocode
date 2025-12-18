import Redis from 'ioredis'
import { logger } from './logger'

// Initialize Redis with error handling - make it optional
let redis: Redis | null = null

if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      retryStrategy: () => null, // Disable retries
      maxRetriesPerRequest: 1,
      lazyConnect: true, // Don't connect immediately
      enableOfflineQueue: false, // Don't queue commands when offline
    })

    redis.on('error', (err) => {
      logger.error('Redis error', { error: err.message })
    })

    // Attempt connection asynchronously, don't block
    redis.connect().catch(() => {
      logger.warn('Redis connection failed, cache will be unavailable')
    })
  } catch (error) {
    logger.error('Failed to initialize Redis', { error })
    redis = null
  }
}

export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null
  try {
    const data = await redis.get(key)
    if (!data) return null
    return JSON.parse(data) as T
  } catch (error) {
    logger.warn('Cache get error', { key, error })
    return null
  }
}

export async function setCached(key: string, value: any, ttlSeconds = 3600): Promise<void> {
  if (!redis) return
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value))
  } catch (error) {
    logger.warn('Cache set error', { key, error })
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (!redis) return
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    logger.warn('Cache invalidation error', { pattern, error })
  }
}

export { redis }

