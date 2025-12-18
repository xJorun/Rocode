import Redis from 'ioredis'
import { logger } from './logger'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

redis.on('error', (err) => {
  logger.error('Redis error', { error: err.message })
})

export async function getCached<T>(key: string): Promise<T | null> {
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
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value))
  } catch (error) {
    logger.warn('Cache set error', { key, error })
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
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

