import { Request, Response, NextFunction } from 'express'
import { db, sessions, users } from '../db'
import { eq, and, gt } from 'drizzle-orm'
import crypto from 'crypto'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        robloxUserId: string
        username: string
        displayName: string | null
        avatarUrl: string | null
        planTier: string
      }
      sessionId?: string
    }
  }
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    const cookieToken = req.headers.cookie?.split(';').find(c => c.trim().startsWith('session='))?.split('=')[1]
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const tokenHash = hashToken(token)
    
    const [session] = await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.tokenHash, tokenHash),
        gt(sessions.expiresAt, new Date())
      ))
      .limit(1)

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' })
    }

    const [user] = await db
      .select({
        id: users.id,
        robloxUserId: users.robloxUserId,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        planTier: users.planTier,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = user
    req.sessionId = session.id
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const cookieToken = req.headers.cookie?.split(';').find(c => c.trim().startsWith('session='))?.split('=')[1]
  
  const token = authHeader?.replace('Bearer ', '') || cookieToken

  if (!token) {
    return next()
  }

  try {
    const tokenHash = hashToken(token)
    
    const [session] = await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.tokenHash, tokenHash),
        gt(sessions.expiresAt, new Date())
      ))
      .limit(1)

    if (session) {
      const [user] = await db
        .select({
          id: users.id,
          robloxUserId: users.robloxUserId,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
          planTier: users.planTier,
        })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1)

      if (user) {
        req.user = user
        req.sessionId = session.id
      }
    }
  } catch (error) {
    console.error('Optional auth error:', error)
  }

  next()
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

export function requirePro(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  if (req.user.planTier === 'free') {
    return res.status(403).json({ error: 'Pro subscription required' })
  }
  next()
}

export function requireStudio(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  if (req.user.planTier !== 'studio') {
    return res.status(403).json({ error: 'Studio subscription required' })
  }
  next()
}

