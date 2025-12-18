# AI Assistant Instructions for RoCode

This document is designed to help AI assistants (like Gemini, Claude, GPT-4, etc.) understand the RoCode project structure, current state, known issues, and how to provide effective instructions for development.

---

## Project Overview

**RoCode** is a full-stack web application - a "LeetCode for Roblox" platform where developers practice Luau scripting problems, compete on leaderboards, and facilitate hiring.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript, TailwindCSS, Monaco Editor
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Cache/Queue**: Redis (BullMQ planned but not fully implemented)
- **Runtime**: Lune (Luau runtime with Roblox types)
- **Auth**: Roblox OAuth 2.0 (not yet implemented)
- **Payments**: Stripe (not yet implemented)

### Architecture
- **Monorepo**: npm workspaces
- **Apps**:
  - `apps/web` - Next.js frontend
  - `apps/api` - Express API server
  - `apps/judge` - Judge worker (planned, not fully implemented)
- **Packages**:
  - `packages/shared` - Shared types and utilities
  - `packages/ui` - UI component library

---

## Current State

### ✅ Completed Features

1. **Monaco Editor Integration**
   - Luau language support with syntax highlighting
   - Roblox API autocomplete (services, types, methods)
   - Context-aware completions (GetService, Vector3, CFrame)
   - Dark theme matching Roblox Studio
   - Code snippets (function, for, if, etc.)
   - All Luau built-ins included (print, type, tonumber, etc.)

2. **Code Execution**
   - Lune runtime integration
   - Secure stdin-based input (no code injection)
   - Timeout handling
   - Error sanitization
   - Output capture

3. **Database & API**
   - 45 problems seeded
   - Daily challenge system
   - Admin dashboard
   - Health checks
   - Error tracking (Sentry)
   - Structured logging (Winston)
   - Request ID tracking
   - Input sanitization

4. **Frontend Pages**
   - Problems list with filters
   - Problem detail page with editor
   - Playground page
   - Daily challenge page
   - Admin dashboard
   - Terms & Privacy pages

### ⚠️ Partially Implemented

1. **Judge Worker**
   - Inline executor works for "Run" functionality
   - Full queue-based judge worker not implemented
   - "Submit" may not work correctly (needs testing)

2. **Authentication**
   - Roblox OAuth routes exist but not fully tested
   - Requires `ROBLOX_CLIENT_ID` and `ROBLOX_CLIENT_SECRET`
   - Session management exists but needs verification

3. **Payments**
   - Stripe integration skeleton exists
   - Requires `STRIPE_SECRET_KEY` and price IDs
   - Webhook handling not fully tested

4. **Leaderboards**
   - Schema exists
   - API routes exist
   - Frontend display may be incomplete

---

## Known Issues

### Critical Issues

1. **Judge Worker Not Fully Implemented**
   - **Location**: `apps/judge/` directory exists but worker not running
   - **Impact**: "Submit" functionality may not work correctly
   - **Fix Needed**: Implement BullMQ worker or use inline executor for submits too

2. **Playground Polling**
   - **Location**: `apps/web/src/app/playground/page.tsx`
   - **Issue**: Playground uses polling but endpoint may not exist
   - **Fix Needed**: Either implement queue-based execution or use inline executor

3. **Missing Error Handling**
   - Some API routes may not have proper error handling
   - Frontend may not handle all error cases gracefully

### Medium Priority Issues

1. **Autocomplete Descriptions**
   - **Status**: ✅ FIXED - Removed verbose descriptions
   - All completions now show only the label

2. **Missing Luau Built-ins**
   - **Status**: ✅ FIXED - Added all built-ins (print, type, tonumber, etc.)

3. **Theme Not Applying**
   - **Status**: ✅ FIXED - Theme now applies correctly

4. **GetService Autocomplete**
   - **Status**: ✅ FIXED - Context-aware completions work

### Low Priority Issues

1. **Code Duplication**
   - Some helper functions duplicated between executor and judge
   - Could be extracted to shared package

2. **Type Safety**
   - Some `any` types in API responses
   - Could be improved with proper TypeScript types

3. **Testing**
   - No unit tests
   - No integration tests
   - Manual testing only

---

## Missing Features

### High Priority

1. **Full Judge Worker Implementation**
   - BullMQ queue setup
   - Worker process for submissions
   - Job status tracking
   - Result storage

2. **Roblox OAuth Integration**
   - Complete OAuth flow
   - Avatar fetching and caching
   - Session management
   - User profile pages

