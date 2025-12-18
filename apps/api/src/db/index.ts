import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Lazy initialization of database connection
let pool: Pool | null = null
let dbInstance: ReturnType<typeof drizzle> | null = null

function getDb() {
  if (dbInstance) {
    return dbInstance
  }

  if (!process.env.DATABASE_URL) {
    const error = new Error('DATABASE_URL environment variable is not set')
    console.error(error.message)
    throw error
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Connection pool settings optimized for serverless
      max: 1, // Serverless functions should use minimal connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err)
    })
  }

  dbInstance = drizzle(pool, { schema })
  return dbInstance
}

// Create a proxy that initializes the db on first access
// This ensures db is always available but only connects when actually used
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const instance = getDb()
    const value = (instance as any)[prop]
    // If it's a function, bind it to the instance
    if (typeof value === 'function') {
      return value.bind(instance)
    }
    return value
  },
})

export * from './schema'

