# Stage 1: deps (ต้องมี AS deps เพื่อให้ Stage อื่นเรียกใช้ได้)
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: builder
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# --- ส่วนสำคัญ: รับค่า URL มาฝังตอน Build ---
ARG NEXT_PUBLIC_API_URL=https://api.event-seat.elitefund.fun/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# ---------------------------------------

# แก้ Error บรรทัดที่ 9: ดึงจาก Stage "deps" ด้านบน
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PRIVATE_STANDALONE=true 
RUN pnpm build

# Stage 3: runner
FROM node:20-alpine AS runner
# ... (ก๊อปปี้ส่วนที่เหลือของคุณมาใส่ได้เลย)