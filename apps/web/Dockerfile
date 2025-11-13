# Multi-stage Dockerfile for Next.js Web

# Stage 1: Dependencies
FROM node:20-alpine AS deps

# Install pnpm
RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Copy application files
COPY apps/web ./apps/web
COPY pnpm-workspace.yaml package.json ./

# Build packages
WORKDIR /app/packages/types
RUN pnpm build

# Build application
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN pnpm build

# Stage 3: Production
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/next.config.js ./apps/web/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

WORKDIR /app/apps/web

# Expose port
EXPOSE 3000

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Start application
CMD ["pnpm", "start"]
