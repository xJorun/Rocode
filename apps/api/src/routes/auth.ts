import { Router } from 'express'
import crypto from 'crypto'
import { db, users, sessions } from '../db'
import { eq } from 'drizzle-orm'
import { authLimiter } from '../middleware/rateLimit'
import { ROBLOX_OAUTH, ROBLOX_API } from '@rocode/shared'

const router = Router()

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url')
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url')
}

function generateState(): string {
  return crypto.randomBytes(16).toString('hex')
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

const pendingAuth = new Map<string, { verifier: string; expiresAt: number }>()

router.get('/roblox/start', authLimiter, (req, res) => {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)

  pendingAuth.set(state, {
    verifier: codeVerifier,
    expiresAt: Date.now() + 10 * 60 * 1000,
  })

  const params = new URLSearchParams({
    client_id: process.env.ROBLOX_CLIENT_ID!,
    redirect_uri: process.env.ROBLOX_REDIRECT_URI!,
    response_type: 'code',
    scope: ROBLOX_OAUTH.scopes.join(' '),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  res.json({ url: `${ROBLOX_OAUTH.authUrl}?${params}` })
})

router.get('/roblox/callback', authLimiter, async (req, res) => {
  try {
    const { code, state } = req.query

    if (!code || !state || typeof code !== 'string' || typeof state !== 'string') {
      return res.status(400).json({ error: 'Missing code or state' })
    }

    const pending = pendingAuth.get(state)
    if (!pending || pending.expiresAt < Date.now()) {
      pendingAuth.delete(state)
      return res.status(400).json({ error: 'Invalid or expired state' })
    }
    pendingAuth.delete(state)

    const tokenResponse = await fetch(ROBLOX_OAUTH.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.ROBLOX_REDIRECT_URI!,
        client_id: process.env.ROBLOX_CLIENT_ID!,
        client_secret: process.env.ROBLOX_CLIENT_SECRET!,
        code_verifier: pending.verifier,
      }),
    })

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text())
      return res.status(400).json({ error: 'Failed to exchange code for token' })
    }

    const tokens = await tokenResponse.json() as { access_token: string }

    const userInfoResponse = await fetch(ROBLOX_OAUTH.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      return res.status(400).json({ error: 'Failed to fetch user info' })
    }

    const userInfo = await userInfoResponse.json() as {
      sub: string
      preferred_username: string
      nickname?: string
    }

    const robloxUserId = userInfo.sub
    const username = userInfo.preferred_username
    const displayName = userInfo.nickname || null

    let avatarUrl: string | null = null
    try {
      const thumbnailResponse = await fetch(
        `${ROBLOX_API.thumbnailUrl}?userIds=${robloxUserId}&size=150x150&format=Png`
      )
      if (thumbnailResponse.ok) {
        const thumbnailData = await thumbnailResponse.json() as { data: { imageUrl: string }[] }
        avatarUrl = thumbnailData.data?.[0]?.imageUrl || null
      }
    } catch (e) {
      console.error('Failed to fetch avatar:', e)
    }

    let [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.robloxUserId, robloxUserId))
      .limit(1)

    if (existingUser) {
      await db
        .update(users)
        .set({
          username,
          displayName,
          avatarUrl,
          avatarFetchedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          robloxUserId,
          username,
          displayName,
          avatarUrl,
          avatarFetchedAt: new Date(),
        })
        .returning()
      existingUser = newUser
    }

    const sessionToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = hashToken(sessionToken)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await db.insert(sessions).values({
      userId: existingUser.id,
      tokenHash,
      expiresAt,
    })

    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?token=${sessionToken}`
    res.redirect(redirectUrl)
  } catch (error) {
    console.error('Auth callback error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
})

router.post('/logout', async (req, res) => {
  const cookieToken = req.headers.cookie?.split(';').find(c => c.trim().startsWith('session='))?.split('=')[1]
  
  if (cookieToken) {
    const tokenHash = hashToken(cookieToken)
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash))
  }

  res.clearCookie('session')
  res.json({ success: true })
})

export { router as authRouter }

