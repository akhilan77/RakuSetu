FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm v9 (compatible with Node 20)
RUN npm install -g pnpm@9

# Copy all files (including workspace settings and packages)
COPY . .

# Install all dependencies
RUN pnpm install --ignore-scripts --frozen-lockfile

# Build shared package first, then backend
RUN pnpm --filter @raktsetu/shared build

# Generate Prisma Client
RUN pnpm --filter raktsetu-backend exec prisma generate

# Build backend
RUN pnpm --filter raktsetu-backend build

FROM node:20-alpine AS runner

WORKDIR /usr/src/app

RUN npm install -g pnpm@9

# Copy package configurations
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/
COPY packages/shared/package.json ./packages/shared/
COPY frontend/raktsetu-ui/package.json ./frontend/raktsetu-ui/

# Install only production dependencies
RUN pnpm install --prod --ignore-scripts --frozen-lockfile

# Copy built artifacts from builder stage
COPY --from=builder /usr/src/app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["pnpm", "--filter", "raktsetu-backend", "start"]
