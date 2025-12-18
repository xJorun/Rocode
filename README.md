# RoCode - Roblox LeetCode for Luau

A production-quality platform where Roblox scripters practice Luau problems, compete on leaderboards, and get hired.

## Features

- **Roblox OAuth 2.0** - Sign in with your Roblox account
- **Problem Bank** - 40+ problems across Easy, Medium, and Hard difficulties
- **Real Luau Execution** - Secure sandboxed environment with Roblox-like APIs
- **Leaderboards** - Weekly, monthly, and all-time rankings
- **Studio Portal** - Create assessments and hire developers
- **Pro Subscription** - Unlimited access, analytics, and interview prep

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TailwindCSS, Monaco Editor
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Cache/Queue**: Redis with BullMQ
- **Auth**: Roblox OAuth 2.0 + PKCE
- **Payments**: Stripe

## Project Structure

```
rocode/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Express API server
│   └── judge/        # Luau execution worker
├── packages/
│   ├── shared/       # Shared types, schemas, constants
│   └── ui/           # UI component library
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker and Docker Compose
- Roblox Developer Account (for OAuth credentials)
- Stripe Account (for payments)

### Development Setup

1. **Clone and install dependencies**

```bash
git clone https://github.com/your-org/rocode.git
cd rocode
pnpm install
```

2. **Start infrastructure**

```bash
docker-compose -f docker-compose.dev.yml up -d
```

3. **Configure environment**

```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Run database migrations**

```bash
pnpm db:migrate
pnpm db:seed
```

5. **Start development servers**

```bash
pnpm dev
```

This starts:
- Web: http://localhost:3000
- API: http://localhost:4000

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `ROBLOX_CLIENT_ID` | Roblox OAuth client ID |
| `ROBLOX_CLIENT_SECRET` | Roblox OAuth client secret |
| `ROBLOX_REDIRECT_URI` | OAuth callback URL |
| `SESSION_SECRET` | Session encryption key (min 32 chars) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Stripe price ID for Pro monthly |
| `STRIPE_PRO_YEARLY_PRICE_ID` | Stripe price ID for Pro yearly |

## API Routes

### Auth
- `GET /auth/roblox/start` - Initiate OAuth flow
- `GET /auth/roblox/callback` - OAuth callback
- `POST /auth/logout` - Logout
- `GET /me` - Get current user

### Problems
- `GET /problems` - List problems (with filters)
- `GET /problems/:slug` - Get problem details
- `POST /problems/:slug/run` - Run code
- `POST /problems/:slug/submit` - Submit solution

### Submissions
- `GET /submissions/:id` - Get submission details
- `GET /problems/:slug/submissions` - List submissions

### Leaderboard
- `GET /leaderboard/global` - Global rankings

### Billing
- `GET /billing/plans` - Available plans
- `POST /billing/checkout` - Create checkout session
- `GET /billing/status` - Subscription status

### Studio
- `POST /studio/orgs` - Create organization
- `POST /studio/orgs/:id/assessments` - Create assessment
- `POST /studio/assessments/:id/invite` - Create invite links
- `GET /studio/candidates/:id/report` - Candidate report

## Judge System

The judge executes untrusted Luau code in a secure sandbox:

- **Isolation**: Separate process per job
- **Time Limits**: Configurable per problem (default 5s)
- **Memory Limits**: Configurable per problem (default 128MB)
- **No Network**: Code cannot make external requests
- **Simulated APIs**: Vector3, CFrame, Signal, Instance stubs

### Supported APIs

```lua
-- Vector3
local v = Vector3.new(1, 2, 3)
v.Magnitude, v.X, v.Y, v.Z
v + v, v - v, v * 2, v / 2
v:Dot(other), v:Cross(other), v:Lerp(other, alpha)

-- CFrame
local cf = CFrame.new(0, 0, 0)
cf.Position, cf.LookVector, cf.RightVector, cf.UpVector
cf:Inverse(), cf:Lerp(other, alpha)

-- Signal
local signal = Signal.new()
signal:Connect(callback)
signal:Fire(...)
signal:Once(callback)
connection:Disconnect()

-- Utilities
wait(seconds), task.wait(seconds)
math.clamp(value, min, max)
table.find(t, value), table.clone(t)
string.split(str, sep)
```

## Deployment

### Docker Production

```bash
docker-compose up -d --build
```

### Manual Deployment

1. Build all packages:
```bash
pnpm build
```

2. Run migrations:
```bash
pnpm db:migrate
```

3. Start services:
```bash
# API
cd apps/api && node dist/index.js

# Judge Worker
cd apps/judge && node dist/index.js

# Web (or deploy to Vercel)
cd apps/web && npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

