import { Router } from 'express'
import { db, users, userSolves, problems, leaderboardSnapshots } from '../db'
import { eq, desc, sql, and, gte } from 'drizzle-orm'
import { leaderboardRangeSchema, DIFFICULTY_POINTS } from '@rocode/shared'

const router = Router()

router.get('/global', async (req, res) => {
  try {
    const range = leaderboardRangeSchema.parse(req.query.range || 'weekly')
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500)
    const page = parseInt(req.query.page as string) || 1
    const offset = (page - 1) * limit

    let dateFilter: Date | null = null
    const now = new Date()

    if (range === 'weekly') {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (range === 'monthly') {
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    const scoreQuery = db
      .select({
        userId: userSolves.userId,
        score: sql<number>`
          SUM(
            CASE ${problems.difficulty}
              WHEN 'easy' THEN ${DIFFICULTY_POINTS.easy}
              WHEN 'medium' THEN ${DIFFICULTY_POINTS.medium}
              WHEN 'hard' THEN ${DIFFICULTY_POINTS.hard}
              ELSE 0
            END
          )
        `,
        solvedCount: sql<number>`COUNT(*)`,
      })
      .from(userSolves)
      .innerJoin(problems, eq(userSolves.problemId, problems.id))
      .$dynamic()

    if (dateFilter) {
      scoreQuery.where(gte(userSolves.firstSolvedAt, dateFilter))
    }

    const scores = await scoreQuery
      .groupBy(userSolves.userId)
      .orderBy(desc(sql`SUM(
        CASE ${problems.difficulty}
          WHEN 'easy' THEN ${DIFFICULTY_POINTS.easy}
          WHEN 'medium' THEN ${DIFFICULTY_POINTS.medium}
          WHEN 'hard' THEN ${DIFFICULTY_POINTS.hard}
          ELSE 0
        END
      )`))
      .limit(limit)
      .offset(offset)

    const userIds = scores.map(s => s.userId)

    if (userIds.length === 0) {
      return res.json({ entries: [], pagination: { page, limit, total: 0 } })
    }

    const userDetails = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        currentStreak: users.currentStreak,
      })
      .from(users)
      .where(sql`${users.id} = ANY(${userIds})`)

    const userMap = new Map(userDetails.map(u => [u.id, u]))

    const entries = scores.map((score, index) => {
      const user = userMap.get(score.userId)
      return {
        rank: offset + index + 1,
        userId: score.userId,
        username: user?.username || 'Unknown',
        displayName: user?.displayName,
        avatarUrl: user?.avatarUrl,
        score: Number(score.score),
        solvedCount: Number(score.solvedCount),
        streakDays: user?.currentStreak || 0,
      }
    })

    res.json({
      entries,
      pagination: { page, limit, total: entries.length },
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

router.get('/problem/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100)

    const [problem] = await db
      .select({ id: problems.id })
      .from(problems)
      .where(eq(problems.slug, slug))
      .limit(1)

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    const fastestSolves = await db
      .select({
        solveId: userSolves.id,
        userId: userSolves.userId,
        solvedAt: userSolves.firstSolvedAt,
      })
      .from(userSolves)
      .where(eq(userSolves.problemId, problem.id))
      .orderBy(userSolves.firstSolvedAt)
      .limit(limit)

    const userIds = fastestSolves.map(s => s.userId)

    if (userIds.length === 0) {
      return res.json({ entries: [] })
    }

    const userDetails = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(sql`${users.id} = ANY(${userIds})`)

    const userMap = new Map(userDetails.map(u => [u.id, u]))

    const entries = fastestSolves.map((solve, index) => {
      const user = userMap.get(solve.userId)
      return {
        rank: index + 1,
        userId: solve.userId,
        username: user?.username || 'Unknown',
        displayName: user?.displayName,
        avatarUrl: user?.avatarUrl,
        solvedAt: solve.solvedAt,
      }
    })

    res.json({ entries })
  } catch (error) {
    console.error('Get problem leaderboard error:', error)
    res.status(500).json({ error: 'Failed to fetch problem leaderboard' })
  }
})

export { router as leaderboardRouter }

