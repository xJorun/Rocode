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

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  robloxUserId: varchar('roblox_user_id', { length: 32 }).notNull().unique(),
  username: varchar('username', { length: 64 }).notNull().unique(),
  displayName: varchar('display_name', { length: 64 }),
  avatarUrl: text('avatar_url'),
  planTier: varchar('plan_tier', { length: 16 }).notNull().default('free'),
  currentStreak: integer('current_streak').notNull().default(0),
  maxStreak: integer('max_streak').notNull().default(0),
  lastSolveDate: timestamp('last_solve_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const problems = pgTable('problems', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  title: varchar('title', { length: 256 }).notNull(),
  difficulty: varchar('difficulty', { length: 16 }).notNull(),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  submissionCount: integer('submission_count').notNull().default(0),
  acceptedCount: integer('accepted_count').notNull().default(0),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const submissions = pgTable(
  'submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    problemId: uuid('problem_id').notNull(),
    code: text('code').notNull(),
    status: varchar('status', { length: 32 }).notNull().default('pending'),
    runtimeMs: integer('runtime_ms'),
    memoryKb: integer('memory_kb'),
    output: text('output'),
    errorMessage: text('error_message'),
    testResults: jsonb('test_results'),
    mode: varchar('mode', { length: 16 }).notNull().default('practice'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    problemIdIdx: index('submissions_problem_id_idx').on(table.problemId),
  })
)

export const userSolves = pgTable(
  'user_solves',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    problemId: uuid('problem_id').notNull(),
    firstSolvedAt: timestamp('first_solved_at').notNull().defaultNow(),
  },
  (table) => ({
    userProblemIdx: uniqueIndex('user_solves_user_problem_idx').on(table.userId, table.problemId),
  })
)

export const plagiarismFlags = pgTable('plagiarism_flags', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').notNull(),
  matchedSubmissionId: uuid('matched_submission_id').notNull(),
  score: decimal('score', { precision: 5, scale: 4 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

