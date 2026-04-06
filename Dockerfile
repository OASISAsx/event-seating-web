FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
ARG NEXT_PUBLIC_API_URL=https://api.event-seat.elitefund.fun/api
ARG NEXT_PUBLIC_API_URL_SOCKET=https://api.event-seat.elitefund.fun
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL_SOCKET=$NEXT_PUBLIC_API_URL_SOCKET
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_PRIVATE_STANDALONE=true
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
