# =========================
# 1. Install Dependencies
# =========================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
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

# ปรับให้ Build แบบ Standalone (ต้องตั้งค่าใน next.config.js ด้วย)
ENV NEXT_PRIVATE_STANDALONE=true 
RUN pnpm build

# =========================
# 3. Production Image (Ultra Light)
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# ห้ามลืม! ต้องตั้งค่านี้เพื่อให้ Frontend รู้ว่าจะคุยกับ API ไหนตอน Runtime (ถ้าใช้ Client-side fetch)
# ENV NEXT_PUBLIC_API_URL=https://api.event-seat.elitefund.fun/api

# สร้าง User ใหม่เพื่อความปลอดภัย (ไม่รันด้วย root)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ก๊อปปี้เฉพาะไฟล์ที่จำเป็นจาก standalone mode
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# รันด้วย node โดยตรง (เร็วกว่าและเบากว่า pnpm start ใน production)
CMD ["node", "server.js"]