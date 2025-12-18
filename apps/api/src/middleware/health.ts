import { Request, Response } from 'express'
import { db } from '../db'
import { sql } from 'drizzle-orm'

export async function healthCheck(req: Request, res: Response) {
  try {
    await db.execute(sql`SELECT 1`)
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
      },
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

