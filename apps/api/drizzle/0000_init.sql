CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "roblox_user_id" varchar(32) NOT NULL UNIQUE,
    "username" varchar(64) NOT NULL UNIQUE,
    "display_name" varchar(64),
    "avatar_url" text,
    "avatar_fetched_at" timestamp,
    "plan_tier" varchar(16) NOT NULL DEFAULT 'free',
    "stripe_customer_id" varchar(64),
    "stripe_subscription_id" varchar(64),
    "current_streak" integer NOT NULL DEFAULT 0,
    "max_streak" integer NOT NULL DEFAULT 0,
    "last_solve_date" timestamp,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "sessions" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "token_hash" varchar(128) NOT NULL UNIQUE,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "problems" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "slug" varchar(128) NOT NULL UNIQUE,
    "title" varchar(256) NOT NULL,
    "difficulty" varchar(16) NOT NULL,
    "tags" jsonb NOT NULL DEFAULT '[]',
    "statement_md" text NOT NULL,
    "template" text NOT NULL,
    "constraints" text NOT NULL,
    "editorial" text,
    "is_premium" boolean NOT NULL DEFAULT false,
    "is_studio_only" boolean NOT NULL DEFAULT false,
    "published_at" timestamp,
    "submission_count" integer NOT NULL DEFAULT 0,
    "accepted_count" integer NOT NULL DEFAULT 0,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "tests" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "problem_id" uuid NOT NULL REFERENCES "problems"("id") ON DELETE CASCADE,
    "visibility" varchar(16) NOT NULL DEFAULT 'hidden',
    "input" text NOT NULL,
    "expected_output" text NOT NULL,
    "time_limit" integer NOT NULL DEFAULT 5000,
    "memory_limit" integer NOT NULL DEFAULT 128,
    "order_index" integer NOT NULL DEFAULT 0,
    "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "submissions" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "problem_id" uuid NOT NULL REFERENCES "problems"("id") ON DELETE CASCADE,
    "code" text NOT NULL,
    "status" varchar(32) NOT NULL DEFAULT 'pending',
    "runtime_ms" integer,
    "memory_kb" integer,
    "output" text,
    "error_message" text,
    "test_results" jsonb,
    "mode" varchar(16) NOT NULL DEFAULT 'practice',
    "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "user_solves" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "problem_id" uuid NOT NULL REFERENCES "problems"("id") ON DELETE CASCADE,
    "first_solved_at" timestamp NOT NULL DEFAULT now(),
    UNIQUE("user_id", "problem_id")
);

CREATE TABLE IF NOT EXISTS "leaderboard_snapshots" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "range" varchar(16) NOT NULL,
    "computed_at" timestamp NOT NULL DEFAULT now(),
    "entries" jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS "organizations" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "name" varchar(256) NOT NULL,
    "owner_id" uuid NOT NULL REFERENCES "users"("id"),
    "stripe_customer_id" varchar(64),
    "stripe_subscription_id" varchar(64),
    "seat_count" integer NOT NULL DEFAULT 5,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "org_members" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "role" varchar(16) NOT NULL DEFAULT 'member',
    "created_at" timestamp NOT NULL DEFAULT now(),
    UNIQUE("org_id", "user_id")
);

CREATE TABLE IF NOT EXISTS "assessments" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "name" varchar(256) NOT NULL,
    "description" text,
    "time_limit" integer,
    "settings" jsonb NOT NULL DEFAULT '{"shuffleProblems": false, "showEditorial": false, "allowRun": true, "maxAttempts": null}',
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "assessment_problems" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "assessment_id" uuid NOT NULL REFERENCES "assessments"("id") ON DELETE CASCADE,
    "problem_id" uuid NOT NULL REFERENCES "problems"("id") ON DELETE CASCADE,
    "order_index" integer NOT NULL DEFAULT 0,
    UNIQUE("assessment_id", "problem_id")
);

