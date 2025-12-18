import { z } from 'zod'

export const difficultySchema = z.enum(['easy', 'medium', 'hard'])

export const submissionStatusSchema = z.enum([
  'pending',
  'running',
  'accepted',
  'wrong_answer',
  'runtime_error',
  'time_limit',
  'memory_limit',
  'compilation_error',
])

export const planTierSchema = z.enum(['free', 'pro', 'studio'])

export const leaderboardRangeSchema = z.enum(['weekly', 'monthly', 'alltime'])

export const problemsQuerySchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: difficultySchema.optional(),
  status: z.enum(['solved', 'attempted', 'unsolved']).optional(),
  isPremium: z.boolean().optional(),
  sort: z.enum(['popularity', 'acceptance', 'newest', 'difficulty']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const runCodeSchema = z.object({
  code: z.string().min(1).max(50000),
  testCases: z.array(z.object({
    input: z.string(),
  })).optional(),
})

export const submitCodeSchema = z.object({
  code: z.string().min(1).max(50000),
})

export const createProblemSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  difficulty: difficultySchema,
  tags: z.array(z.string()),
  statementMd: z.string().min(1),
  template: z.string(),
  constraints: z.string(),
  isPremium: z.boolean().default(false),
  isStudioOnly: z.boolean().default(false),
})

export const updateProblemSchema = createProblemSchema.partial()

export const createTestSchema = z.object({
  visibility: z.enum(['public', 'hidden']),
  input: z.string(),
  expectedOutput: z.string(),
  timeLimit: z.number().int().positive().default(5000),
  memoryLimit: z.number().int().positive().default(128),
})

export const createAssessmentSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  timeLimit: z.number().int().positive().optional(),
  problemIds: z.array(z.string()).min(1),
  settings: z.object({
    shuffleProblems: z.boolean().default(false),
    showEditorial: z.boolean().default(false),
    allowRun: z.boolean().default(true),
    maxAttempts: z.number().int().positive().optional(),
  }).default({}),
})

export const createInviteSchema = z.object({
  emails: z.array(z.string().email()).optional(),
  count: z.number().int().positive().max(100).optional(),
  expiresInDays: z.number().int().positive().max(90).default(7),
})

export const createOrgSchema = z.object({
  name: z.string().min(1).max(200),
})

export const addOrgMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(['admin', 'member']),
})

export const snippetSchema = z.object({
  code: z.string().min(1).max(50000),
  title: z.string().max(200).optional(),
})

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export type ProblemsQuery = z.infer<typeof problemsQuerySchema>
export type RunCodeInput = z.infer<typeof runCodeSchema>
export type SubmitCodeInput = z.infer<typeof submitCodeSchema>
export type CreateProblemInput = z.infer<typeof createProblemSchema>
export type UpdateProblemInput = z.infer<typeof updateProblemSchema>
export type CreateTestInput = z.infer<typeof createTestSchema>
export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>
export type CreateInviteInput = z.infer<typeof createInviteSchema>
export type CreateOrgInput = z.infer<typeof createOrgSchema>
export type AddOrgMemberInput = z.infer<typeof addOrgMemberSchema>
export type SnippetInput = z.infer<typeof snippetSchema>
export type PaginationInput = z.infer<typeof paginationSchema>

