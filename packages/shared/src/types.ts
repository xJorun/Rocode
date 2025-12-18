export type Difficulty = 'easy' | 'medium' | 'hard'

export type SubmissionStatus =
  | 'pending'
  | 'running'
  | 'accepted'
  | 'wrong_answer'
  | 'runtime_error'
  | 'time_limit'
  | 'memory_limit'
  | 'compilation_error'

export type SubmissionMode = 'practice' | 'assessment'

export type PlanTier = 'free' | 'pro' | 'studio'

export type LeaderboardRange = 'weekly' | 'monthly' | 'alltime'

export type OrgRole = 'owner' | 'admin' | 'member'

export interface User {
  id: string
  robloxUserId: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  planTier: PlanTier
  createdAt: Date
}

export interface Problem {
  id: string
  slug: string
  title: string
  difficulty: Difficulty
  tags: string[]
  statementMd: string
  template: string
  constraints: string
  isPremium: boolean
  isStudioOnly: boolean
  publishedAt: Date | null
  acceptanceRate: number
  submissionCount: number
}

export interface ProblemSummary {
  id: string
  slug: string
  title: string
  difficulty: Difficulty
  tags: string[]
  isPremium: boolean
  isStudioOnly: boolean
  acceptanceRate: number
  status: 'solved' | 'attempted' | null
}

export interface TestCase {
  id: string
  problemId: string
  visibility: 'public' | 'hidden'
  input: string
  expectedOutput: string
  timeLimit: number
  memoryLimit: number
}

export interface Submission {
  id: string
  userId: string
  problemId: string
  code: string
  status: SubmissionStatus
  runtimeMs: number | null
  memoryKb: number | null
  output: string | null
  errorMessage: string | null
  mode: SubmissionMode
  createdAt: Date
  testResults?: TestResult[]
}

export interface TestResult {
  testId: string
  passed: boolean
  actualOutput: string | null
  runtimeMs: number
  memoryKb: number
  error: string | null
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  score: number
  solvedCount: number
  streakDays: number
}

export interface UserStats {
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  totalSubmissions: number
  acceptanceRate: number
  currentStreak: number
  maxStreak: number
  rank: number | null
  topTags: { tag: string; count: number }[]
  recentSubmissions: Submission[]
}

export interface Track {
  id: string
  slug: string
  name: string
  description: string
  problemIds: string[]
  iconUrl: string | null
}

export interface Assessment {
  id: string
  orgId: string
  name: string
  description: string | null
  timeLimit: number | null
  settings: AssessmentSettings
  createdAt: Date
}

export interface AssessmentSettings {
  shuffleProblems: boolean
  showEditorial: boolean
  allowRun: boolean
  maxAttempts: number | null
}

export interface AssessmentInvite {
  id: string
  assessmentId: string
  token: string
  email: string | null
  expiresAt: Date
  usedAt: Date | null
}

export interface AssessmentAttempt {
  id: string
  inviteId: string
  userId: string
  startedAt: Date
  submittedAt: Date | null
  score: number | null
  report: CandidateReport | null
}

export interface CandidateReport {
  problemResults: {
    problemId: string
    status: SubmissionStatus
    score: number
    timeSpent: number
    attempts: number
  }[]
  totalScore: number
  maxScore: number
  flags: string[]
}

export interface Organization {
  id: string
  name: string
  ownerId: string
  stripeCustomerId: string | null
  seatCount: number
  createdAt: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  iconUrl: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface UserBadge {
  userId: string
  badgeId: string
  earnedAt: Date
}

export interface Snippet {
  id: string
  userId: string | null
  code: string
  title: string | null
  createdAt: Date
  expiresAt: Date | null
}

export interface DailyChallenge {
  date: string
  problemId: string
  problem: Problem
}

export interface JudgeJob {
  id: string
  submissionId: string
  problemId: string
  code: string
  tests: TestCase[]
  timeLimit: number
  memoryLimit: number
}

export interface JudgeResult {
  submissionId: string
  status: SubmissionStatus
  runtimeMs: number
  memoryKb: number
  testResults: TestResult[]
  errorMessage: string | null
}

