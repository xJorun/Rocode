import { Router } from 'express'
import { db, problems, tests, badges, tracks, trackProblems, dailyChallenges } from '../db'
import { eq } from 'drizzle-orm'
import { createProblemSchema, updateProblemSchema, createTestSchema } from '@rocode/shared'
import { requireAdmin } from '../middleware/auth'

const router = Router()

router.use(requireAdmin)

router.post('/problems', async (req, res) => {
  try {
    const input = createProblemSchema.parse(req.body)

    const [problem] = await db
      .insert(problems)
      .values(input)
      .returning()

    res.json({ problem })
  } catch (error) {
    console.error('Create problem error:', error)
    res.status(500).json({ error: 'Failed to create problem' })
  }
})

router.patch('/problems/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const input = updateProblemSchema.parse(req.body)

    const [problem] = await db
      .update(problems)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(problems.slug, slug))
      .returning()

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    res.json({ problem })
  } catch (error) {
    console.error('Update problem error:', error)
    res.status(500).json({ error: 'Failed to update problem' })
  }
})

router.post('/problems/:slug/tests', async (req, res) => {
  try {
    const { slug } = req.params
    const input = createTestSchema.parse(req.body)

    const [problem] = await db
      .select({ id: problems.id })
      .from(problems)
      .where(eq(problems.slug, slug))
      .limit(1)

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    const [test] = await db
      .insert(tests)
      .values({
        problemId: problem.id,
        ...input,
      })
      .returning()

    res.json({ test })
  } catch (error) {
    console.error('Create test error:', error)
    res.status(500).json({ error: 'Failed to create test' })
  }
})

router.post('/publish/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const [problem] = await db
      .update(problems)
      .set({ publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(problems.slug, slug))
      .returning()

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    res.json({ problem })
  } catch (error) {
    console.error('Publish problem error:', error)
    res.status(500).json({ error: 'Failed to publish problem' })
  }
})

router.delete('/problems/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    await db.delete(problems).where(eq(problems.slug, slug))

    res.json({ success: true })
  } catch (error) {
    console.error('Delete problem error:', error)
    res.status(500).json({ error: 'Failed to delete problem' })
  }
})

router.get('/problems', async (req, res) => {
  try {
    const allProblems = await db
      .select()
      .from(problems)
      .orderBy(problems.createdAt)

    res.json({ problems: allProblems })
  } catch (error) {
    console.error('Get problems error:', error)
    res.status(500).json({ error: 'Failed to fetch problems' })
  }
})

router.post('/tracks', async (req, res) => {
  try {
    const { slug, name, description, iconUrl, problemIds } = req.body

    const [track] = await db
      .insert(tracks)
      .values({ slug, name, description, iconUrl })
      .returning()

    if (problemIds && problemIds.length > 0) {
      await db.insert(trackProblems).values(
        problemIds.map((problemId: string, index: number) => ({
          trackId: track.id,
          problemId,
          orderIndex: index,
        }))
      )
    }

    res.json({ track })
  } catch (error) {
    console.error('Create track error:', error)
    res.status(500).json({ error: 'Failed to create track' })
  }
})

router.post('/daily-challenge', async (req, res) => {
  try {
    const { date, problemId } = req.body

    const [challenge] = await db
      .insert(dailyChallenges)
      .values({ date, problemId })
      .onConflictDoUpdate({
        target: dailyChallenges.date,
        set: { problemId },
      })
      .returning()

    res.json({ challenge })
  } catch (error) {
    console.error('Set daily challenge error:', error)
    res.status(500).json({ error: 'Failed to set daily challenge' })
  }
})

router.post('/badges', async (req, res) => {
  try {
    const { id, name, description, iconUrl, rarity } = req.body

    const [badge] = await db
      .insert(badges)
      .values({ id, name, description, iconUrl, rarity })
      .onConflictDoUpdate({
        target: badges.id,
        set: { name, description, iconUrl, rarity },
      })
      .returning()

    res.json({ badge })
  } catch (error) {
    console.error('Create badge error:', error)
    res.status(500).json({ error: 'Failed to create badge' })
  }
})

export { router as adminRouter }

