import { Router } from 'express'
import { db, organizations, orgMembers, assessments, assessmentProblems, assessmentInvites, assessmentAttempts, problems, users } from '../db'
import { eq, and, desc } from 'drizzle-orm'
import { createOrgSchema, createAssessmentSchema, createInviteSchema, addOrgMemberSchema } from '@rocode/shared'
import { requireStudio } from '../middleware/auth'
import crypto from 'crypto'

const router = Router()

router.post('/orgs', requireStudio, async (req, res) => {
  try {
    const { name } = createOrgSchema.parse(req.body)

    const [org] = await db
      .insert(organizations)
      .values({
        name,
        ownerId: req.user!.id,
      })
      .returning()

    await db.insert(orgMembers).values({
      orgId: org.id,
      userId: req.user!.id,
      role: 'owner',
    })

    res.json({ org })
  } catch (error) {
    console.error('Create org error:', error)
    res.status(500).json({ error: 'Failed to create organization' })
  }
})

router.get('/orgs', async (req, res) => {
  try {
    const memberships = await db
      .select({
        org: organizations,
        role: orgMembers.role,
      })
      .from(orgMembers)
      .innerJoin(organizations, eq(orgMembers.orgId, organizations.id))
      .where(eq(orgMembers.userId, req.user!.id))

    res.json({ organizations: memberships })
  } catch (error) {
    console.error('Get orgs error:', error)
    res.status(500).json({ error: 'Failed to fetch organizations' })
  }
})

router.get('/orgs/:id', async (req, res) => {
  try {
    const { id } = req.params

    const [membership] = await db
      .select()
      .from(orgMembers)
      .where(and(
        eq(orgMembers.orgId, id),
        eq(orgMembers.userId, req.user!.id)
      ))
      .limit(1)

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this organization' })
    }

    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, id))
      .limit(1)

    const members = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        role: orgMembers.role,
      })
      .from(orgMembers)
      .innerJoin(users, eq(orgMembers.userId, users.id))
      .where(eq(orgMembers.orgId, id))

    res.json({ org, members, userRole: membership.role })
  } catch (error) {
    console.error('Get org error:', error)
    res.status(500).json({ error: 'Failed to fetch organization' })
  }
})

router.post('/orgs/:id/members', async (req, res) => {
  try {
    const { id } = req.params
    const { userId, role } = addOrgMemberSchema.parse(req.body)

    const [membership] = await db
      .select()
      .from(orgMembers)
      .where(and(
        eq(orgMembers.orgId, id),
        eq(orgMembers.userId, req.user!.id)
      ))
      .limit(1)

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    await db.insert(orgMembers).values({
      orgId: id,
      userId,
      role,
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Add member error:', error)
    res.status(500).json({ error: 'Failed to add member' })
  }
})

router.post('/orgs/:id/assessments', async (req, res) => {
  try {
    const { id } = req.params
    const input = createAssessmentSchema.parse(req.body)

    const [membership] = await db
      .select()
      .from(orgMembers)
      .where(and(
        eq(orgMembers.orgId, id),
        eq(orgMembers.userId, req.user!.id)
      ))
      .limit(1)

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this organization' })
    }

    const [assessment] = await db
      .insert(assessments)
      .values({
        orgId: id,
        name: input.name,
        description: input.description,
        timeLimit: input.timeLimit,
        settings: {
          ...input.settings,
          maxAttempts: input.settings.maxAttempts ?? null,
        },
      })
      .returning()

    if (input.problemIds.length > 0) {
      await db.insert(assessmentProblems).values(
        input.problemIds.map((problemId, index) => ({
          assessmentId: assessment.id,
          problemId,
          orderIndex: index,
        }))
      )
    }

    res.json({ assessment })
  } catch (error) {
    console.error('Create assessment error:', error)
    res.status(500).json({ error: 'Failed to create assessment' })
  }
})

router.get('/orgs/:id/assessments', async (req, res) => {
  try {
    const { id } = req.params

    const [membership] = await db
      .select()
      .from(orgMembers)
      .where(and(
        eq(orgMembers.orgId, id),
        eq(orgMembers.userId, req.user!.id)
      ))
      .limit(1)

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this organization' })
    }

    const assessmentsList = await db
      .select()
      .from(assessments)
      .where(eq(assessments.orgId, id))
      .orderBy(desc(assessments.createdAt))

    res.json({ assessments: assessmentsList })
  } catch (error) {
    console.error('Get assessments error:', error)
    res.status(500).json({ error: 'Failed to fetch assessments' })
  }
})

