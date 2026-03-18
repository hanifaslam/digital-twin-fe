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
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_DISABLE_CSRF
ENV NEXT_PUBLIC_DISABLE_CSRF=$NEXT_PUBLIC_DISABLE_CSRF

RUN npm run build


# -------------------------
# 3. Production image
# -------------------------
FROM node:20-slim AS runner
WORKDIR /app

# Install dependencies for health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y wget

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Security (recommended)
RUN groupadd -r nodejs && useradd -r -g nodejs nextjs

# Copy all files from builder stage (required for next start)
COPY --from=builder /app ./
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Use standard next start command
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]