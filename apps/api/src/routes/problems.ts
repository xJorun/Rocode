import { Router } from 'express'
import { db, problems, tests, submissions, userSolves } from '../db'
import { eq, and, desc, asc, sql, ilike, inArray, isNotNull } from 'drizzle-orm'
import { problemsQuerySchema, runCodeSchema, submitCodeSchema } from '@rocode/shared'
import { runLimiter, submitLimiter } from '../middleware/rateLimit'
import { optionalAuthMiddleware, requirePro } from '../middleware/auth'
import { executeLuau, runTestCases } from '../lib/executor'

const router = Router()

router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const query = problemsQuerySchema.parse(req.query)
    const { search, tags, difficulty, status, isPremium, sort, page, limit } = query
    const offset = (page - 1) * limit

    let baseQuery = db
      .select({
        id: problems.id,
        slug: problems.slug,
        title: problems.title,
        difficulty: problems.difficulty,
        tags: problems.tags,
        isPremium: problems.isPremium,
        isStudioOnly: problems.isStudioOnly,
        submissionCount: problems.submissionCount,
        acceptedCount: problems.acceptedCount,
      })
      .from(problems)
      .where(isNotNull(problems.publishedAt))
      .$dynamic()

    if (search) {
      baseQuery = baseQuery.where(ilike(problems.title, `%${search}%`))
    }

    if (difficulty) {
      baseQuery = baseQuery.where(eq(problems.difficulty, difficulty))
    }

    if (isPremium !== undefined) {
      baseQuery = baseQuery.where(eq(problems.isPremium, isPremium))
    }

    const orderMap = {
      popularity: desc(problems.submissionCount),
      acceptance: desc(sql`CASE WHEN ${problems.submissionCount} > 0 THEN ${problems.acceptedCount}::float / ${problems.submissionCount} ELSE 0 END`),
      newest: desc(problems.publishedAt),
      difficulty: asc(sql`CASE ${problems.difficulty} WHEN 'easy' THEN 1 WHEN 'medium' THEN 2 WHEN 'hard' THEN 3 END`),
    }

    baseQuery = baseQuery
      .orderBy(orderMap[sort || 'popularity'])
      .limit(limit)
      .offset(offset)

    const problemsList = await baseQuery

    let userSolvedIds: Set<string> = new Set()
    let userAttemptedIds: Set<string> = new Set()

    if (req.user) {
      const solves = await db
        .select({ problemId: userSolves.problemId })
        .from(userSolves)
        .where(eq(userSolves.userId, req.user.id))
      userSolvedIds = new Set(solves.map(s => s.problemId))

      const attempts = await db
        .select({ problemId: submissions.problemId })
        .from(submissions)
        .where(eq(submissions.userId, req.user.id))
        .groupBy(submissions.problemId)
      userAttemptedIds = new Set(attempts.map(a => a.problemId))
    }

    const enrichedProblems = problemsList.map(p => ({
      ...p,
      acceptanceRate: p.submissionCount > 0
        ? Math.round((p.acceptedCount / p.submissionCount) * 1000) / 10
        : 0,
      status: userSolvedIds.has(p.id)
        ? 'solved'
        : userAttemptedIds.has(p.id)
        ? 'attempted'
        : null,
    }))

    let filteredProblems = enrichedProblems
    if (status === 'solved') {
      filteredProblems = enrichedProblems.filter(p => p.status === 'solved')
    } else if (status === 'attempted') {
      filteredProblems = enrichedProblems.filter(p => p.status === 'attempted')
    } else if (status === 'unsolved') {
      filteredProblems = enrichedProblems.filter(p => p.status === null)
    }

    if (tags && tags.length > 0) {
      filteredProblems = filteredProblems.filter(p =>
        tags.some(tag => (p.tags as string[]).includes(tag))
      )
    }

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)` })
      .from(problems)
      .where(isNotNull(problems.publishedAt))

    res.json({
      problems: filteredProblems,
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
      },
    })
  } catch (error) {
    console.error('Get problems error:', error)
    res.status(500).json({ error: 'Failed to fetch problems' })
  }
})

router.get('/:slug', optionalAuthMiddleware, async (req, res) => {
  try {
    const { slug } = req.params

    const [problem] = await db
      .select()
      .from(problems)
      .where(eq(problems.slug, slug))
      .limit(1)

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    const publicTests = await db
      .select({
        id: tests.id,
        input: tests.input,
        expectedOutput: tests.expectedOutput,
      })
      .from(tests)
      .where(and(
        eq(tests.problemId, problem.id),
        eq(tests.visibility, 'public')
      ))
      .orderBy(asc(tests.orderIndex))

    let userStatus = null
    if (req.user) {
      const [solve] = await db
        .select()
        .from(userSolves)
        .where(and(
          eq(userSolves.userId, req.user.id),
          eq(userSolves.problemId, problem.id)
        ))
        .limit(1)

      if (solve) {
        userStatus = 'solved'
      } else {
        const [attempt] = await db
          .select()
          .from(submissions)
          .where(and(
            eq(submissions.userId, req.user.id),
            eq(submissions.problemId, problem.id)
          ))
          .limit(1)

        if (attempt) {
          userStatus = 'attempted'
        }
      }
    }

    res.json({
      problem: {
        id: problem.id,
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags,
        statementMd: problem.statementMd,
        template: problem.template,
        constraints: problem.constraints,
        isPremium: problem.isPremium,
        isStudioOnly: problem.isStudioOnly,
        acceptanceRate: problem.submissionCount > 0
          ? Math.round((problem.acceptedCount / problem.submissionCount) * 1000) / 10
          : 0,
        submissionCount: problem.submissionCount,
        status: userStatus,
      },
      testCases: publicTests,
    })
  } catch (error) {
    console.error('Get problem error:', error)
    res.status(500).json({ error: 'Failed to fetch problem' })
  }
})

router.get('/:slug/editorial', requirePro, async (req, res) => {
  try {
    const { slug } = req.params

    const [problem] = await db
      .select({ editorial: problems.editorial, id: problems.id })
      .from(problems)
      .where(eq(problems.slug, slug))
      .limit(1)

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    const [solve] = await db
      .select()
      .from(userSolves)
      .where(and(
        eq(userSolves.userId, req.user!.id),
        eq(userSolves.problemId, problem.id)
      ))
      .limit(1)

    if (!solve && req.user?.planTier === 'free') {
      return res.status(403).json({ error: 'Solve the problem or upgrade to Pro to view editorial' })
    }

    res.json({ editorial: problem.editorial })
  } catch (error) {
    console.error('Get editorial error:', error)
    res.status(500).json({ error: 'Failed to fetch editorial' })
  }
})

router.post('/:slug/run', runLimiter, async (req, res) => {
  try {
    const { slug } = req.params
    const { code, testCases: customTests } = runCodeSchema.parse(req.body)

    const [problem] = await db
      .select()
      .from(problems)
      .where(eq(problems.slug, slug))
      .limit(1)

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    const publicTests = await db
      .select()
      .from(tests)
      .where(and(
        eq(tests.problemId, problem.id),
        eq(tests.visibility, 'public')
      ))
      .orderBy(asc(tests.orderIndex))
      .limit(3)

    const testsToRun = customTests?.length
      ? customTests.map((t, i) => ({
          id: `custom-${i}`,
          input: t.input,
          expectedOutput: publicTests[0]?.expectedOutput || '',
        }))
      : publicTests.map(t => ({
          id: t.id,
          input: t.input,
          expectedOutput: t.expectedOutput,
        }))

    const { results, allPassed } = await runTestCases(code, testsToRun)

    res.json({
      status: 'completed',
      results: results.map(r => ({
        testId: r.testId,
        passed: r.passed,
        output: r.output,
        expected: r.expected,
        runtimeMs: r.runtimeMs,
        error: r.error,
      })),
      allPassed,
    })
  } catch (error) {
    console.error('Run code error:', error)
    res.status(500).json({ error: 'Failed to run code' })
  }
})

router.post('/:slug/submit', submitLimiter, async (req, res) => {
  try {
    const { slug } = req.params
    const { code } = submitCodeSchema.parse(req.body)

    if (!req.user) {
      return res.status(401).json({ error: 'Login required to submit' })
    }

    const [problem] = await db
      .select()
      .from(problems)
      .where(eq(problems.slug, slug))
      .limit(1)

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    const allTests = await db
      .select()
      .from(tests)
      .where(eq(tests.problemId, problem.id))
      .orderBy(asc(tests.orderIndex))

    const { results, allPassed } = await runTestCases(
      code,
      allTests.map(t => ({ id: t.id, input: t.input, expectedOutput: t.expectedOutput }))
    )

    const totalRuntime = results.reduce((sum, r) => sum + r.runtimeMs, 0)
    const status = allPassed ? 'accepted' : results.some(r => r.error) ? 'runtime_error' : 'wrong_answer'

    const publicResults = results
      .filter((_, i) => allTests[i]?.visibility === 'public')
      .map(r => ({
        testId: r.testId,
        passed: r.passed,
        actualOutput: r.output,
        runtimeMs: r.runtimeMs,
        memoryKb: 0,
        error: r.error,
      }))

    const [submission] = await db
      .insert(submissions)
      .values({
        userId: req.user.id,
        problemId: problem.id,
        code,
        status,
        runtimeMs: totalRuntime,
        memoryKb: 0,
        testResults: publicResults,
        mode: 'practice',
      })
      .returning()

    if (allPassed) {
      await db
        .insert(userSolves)
        .values({ userId: req.user.id, problemId: problem.id })
        .onConflictDoNothing()
    }

    res.json({
      submissionId: submission.id,
      status,
      runtimeMs: totalRuntime,
      results: publicResults,
      allPassed,
    })
  } catch (error) {
    console.error('Submit code error:', error)
    res.status(500).json({ error: 'Failed to submit code' })
  }
})

router.get('/:slug/submissions', async (req, res) => {
  try {
    const { slug } = req.params
    const me = req.query.me === '1'

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const [problem] = await db
      .select({ id: problems.id })
      .from(problems)
      .where(eq(problems.slug, slug))
      .limit(1)

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    const query = me
      ? and(eq(submissions.problemId, problem.id), eq(submissions.userId, req.user.id))
      : eq(submissions.problemId, problem.id)

    const submissionsList = await db
      .select({
        id: submissions.id,
        status: submissions.status,
        runtimeMs: submissions.runtimeMs,
        memoryKb: submissions.memoryKb,
        createdAt: submissions.createdAt,
      })
      .from(submissions)
      .where(query)
      .orderBy(desc(submissions.createdAt))
      .limit(20)

    res.json({ submissions: submissionsList })
  } catch (error) {
    console.error('Get submissions error:', error)
    res.status(500).json({ error: 'Failed to fetch submissions' })
  }
})

export { router as problemsRouter }

