import { Router } from 'express'
import { db, snippets } from '../db'
import { eq } from 'drizzle-orm'
import { snippetSchema } from '@rocode/shared'
import { optionalAuthMiddleware } from '../middleware/auth'
import { executeLuau } from '../lib/executor'

const router = Router()

router.post('/run', optionalAuthMiddleware, async (req, res) => {
  try {
    const { code } = req.body

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' })
    }

    if (code.length > 50000) {
      return res.status(400).json({ error: 'Code too long' })
    }

    // Execute code directly with empty input (playground mode)
    const result = await executeLuau(code, '', 10000) // 10 second timeout for playground

    res.json({
      output: result.output,
      error: result.error,
      runtimeMs: result.runtimeMs,
    })
  } catch (error) {
    console.error('Playground run error:', error)
    res.status(500).json({ error: 'Failed to run code' })
  }
})

router.post('/snippets', optionalAuthMiddleware, async (req, res) => {
  try {
    const input = snippetSchema.parse(req.body)

    const expiresAt = req.user
      ? null
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const [snippet] = await db
      .insert(snippets)
      .values({
        userId: req.user?.id || null,
        code: input.code,
        title: input.title,
        expiresAt,
      })
      .returning()

    res.json({ snippet })
  } catch (error) {
    console.error('Create snippet error:', error)
    res.status(500).json({ error: 'Failed to create snippet' })
  }
})

router.get('/snippets/:id', async (req, res) => {
  try {
    const { id } = req.params

    const [snippet] = await db
      .select()
      .from(snippets)
      .where(eq(snippets.id, id))
      .limit(1)

    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' })
    }

    if (snippet.expiresAt && new Date(snippet.expiresAt) < new Date()) {
      return res.status(404).json({ error: 'Snippet expired' })
    }

    res.json({ snippet })
  } catch (error) {
    console.error('Get snippet error:', error)
    res.status(500).json({ error: 'Failed to fetch snippet' })
  }
})

export { router as playgroundRouter }

