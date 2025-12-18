import { Router } from 'express'
import { db, submissions, problems } from '../db'
import { eq, and } from 'drizzle-orm'

const router = Router()

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const [submission] = await db
      .select({
        id: submissions.id,
        code: submissions.code,
        status: submissions.status,
        runtimeMs: submissions.runtimeMs,
        memoryKb: submissions.memoryKb,
        output: submissions.output,
        errorMessage: submissions.errorMessage,
        testResults: submissions.testResults,
        createdAt: submissions.createdAt,
        userId: submissions.userId,
        problem: {
          slug: problems.slug,
          title: problems.title,
          difficulty: problems.difficulty,
        },
      })
      .from(submissions)
      .innerJoin(problems, eq(submissions.problemId, problems.id))
      .where(eq(submissions.id, id))
      .limit(1)

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    if (submission.userId !== req.user.id) {
      const filteredSubmission = {
        ...submission,
        code: undefined,
        testResults: undefined,
      }
      return res.json({ submission: filteredSubmission })
    }

    res.json({ submission })
  } catch (error) {
    console.error('Get submission error:', error)
    res.status(500).json({ error: 'Failed to fetch submission' })
  }
})

router.get('/:id/status', async (req, res) => {
  try {
    const { id } = req.params

    const [submission] = await db
      .select({
        id: submissions.id,
        status: submissions.status,
        runtimeMs: submissions.runtimeMs,
        memoryKb: submissions.memoryKb,
        testResults: submissions.testResults,
        errorMessage: submissions.errorMessage,
      })
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1)

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    res.json({ submission })
  } catch (error) {
    console.error('Get submission status error:', error)
    res.status(500).json({ error: 'Failed to fetch submission status' })
  }
})

export { router as submissionsRouter }

