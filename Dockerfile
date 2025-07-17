FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.12.4 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter frontend build

RUN pnpm --filter backend build

FROM node:24-alpine AS production

RUN corepack enable && corepack prepare pnpm@10.12.4 --activate

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder --chown=nodejs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/backend/src ./apps/backend/src
COPY --from=builder --chown=nodejs:nodejs /app/apps/frontend/dist ./apps/frontend/dist

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

CMD ["pnpm", "start"]