-- RoCode Database Schema
-- Run with: psql -d rocode -f 0000_init.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roblox_user_id VARCHAR(32) NOT NULL UNIQUE,
    username VARCHAR(64) NOT NULL UNIQUE,
    display_name VARCHAR(64),
    avatar_url TEXT,
    avatar_fetched_at TIMESTAMP,
    plan_tier VARCHAR(16) NOT NULL DEFAULT 'free',
    stripe_customer_id VARCHAR(64),
    stripe_subscription_id VARCHAR(64),
    current_streak INTEGER NOT NULL DEFAULT 0,
    max_streak INTEGER NOT NULL DEFAULT 0,
    last_solve_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(128) NOT NULL UNIQUE,
    title VARCHAR(256) NOT NULL,
    difficulty VARCHAR(16) NOT NULL,
    tags JSONB NOT NULL DEFAULT '[]',
    statement_md TEXT NOT NULL,
    template TEXT NOT NULL,
    constraints TEXT NOT NULL,
    editorial TEXT,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    is_studio_only BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP,
    submission_count INTEGER NOT NULL DEFAULT 0,
    accepted_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    visibility VARCHAR(16) NOT NULL DEFAULT 'hidden',
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    time_limit INTEGER NOT NULL DEFAULT 5000,
    memory_limit INTEGER NOT NULL DEFAULT 128,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    runtime_ms INTEGER,
    memory_kb INTEGER,
    output TEXT,
    error_message TEXT,
    test_results JSONB,
    mode VARCHAR(16) NOT NULL DEFAULT 'practice',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_solves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    first_solved_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

CREATE TABLE leaderboard_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    range VARCHAR(16) NOT NULL,
    computed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    entries JSONB NOT NULL
);

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(256) NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id),
    stripe_customer_id VARCHAR(64),
    stripe_subscription_id VARCHAR(64),
    seat_count INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE org_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(16) NOT NULL DEFAULT 'member',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(org_id, user_id)
);

CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(256) NOT NULL,
    description TEXT,
    time_limit INTEGER,
    settings JSONB NOT NULL DEFAULT '{"shuffleProblems": false, "showEditorial": false, "allowRun": true, "maxAttempts": null}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE assessment_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    UNIQUE(assessment_id, problem_id)
);

CREATE TABLE assessment_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(256),
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invite_id UUID NOT NULL REFERENCES assessment_invites(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMP,
    score DECIMAL(5, 2),
    report JSONB
);

CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    icon_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE track_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    UNIQUE(track_id, problem_id)
);

CREATE TABLE badges (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    rarity VARCHAR(16) NOT NULL DEFAULT 'common',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id VARCHAR(64) NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

CREATE TABLE snippets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    code TEXT NOT NULL,
    title VARCHAR(256),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE TABLE daily_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date VARCHAR(10) NOT NULL UNIQUE,
    problem_id UUID NOT NULL REFERENCES problems(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE plagiarism_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    matched_submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    score DECIMAL(5, 4) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX sessions_user_id_idx ON sessions(user_id);
CREATE INDEX problems_difficulty_idx ON problems(difficulty);
CREATE INDEX problems_published_at_idx ON problems(published_at);
CREATE INDEX tests_problem_id_idx ON tests(problem_id);
CREATE INDEX submissions_user_id_idx ON submissions(user_id);
CREATE INDEX submissions_problem_id_idx ON submissions(problem_id);
CREATE INDEX submissions_status_idx ON submissions(status);
CREATE INDEX submissions_created_at_idx ON submissions(created_at);
CREATE INDEX leaderboard_snapshots_range_idx ON leaderboard_snapshots(range);
CREATE INDEX assessments_org_id_idx ON assessments(org_id);
CREATE INDEX assessment_attempts_invite_id_idx ON assessment_attempts(invite_id);
CREATE INDEX assessment_attempts_user_id_idx ON assessment_attempts(user_id);
CREATE INDEX plagiarism_flags_submission_id_idx ON plagiarism_flags(submission_id);