3. **Stripe Payment Flow**
   - Checkout session creation
   - Webhook handling
   - Subscription management
   - Plan gating

4. **Leaderboard Frontend**
   - Display rankings
   - Filter by time range
   - User profiles with stats

5. **Submission History**
   - View past submissions
   - Compare solutions
   - Share solutions

### Medium Priority

1. **Problem Editorials**
   - Content for all problems
   - Premium gating
   - Code examples

2. **Daily Challenge Streaks**
   - Track user streaks
   - Display on profile
   - Rewards/badges

3. **User Profiles**
   - Public profile pages
   - Stats display
   - Badge showcase
   - Activity feed

4. **Search & Filters**
   - Better problem search
   - Tag filtering
   - Difficulty filtering
   - Status filtering (solved/unsolved)

5. **Code Sharing**
   - Share snippets
   - Embed code
   - Social features

### Low Priority

1. **Contests**
   - Timed competitions
   - Leaderboards
   - Prizes

2. **Discussions**
   - Problem discussions
   - Solution reviews
   - Q&A

3. **Job Board**
   - Post jobs
   - Apply with profile
   - Studio integration

4. **Analytics**
   - User analytics
   - Problem analytics
   - Performance metrics

---

## Suggested Additions

### Immediate Improvements

1. **Better Error Messages**
   - More descriptive error messages in executor
   - Line number hints for syntax errors
   - Runtime error explanations

2. **Code Formatting**
   - Auto-format on save
   - Format button in editor
   - Consistent style guide

3. **Keyboard Shortcuts**
   - Run: `Ctrl+Enter` or `Cmd+Enter`
   - Submit: `Ctrl+Shift+Enter` or `Cmd+Shift+Enter`
   - Format: `Shift+Alt+F`

4. **Editor Features**
   - Code folding
   - Multi-cursor editing
   - Find and replace
   - Go to line

5. **Test Case Management**
   - Add custom test cases in playground
   - View all test cases for problems
   - Test case explanations

### User Experience

1. **Onboarding**
   - Welcome tour
   - First problem tutorial
   - Tips and tricks

2. **Progress Tracking**
   - Visual progress indicators
   - Completion percentages
   - Achievement badges

3. **Social Features**
   - Follow users
   - Activity feed
   - Solution sharing

4. **Mobile Support**
   - Responsive design improvements
   - Mobile editor (if feasible)
   - Touch-friendly UI

### Technical Improvements

1. **Performance**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies

2. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Color contrast

3. **Internationalization**
   - Multi-language support
   - Localized content
   - RTL support

4. **Monitoring**
   - Performance monitoring
   - User analytics
   - Error tracking improvements
   - Uptime monitoring

---

## How to Give Instructions to AI Assistants

### Effective Instruction Format

When asking an AI assistant to work on RoCode, use this format:

```
**Context**: [Brief description of what you want to do]

**Task**: [Specific task or feature]

**Files to Modify**:
- [List of files that need changes]

**Requirements**:
- [Specific requirements or constraints]

**Testing**:
- [How to test the changes]

**Notes**:
- [Any additional context or considerations]
```

### Example Instructions

**Good Instruction**:
```
**Context**: Users are complaining that the editor is white instead of dark.

**Task**: Fix Monaco Editor theme not applying

**Files to Modify**:
- apps/web/src/lib/monaco/setup-monaco.ts
- apps/web/src/app/problems/[slug]/page.tsx
- apps/web/src/app/playground/page.tsx

**Requirements**:
- Theme must be defined before editor initialization
- Theme should be explicitly set in onMount callback
- Should work on both problem and playground pages

**Testing**:
- Open any problem page
- Editor should have dark background (#1E1E1E)
- Syntax highlighting should be visible

**Notes**:
- Theme is defined in roblox-theme.ts
- beforeMount callback receives Monaco instance
```

**Bad Instruction**:
```
Make the editor dark
```

### Common Patterns

1. **Adding a New Feature**
   - Describe the feature clearly
   - List all files that need changes
   - Specify API endpoints if needed
   - Include database schema changes
   - Provide example usage

2. **Fixing a Bug**
   - Describe the bug clearly
   - Include steps to reproduce
   - Specify expected vs actual behavior
   - List files likely involved
   - Include error messages if any

3. **Refactoring**
   - Explain what needs refactoring
   - List files to modify
   - Specify patterns to follow
   - Include before/after examples

