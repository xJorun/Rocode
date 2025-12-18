import { Router } from 'express'
import { db, users, submissions, userSolves, userBadges, badges, problems } from '../db'
import { eq, count, desc, sql, and } from 'drizzle-orm'
import { paginationSchema } from '@rocode/shared'
import { optionalAuthMiddleware } from '../middleware/auth'

const router = Router()

router.get('/:username', optionalAuthMiddleware, async (req, res) => {
  try {
    const { username } = req.params

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        planTier: users.planTier,
        currentStreak: users.currentStreak,
        maxStreak: users.maxStreak,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const [solvedCounts] = await db
      .select({
        total: count(),
        easy: sql<number>`COUNT(*) FILTER (WHERE ${problems.difficulty} = 'easy')`,
        medium: sql<number>`COUNT(*) FILTER (WHERE ${problems.difficulty} = 'medium')`,
        hard: sql<number>`COUNT(*) FILTER (WHERE ${problems.difficulty} = 'hard')`,
      })
      .from(userSolves)
      .innerJoin(problems, eq(userSolves.problemId, problems.id))
      .where(eq(userSolves.userId, user.id))

    const userBadgesList = await db
      .select({
        id: badges.id,
        name: badges.name,
        description: badges.description,
        iconUrl: badges.iconUrl,
        rarity: badges.rarity,
        earnedAt: userBadges.earnedAt,
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, user.id))
      .orderBy(desc(userBadges.earnedAt))

    const recentSubmissions = await db
      .select({
        id: submissions.id,
        status: submissions.status,
        createdAt: submissions.createdAt,
        problem: {
          slug: problems.slug,
          title: problems.title,
          difficulty: problems.difficulty,
        },
      })
      .from(submissions)
      .innerJoin(problems, eq(submissions.problemId, problems.id))
      .where(eq(submissions.userId, user.id))
      .orderBy(desc(submissions.createdAt))
      .limit(10)

    const topTags = await db
      .select({
        tags: problems.tags,
      })
      .from(userSolves)
      .innerJoin(problems, eq(userSolves.problemId, problems.id))
      .where(eq(userSolves.userId, user.id))

    const tagCounts: Record<string, number> = {}
    for (const row of topTags) {
      for (const tag of row.tags || []) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      }
    }
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, tagCount]) => ({ tag, count: tagCount }))

    res.json({
      user: {
        ...user,
        solvedCounts: {
          total: Number(solvedCounts?.total) || 0,
          easy: Number(solvedCounts?.easy) || 0,
          medium: Number(solvedCounts?.medium) || 0,
          hard: Number(solvedCounts?.hard) || 0,
        },
        badges: userBadgesList,
        recentSubmissions,
        topTags: sortedTags,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.get('/:username/submissions', async (req, res) => {
  try {
    const { username } = req.params
    const { page, limit } = paginationSchema.parse(req.query)

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const offset = (page - 1) * limit

    const submissionsList = await db
      .select({
        id: submissions.id,
        status: submissions.status,
        runtimeMs: submissions.runtimeMs,
        memoryKb: submissions.memoryKb,
        createdAt: submissions.createdAt,
        problem: {
          slug: problems.slug,
          title: problems.title,
          difficulty: problems.difficulty,
        },
      })
      .from(submissions)
      .innerJoin(problems, eq(submissions.problemId, problems.id))
      .where(eq(submissions.userId, user.id))
      .orderBy(desc(submissions.createdAt))
      .limit(limit)
      .offset(offset)

    const [{ total }] = await db
      .select({ total: count() })
      .from(submissions)
      .where(eq(submissions.userId, user.id))

    res.json({
      submissions: submissionsList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get submissions error:', error)
    res.status(500).json({ error: 'Failed to fetch submissions' })
  }
})

router.get('/:username/stats', async (req, res) => {
  try {
    const { username } = req.params

    const [user] = await db
      .select({
        id: users.id,
        currentStreak: users.currentStreak,
        maxStreak: users.maxStreak,
      })
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const [submissionStats] = await db
      .select({
        total: count(),
        accepted: sql<number>`COUNT(*) FILTER (WHERE ${submissions.status} = 'accepted')`,
      })
      .from(submissions)
      .where(eq(submissions.userId, user.id))

    const acceptanceRate = submissionStats.total > 0
      ? (Number(submissionStats.accepted) / Number(submissionStats.total)) * 100
      : 0

    res.json({
      stats: {
        totalSubmissions: Number(submissionStats.total),
        acceptedSubmissions: Number(submissionStats.accepted),
        acceptanceRate: Math.round(acceptanceRate * 100) / 100,
        currentStreak: user.currentStreak,
        maxStreak: user.maxStreak,
      },
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export { router as usersRouter }

