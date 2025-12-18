import { Router } from 'express'
import { db, dailyChallenges, problems, submissions, userSolves } from '../db'
import { eq, and, desc, sql } from 'drizzle-orm'
import { optionalAuthMiddleware } from '../middleware/auth'

const router = Router()

router.get('/today', optionalAuthMiddleware, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const [challenge] = await db
      .select({
        id: dailyChallenges.id,
        date: dailyChallenges.date,
        problem: problems,
      })
      .from(dailyChallenges)
      .innerJoin(problems, eq(dailyChallenges.problemId, problems.id))
      .where(eq(dailyChallenges.date, today))
      .limit(1)

    if (!challenge) {
      return res.status(404).json({ error: 'No challenge for today' })
    }

    let userSolved = false
    if (req.user) {
      const [solve] = await db
        .select()
        .from(userSolves)
        .where(
          and(
            eq(userSolves.userId, req.user.id),
            eq(userSolves.problemId, challenge.problem.id)
          )
        )
        .limit(1)
      userSolved = !!solve
    }

    res.json({
      challenge: {
        id: challenge.id,
        date: challenge.date,
        problem: challenge.problem,
      },
      userSolved,
    })
  } catch (error) {
    console.error('Get daily challenge error:', error)
    res.status(500).json({ error: 'Failed to fetch daily challenge' })
  }
})

router.get('/history', optionalAuthMiddleware, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 30, 100)
    const offset = parseInt(req.query.offset as string) || 0

    const challenges = await db
      .select({
        id: dailyChallenges.id,
        date: dailyChallenges.date,
        problem: problems,
      })
      .from(dailyChallenges)
      .innerJoin(problems, eq(dailyChallenges.problemId, problems.id))
      .orderBy(desc(dailyChallenges.date))
      .limit(limit)
      .offset(offset)

    res.json({ challenges })
  } catch (error) {
    console.error('Get daily challenge history error:', error)
    res.status(500).json({ error: 'Failed to fetch challenge history' })
  }
})

export { router as dailyRouter }

