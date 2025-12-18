export const DIFFICULTY_POINTS = {
  easy: 10,
  medium: 20,
  hard: 40,
} as const

export const STREAK_BONUS = {
  7: 50,
  30: 200,
  100: 500,
  365: 2000,
} as const

export const RATE_LIMITS = {
  run: { points: 10, duration: 60 },
  submit: { points: 5, duration: 60 },
  auth: { points: 5, duration: 300 },
} as const

export const FREE_TIER_LIMITS = {
  dailySubmissions: 20,
  dailyRuns: 50,
} as const

export const JUDGE_DEFAULTS = {
  timeoutMs: 5000,
  memoryLimitMb: 128,
  maxOutputSize: 1024 * 1024,
} as const

export const PROBLEM_TAGS = [
  'arrays',
  'strings',
  'tables',
  'math',
  'sorting',
  'searching',
  'recursion',
  'dynamic-programming',
  'greedy',
  'graphs',
  'trees',
  'signals',
  'state-machines',
  'cooldowns',
  'inventory',
  'matchmaking',
  'vectors',
  'cframe',
  'networking',
  'ui-logic',
  'optimization',
  'simulation',
] as const

export const TRACKS = [
  { slug: 'gameplay', name: 'Gameplay Systems', icon: '🎮' },
  { slug: 'ui', name: 'UI & UX Patterns', icon: '🖥️' },
  { slug: 'data', name: 'Data Structures', icon: '📊' },
  { slug: 'architecture', name: 'Architecture', icon: '🏗️' },
] as const

export const BADGES = [
  { id: 'first-solve', name: 'First Blood', description: 'Solve your first problem', rarity: 'common' },
  { id: 'streak-7', name: 'Week Warrior', description: '7 day streak', rarity: 'common' },
  { id: 'streak-30', name: 'Monthly Master', description: '30 day streak', rarity: 'rare' },
  { id: 'streak-100', name: 'Centurion', description: '100 day streak', rarity: 'epic' },
  { id: 'easy-10', name: 'Easy Does It', description: 'Solve 10 easy problems', rarity: 'common' },
  { id: 'medium-10', name: 'Getting Serious', description: 'Solve 10 medium problems', rarity: 'rare' },
  { id: 'hard-10', name: 'Hardcore Coder', description: 'Solve 10 hard problems', rarity: 'epic' },
  { id: 'all-easy', name: 'Easy Sweep', description: 'Solve all easy problems', rarity: 'rare' },
  { id: 'top-100', name: 'Elite', description: 'Reach top 100 on leaderboard', rarity: 'epic' },
  { id: 'top-10', name: 'Legend', description: 'Reach top 10 on leaderboard', rarity: 'legendary' },
  { id: 'pro', name: 'Pro Member', description: 'Subscribe to Pro', rarity: 'rare' },
  { id: 'studio-verified', name: 'Studio Verified', description: 'Verified studio employee', rarity: 'epic' },
] as const

export const ROBLOX_OAUTH = {
  authUrl: 'https://apis.roblox.com/oauth/v1/authorize',
  tokenUrl: 'https://apis.roblox.com/oauth/v1/token',
  userInfoUrl: 'https://apis.roblox.com/oauth/v1/userinfo',
  scopes: ['openid', 'profile'],
} as const

export const ROBLOX_API = {
  thumbnailUrl: 'https://thumbnails.roblox.com/v1/users/avatar-headshot',
} as const

