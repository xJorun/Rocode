import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  boolean,
  jsonb,
  decimal,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    robloxUserId: varchar('roblox_user_id', { length: 32 }).notNull().unique(),
    username: varchar('username', { length: 64 }).notNull().unique(),
    displayName: varchar('display_name', { length: 64 }),
    avatarUrl: text('avatar_url'),
    avatarFetchedAt: timestamp('avatar_fetched_at'),
    planTier: varchar('plan_tier', { length: 16 }).notNull().default('free'),
    stripeCustomerId: varchar('stripe_customer_id', { length: 64 }),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 64 }),
    currentStreak: integer('current_streak').notNull().default(0),
    maxStreak: integer('max_streak').notNull().default(0),
    lastSolveDate: timestamp('last_solve_date'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    robloxUserIdIdx: uniqueIndex('users_roblox_user_id_idx').on(table.robloxUserId),
    usernameIdx: uniqueIndex('users_username_idx').on(table.username),
  })
)

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: varchar('token_hash', { length: 128 }).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('sessions_user_id_idx').on(table.userId),
    tokenHashIdx: uniqueIndex('sessions_token_hash_idx').on(table.tokenHash),
  })
)

export const problems = pgTable(
  'problems',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 128 }).notNull().unique(),
    title: varchar('title', { length: 256 }).notNull(),
    difficulty: varchar('difficulty', { length: 16 }).notNull(),
    tags: jsonb('tags').$type<string[]>().notNull().default([]),
    statementMd: text('statement_md').notNull(),
    template: text('template').notNull(),
    constraints: text('constraints').notNull(),
    editorial: text('editorial'),
    isPremium: boolean('is_premium').notNull().default(false),
    isStudioOnly: boolean('is_studio_only').notNull().default(false),
    publishedAt: timestamp('published_at'),
    submissionCount: integer('submission_count').notNull().default(0),
    acceptedCount: integer('accepted_count').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex('problems_slug_idx').on(table.slug),
    difficultyIdx: index('problems_difficulty_idx').on(table.difficulty),
    publishedAtIdx: index('problems_published_at_idx').on(table.publishedAt),
  })
)

export const tests = pgTable(
  'tests',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    problemId: uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
    visibility: varchar('visibility', { length: 16 }).notNull().default('hidden'),
    input: text('input').notNull(),
    expectedOutput: text('expected_output').notNull(),
    timeLimit: integer('time_limit').notNull().default(5000),
    memoryLimit: integer('memory_limit').notNull().default(128),
    orderIndex: integer('order_index').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    problemIdIdx: index('tests_problem_id_idx').on(table.problemId),
  })
)

export const submissions = pgTable(
  'submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    problemId: uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
    code: text('code').notNull(),
    status: varchar('status', { length: 32 }).notNull().default('pending'),
    runtimeMs: integer('runtime_ms'),
    memoryKb: integer('memory_kb'),
    output: text('output'),
    errorMessage: text('error_message'),
    testResults: jsonb('test_results').$type<
      { testId: string; passed: boolean; actualOutput: string | null; runtimeMs: number; memoryKb: number; error: string | null }[]
    >(),
    mode: varchar('mode', { length: 16 }).notNull().default('practice'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('submissions_user_id_idx').on(table.userId),
    problemIdIdx: index('submissions_problem_id_idx').on(table.problemId),
    statusIdx: index('submissions_status_idx').on(table.status),
    createdAtIdx: index('submissions_created_at_idx').on(table.createdAt),
  })
)

export const userSolves = pgTable(
  'user_solves',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    problemId: uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
    firstSolvedAt: timestamp('first_solved_at').notNull().defaultNow(),
  },
  (table) => ({
    userProblemIdx: uniqueIndex('user_solves_user_problem_idx').on(table.userId, table.problemId),
  })
)

export const leaderboardSnapshots = pgTable(
  'leaderboard_snapshots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    range: varchar('range', { length: 16 }).notNull(),
    computedAt: timestamp('computed_at').notNull().defaultNow(),
    entries: jsonb('entries').$type<
      { rank: number; userId: string; score: number; solvedCount: number }[]
    >().notNull(),
  },
  (table) => ({
    rangeIdx: index('leaderboard_snapshots_range_idx').on(table.range),
  })
)

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id),
  stripeCustomerId: varchar('stripe_customer_id', { length: 64 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 64 }),
  seatCount: integer('seat_count').notNull().default(5),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const orgMembers = pgTable(
  'org_members',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 16 }).notNull().default('member'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    orgUserIdx: uniqueIndex('org_members_org_user_idx').on(table.orgId, table.userId),
  })
)

