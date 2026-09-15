FROM oven/bun:1-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat nodejs

ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm?schema=public"

COPY package.json bun.lock turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN bun install --frozen-lockfile
RUN bun run --filter=@crm/db db:generate

FROM base AS api
RUN bun run --filter=api build
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
CMD ["bun", "apps/api/dist/main.js"]

FROM base AS app
RUN bun run --filter=app build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["bun", "run", "--filter=app", "start"]
