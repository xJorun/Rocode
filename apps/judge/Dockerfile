FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

RUN apk add --no-cache curl

ARG LUAU_VERSION=0.606
RUN curl -L "https://github.com/Roblox/luau/releases/download/${LUAU_VERSION}/luau-ubuntu.zip" -o /tmp/luau.zip \
    && unzip /tmp/luau.zip -d /usr/local/bin \
    && chmod +x /usr/local/bin/luau* \
    && rm /tmp/luau.zip

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/judge/package.json ./apps/judge/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/apps/judge/node_modules ./apps/judge/node_modules
COPY . .
RUN pnpm --filter @rocode/shared build
RUN pnpm --filter @rocode/judge build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 rocode

RUN mkdir -p /tmp/rocode-sandbox && chown rocode:nodejs /tmp/rocode-sandbox

COPY --from=builder /app/apps/judge/dist ./dist
COPY --from=builder /app/apps/judge/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./node_modules/@rocode/shared/dist

USER rocode

CMD ["node", "dist/index.js"]