CREATE TABLE IF NOT EXISTS "assessment_invites" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "assessment_id" uuid NOT NULL REFERENCES "assessments"("id") ON DELETE CASCADE,
    "token" varchar(64) NOT NULL UNIQUE,
    "email" varchar(256),
    "expires_at" timestamp NOT NULL,
    "used_at" timestamp,
    "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "assessment_attempts" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "invite_id" uuid NOT NULL REFERENCES "assessment_invites"("id") ON DELETE CASCADE,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "started_at" timestamp NOT NULL DEFAULT now(),
    "submitted_at" timestamp,
    "score" decimal(5, 2),
    "report" jsonb
);

CREATE TABLE IF NOT EXISTS "tracks" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "slug" varchar(64) NOT NULL UNIQUE,
    "name" varchar(128) NOT NULL,
    "description" text,
    "icon_url" text,
    "order_index" integer NOT NULL DEFAULT 0,
    "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "track_problems" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "track_id" uuid NOT NULL REFERENCES "tracks"("id") ON DELETE CASCADE,
    "problem_id" uuid NOT NULL REFERENCES "problems"("id") ON DELETE CASCADE,
    "order_index" integer NOT NULL DEFAULT 0,
    UNIQUE("track_id", "problem_id")
);

CREATE TABLE IF NOT EXISTS "badges" (
    "id" varchar(64) PRIMARY KEY,
    "name" varchar(128) NOT NULL,
    "description" text NOT NULL,
    "icon_url" text,
    "rarity" varchar(16) NOT NULL DEFAULT 'common',
    "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "user_badges" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "badge_id" varchar(64) NOT NULL REFERENCES "badges"("id") ON DELETE CASCADE,
    "earned_at" timestamp NOT NULL DEFAULT now(),
    UNIQUE("user_id", "badge_id")
);

CREATE TABLE IF NOT EXISTS "snippets" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
    "code" text NOT NULL,
    "title" varchar(256),
    "created_at" timestamp NOT NULL DEFAULT now(),
    "expires_at" timestamp
);

CREATE TABLE IF NOT EXISTS "daily_challenges" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "date" varchar(10) NOT NULL UNIQUE,
    "problem_id" uuid NOT NULL REFERENCES "problems"("id"),
    "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "plagiarism_flags" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "submission_id" uuid NOT NULL REFERENCES "submissions"("id") ON DELETE CASCADE,
    "matched_submission_id" uuid NOT NULL REFERENCES "submissions"("id") ON DELETE CASCADE,
    "score" decimal(5, 4) NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "sessions_user_id_idx" ON "sessions"("user_id");
CREATE INDEX IF NOT EXISTS "problems_difficulty_idx" ON "problems"("difficulty");
CREATE INDEX IF NOT EXISTS "problems_published_at_idx" ON "problems"("published_at");
CREATE INDEX IF NOT EXISTS "tests_problem_id_idx" ON "tests"("problem_id");
CREATE INDEX IF NOT EXISTS "submissions_user_id_idx" ON "submissions"("user_id");
CREATE INDEX IF NOT EXISTS "submissions_problem_id_idx" ON "submissions"("problem_id");
CREATE INDEX IF NOT EXISTS "submissions_status_idx" ON "submissions"("status");
CREATE INDEX IF NOT EXISTS "submissions_created_at_idx" ON "submissions"("created_at");
CREATE INDEX IF NOT EXISTS "leaderboard_snapshots_range_idx" ON "leaderboard_snapshots"("range");
CREATE INDEX IF NOT EXISTS "assessments_org_id_idx" ON "assessments"("org_id");
CREATE INDEX IF NOT EXISTS "assessment_attempts_invite_id_idx" ON "assessment_attempts"("invite_id");
CREATE INDEX IF NOT EXISTS "assessment_attempts_user_id_idx" ON "assessment_attempts"("user_id");
CREATE INDEX IF NOT EXISTS "plagiarism_flags_submission_id_idx" ON "plagiarism_flags"("submission_id");