router.get('/orgs/:orgId/assessments/:assessmentId', async (req, res) => {
  try {
    const { orgId, assessmentId } = req.params

    const [membership] = await db
      .select()
      .from(orgMembers)
      .where(and(
        eq(orgMembers.orgId, orgId),
        eq(orgMembers.userId, req.user!.id)
      ))
      .limit(1)

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this organization' })
    }

    const [assessment] = await db
      .select()
      .from(assessments)
      .where(and(
        eq(assessments.id, assessmentId),
        eq(assessments.orgId, orgId)
      ))
      .limit(1)

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' })
    }

    const assessmentProblemsList = await db
      .select({
        id: problems.id,
        slug: problems.slug,
        title: problems.title,
        difficulty: problems.difficulty,
        orderIndex: assessmentProblems.orderIndex,
      })
      .from(assessmentProblems)
      .innerJoin(problems, eq(assessmentProblems.problemId, problems.id))
      .where(eq(assessmentProblems.assessmentId, assessmentId))
      .orderBy(assessmentProblems.orderIndex)

    const invites = await db
      .select()
      .from(assessmentInvites)
      .where(eq(assessmentInvites.assessmentId, assessmentId))
      .orderBy(desc(assessmentInvites.createdAt))

    res.json({
      assessment,
      problems: assessmentProblemsList,
      invites,
    })
  } catch (error) {
    console.error('Get assessment error:', error)
    res.status(500).json({ error: 'Failed to fetch assessment' })
  }
})

router.post('/assessments/:assessmentId/invite', async (req, res) => {
  try {
    const { assessmentId } = req.params
    const input = createInviteSchema.parse(req.body)

    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, assessmentId))
      .limit(1)

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' })
    }

    const [membership] = await db
      .select()
      .from(orgMembers)
      .where(and(
        eq(orgMembers.orgId, assessment.orgId),
        eq(orgMembers.userId, req.user!.id)
      ))
      .limit(1)

    if (!membership) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const expiresAt = new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
    const invites: typeof assessmentInvites.$inferInsert[] = []

    if (input.emails && input.emails.length > 0) {
      for (const email of input.emails) {
        invites.push({
          assessmentId,
          token: crypto.randomBytes(32).toString('hex'),
          email,
          expiresAt,
        })
      }
    } else {
      const count = input.count || 1
      for (let i = 0; i < count; i++) {
        invites.push({
          assessmentId,
          token: crypto.randomBytes(32).toString('hex'),
          expiresAt,
        })
      }
    }

    const createdInvites = await db
      .insert(assessmentInvites)
      .values(invites)
      .returning()

    res.json({ invites: createdInvites })
  } catch (error) {
    console.error('Create invite error:', error)
    res.status(500).json({ error: 'Failed to create invites' })
  }
})

router.get('/assessments/:assessmentId/candidates', async (req, res) => {
  try {
    const { assessmentId } = req.params

    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, assessmentId))
      .limit(1)

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' })
    }

    const [membership] = await db
      .select()
      .from(orgMembers)
      .where(and(
        eq(orgMembers.orgId, assessment.orgId),
        eq(orgMembers.userId, req.user!.id)
      ))
      .limit(1)

    if (!membership) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const attempts = await db
      .select({
        id: assessmentAttempts.id,
        startedAt: assessmentAttempts.startedAt,
        submittedAt: assessmentAttempts.submittedAt,
        score: assessmentAttempts.score,
        user: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(assessmentAttempts)
      .innerJoin(assessmentInvites, eq(assessmentAttempts.inviteId, assessmentInvites.id))
      .innerJoin(users, eq(assessmentAttempts.userId, users.id))
      .where(eq(assessmentInvites.assessmentId, assessmentId))
      .orderBy(desc(assessmentAttempts.startedAt))

    res.json({ candidates: attempts })
  } catch (error) {
    console.error('Get candidates error:', error)
    res.status(500).json({ error: 'Failed to fetch candidates' })
  }
})

router.get('/candidates/:candidateId/report', async (req, res) => {
  try {
    const { candidateId } = req.params

    const [attempt] = await db
      .select({
        id: assessmentAttempts.id,
        startedAt: assessmentAttempts.startedAt,
        submittedAt: assessmentAttempts.submittedAt,
        score: assessmentAttempts.score,
        report: assessmentAttempts.report,
        inviteId: assessmentAttempts.inviteId,
      })
      .from(assessmentAttempts)
      .where(eq(assessmentAttempts.id, candidateId))
      .limit(1)

    if (!attempt) {
      return res.status(404).json({ error: 'Candidate not found' })
    }

    const [invite] = await db
      .select()
      .from(assessmentInvites)
      .where(eq(assessmentInvites.id, attempt.inviteId))
      .limit(1)

    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, invite!.assessmentId))
      .limit(1)

    const [membership] = await db
      .select()
      .from(orgMembers)
      .where(and(
        eq(orgMembers.orgId, assessment!.orgId),
        eq(orgMembers.userId, req.user!.id)
      ))
      .limit(1)

    if (!membership) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
      })
      .from(assessmentAttempts)
      .innerJoin(users, eq(assessmentAttempts.userId, users.id))
      .where(eq(assessmentAttempts.id, candidateId))
      .limit(1)

    res.json({
      attempt,
      user,
      assessment: {
        id: assessment!.id,
        name: assessment!.name,
      },
    })
  } catch (error) {
    console.error('Get candidate report error:', error)
    res.status(500).json({ error: 'Failed to fetch candidate report' })
  }
})

export { router as studioRouter }

