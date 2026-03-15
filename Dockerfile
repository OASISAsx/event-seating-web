# =========================
# 1. Install Dependencies
# =========================
FROM node:20-alpine AS deps

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


# =========================
# 2. Build Next.js
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build


# =========================
# 3. Production Image
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]