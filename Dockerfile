# =========================
# 1. Install Dependencies (Stage นี้ชื่อ deps)
# =========================
FROM node:20-alpine AS deps  
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# =========================
# 2. Build Next.js (Stage นี้เรียกใช้จาก deps)
# =========================
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# รับค่า ARG เพื่อใช้ตอน Build (สำคัญสำหรับ NEXT_PUBLIC_)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# ดึง node_modules มาจาก Stage ชื่อ "deps" ด้านบน
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PRIVATE_STANDALONE=true 
RUN pnpm build

# =========================
# 3. Production Image
# =========================
FROM node:20-alpine AS runner
WORKDIR /app
# ... (ส่วนที่เหลือเหมือนเดิม)