4. **Adding Dependencies**
   - Explain why the dependency is needed
   - Specify which package to add
   - List files that will use it
   - Include any configuration needed

---

## File Structure Reference

### Key Files

**Monaco Editor**:
- `apps/web/src/lib/monaco/luau-language.ts` - Language definition
- `apps/web/src/lib/monaco/roblox-completions.ts` - Autocomplete
- `apps/web/src/lib/monaco/roblox-theme.ts` - Theme
- `apps/web/src/lib/monaco/setup-monaco.ts` - Setup function

**Code Execution**:
- `apps/api/src/lib/executor.ts` - Inline executor (Lune)
- `apps/judge/src/executor.ts` - Judge executor (planned)

**Database**:
- `apps/api/src/db/schema.ts` - Drizzle schema
- `apps/api/src/db/seed.ts` - Seed data

**API Routes**:
- `apps/api/src/routes/problems.ts` - Problem endpoints
- `apps/api/src/routes/auth.ts` - Auth endpoints
- `apps/api/src/routes/daily.ts` - Daily challenge
- `apps/api/src/routes/admin.ts` - Admin endpoints

**Frontend Pages**:
- `apps/web/src/app/problems/[slug]/page.tsx` - Problem detail
- `apps/web/src/app/playground/page.tsx` - Playground
- `apps/web/src/app/daily/page.tsx` - Daily challenge

**API Client**:
- `apps/web/src/lib/api.ts` - Frontend API client

---

## Development Workflow

### Making Changes

1. **Understand the Context**
   - Read relevant files
   - Understand the architecture
   - Check for similar implementations

2. **Make Changes**
   - Follow existing patterns
   - Maintain type safety
   - Add error handling
   - Update related files

3. **Test**
   - Test manually
   - Check for lint errors
   - Verify functionality
   - Test edge cases

4. **Document**
   - Update this file if needed
   - Add comments for complex logic
   - Update CHANGES_DOCUMENTATION.md

### Code Style

- **TypeScript**: Strict mode, no `any` where possible
- **React**: Functional components, hooks
- **Naming**: camelCase for variables, PascalCase for components
- **Formatting**: Prettier (if configured)
- **Comments**: Explain why, not what

---

## Environment Setup

### Required
- Node.js 20+
- npm (workspaces)
- Docker & Docker Compose
- PostgreSQL
- Redis
- Lune binary (`~/bin/lune` or in PATH)

### Optional
- Roblox OAuth credentials
- Stripe account
- Sentry DSN
- Email SMTP settings

### Running Locally

```bash
# Start infrastructure
docker-compose up -d

# Install dependencies
npm install

# Run migrations
cd apps/api && npm run db:migrate && npm run db:seed

# Start dev servers
npm run dev:api  # API on :4000
npm run dev:web  # Web on :3000
```

---

## Troubleshooting

### Common Issues

1. **Editor is White**
   - Check theme is defined before editor init
   - Verify `monaco.editor.setTheme()` is called
   - Check `beforeMount` callback

2. **Autocomplete Not Working**
   - Verify `setupMonacoEditor()` is called
   - Check trigger characters
   - Verify completion provider is registered

3. **Code Execution Fails**
   - Check Lune is installed
   - Verify `lunePath` is correct
   - Check stdin handling
   - Review error messages

4. **Database Errors**
   - Verify migrations are run
   - Check `DATABASE_URL` is set
   - Verify connection string format

5. **Build Errors**
   - Check TypeScript errors
   - Verify all dependencies installed
   - Check for missing imports

---

## Next Steps for AI Assistants

When working on RoCode, prioritize:

1. **Fix Known Issues** (see above)
2. **Complete Partial Implementations** (judge worker, OAuth, payments)
3. **Add Missing Features** (see Missing Features section)
4. **Improve User Experience** (see Suggested Additions)
5. **Add Tests** (unit, integration, e2e)

### When in Doubt

- Check `CHANGES_DOCUMENTATION.md` for recent changes
- Review similar implementations in the codebase
- Follow existing patterns and conventions
- Ask for clarification if requirements are unclear
- Test thoroughly before marking as complete

---

## Contact & Resources

- **Project**: RoCode - Roblox LeetCode for Luau
- **Architecture**: Monorepo with npm workspaces
- **Runtime**: Lune (Luau with Roblox types)
- **Editor**: Monaco Editor with custom Luau support

---

**Last Updated**: Current session
**Version**: MVP + Monaco Editor + Lune Runtime + Security Fixes

