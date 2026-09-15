FROM oven/bun:1-alpine AS base
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat nodejs

ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm?schema=public"
ENV BETTER_AUTH_SECRET="build-dummy-secret-32-chars-long-base64="
ENV ALLOWED_SIGN_IN="example.com"

COPY package.json bun.lock turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN bun install --frozen-lockfile
RUN bun run --filter=@crm/db db:generate
RUN bun run --filter=app build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "--filter=app", "start"]