export const assessments = pgTable(
  'assessments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    timeLimit: integer('time_limit'),
    settings: jsonb('settings').$type<{
      shuffleProblems: boolean
      showEditorial: boolean
      allowRun: boolean
      maxAttempts: number | null
    }>().notNull().default({
      shuffleProblems: false,
      showEditorial: false,
      allowRun: true,
      maxAttempts: null,
    }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    orgIdIdx: index('assessments_org_id_idx').on(table.orgId),
  })
)

export const assessmentProblems = pgTable(
  'assessment_problems',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    assessmentId: uuid('assessment_id')
      .notNull()
      .references(() => assessments.id, { onDelete: 'cascade' }),
    problemId: uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull().default(0),
  },
  (table) => ({
    assessmentProblemIdx: uniqueIndex('assessment_problems_idx').on(table.assessmentId, table.problemId),
  })
)

export const assessmentInvites = pgTable(
  'assessment_invites',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    assessmentId: uuid('assessment_id')
      .notNull()
      .references(() => assessments.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 64 }).notNull().unique(),
    email: varchar('email', { length: 256 }),
    expiresAt: timestamp('expires_at').notNull(),
    usedAt: timestamp('used_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    tokenIdx: uniqueIndex('assessment_invites_token_idx').on(table.token),
  })
)

export const assessmentAttempts = pgTable(
  'assessment_attempts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    inviteId: uuid('invite_id')
      .notNull()
      .references(() => assessmentInvites.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    startedAt: timestamp('started_at').notNull().defaultNow(),
    submittedAt: timestamp('submitted_at'),
    score: decimal('score', { precision: 5, scale: 2 }),
    report: jsonb('report').$type<{
      problemResults: {
        problemId: string
        status: string
        score: number
        timeSpent: number
        attempts: number
      }[]
      totalScore: number
      maxScore: number
      flags: string[]
    }>(),
  },
  (table) => ({
    inviteIdIdx: index('assessment_attempts_invite_id_idx').on(table.inviteId),
    userIdIdx: index('assessment_attempts_user_id_idx').on(table.userId),
  })
)

export const tracks = pgTable('tracks', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 128 }).notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const trackProblems = pgTable(
  'track_problems',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    trackId: uuid('track_id')
      .notNull()
      .references(() => tracks.id, { onDelete: 'cascade' }),
    problemId: uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull().default(0),
  },
  (table) => ({
    trackProblemIdx: uniqueIndex('track_problems_idx').on(table.trackId, table.problemId),
  })
)

export const badges = pgTable('badges', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  description: text('description').notNull(),
  iconUrl: text('icon_url'),
  rarity: varchar('rarity', { length: 16 }).notNull().default('common'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const userBadges = pgTable(
  'user_badges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    badgeId: varchar('badge_id', { length: 64 })
      .notNull()
      .references(() => badges.id, { onDelete: 'cascade' }),
    earnedAt: timestamp('earned_at').notNull().defaultNow(),
  },
  (table) => ({
    userBadgeIdx: uniqueIndex('user_badges_idx').on(table.userId, table.badgeId),
  })
)

export const snippets = pgTable('snippets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  code: text('code').notNull(),
  title: varchar('title', { length: 256 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'),
})

export const dailyChallenges = pgTable(
  'daily_challenges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    date: varchar('date', { length: 10 }).notNull().unique(),
    problemId: uuid('problem_id')
      .notNull()
      .references(() => problems.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    dateIdx: uniqueIndex('daily_challenges_date_idx').on(table.date),
  })
)

export const plagiarismFlags = pgTable(
  'plagiarism_flags',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => submissions.id, { onDelete: 'cascade' }),
    matchedSubmissionId: uuid('matched_submission_id')
      .notNull()
      .references(() => submissions.id, { onDelete: 'cascade' }),
    score: decimal('score', { precision: 5, scale: 4 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    submissionIdIdx: index('plagiarism_flags_submission_id_idx').on(table.submissionId),
  })
)

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  submissions: many(submissions),
  solves: many(userSolves),
  badges: many(userBadges),
  orgMemberships: many(orgMembers),
}))

export const problemsRelations = relations(problems, ({ many }) => ({
  tests: many(tests),
  submissions: many(submissions),
  solves: many(userSolves),
}))

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, { fields: [submissions.userId], references: [users.id] }),
  problem: one(problems, { fields: [submissions.problemId], references: [problems.id] }),
}))

