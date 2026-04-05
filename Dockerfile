# ... (Stage 1: deps เหมือนเดิม) ...

# =========================
# 2. Build Next.js
# =========================
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- ย้ายมาไว้ตรงนี้ (ก่อน RUN pnpm build) ---
ARG NEXT_PUBLIC_API_URL=https://api.event-seat.elitefund.fun/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# ----------------------------------------

ENV NEXT_PRIVATE_STANDALONE=true 
RUN pnpm build

# =========================
# 3. Production Image
# =========================
# ... (ส่วนที่เหลือเหมือนเดิม) ...