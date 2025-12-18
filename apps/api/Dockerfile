FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
RUN pnpm --filter @rocode/shared build
RUN pnpm --filter @rocode/api build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 rocode

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/drizzle ./drizzle
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./node_modules/@rocode/shared/dist

USER rocode

EXPOSE 4000
ENV PORT=4000

CMD ["node", "dist/index.js"]

