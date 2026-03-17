# -------------------------
# 1. Install dependencies
# -------------------------
FROM node:20-slim AS deps
WORKDIR /app


COPY package.json package-lock.json* ./

# Lebih stabil + cepat
RUN npm config set registry https://registry.npmmirror.com \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm ci --no-audit --progress=false


# -------------------------
# 2. Build app
# -------------------------
FROM node:20-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args (dari GitHub Actions nanti)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DISABLE_CSRF

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_DISABLE_CSRF=$NEXT_PUBLIC_DISABLE_CSRF

RUN npm run build


# -------------------------
# 3. Production image
# -------------------------
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy hasil build (Next.js standalone)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Security (recommended)
RUN groupadd -r nodejs && useradd -r -g nodejs nextjs \
 && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]