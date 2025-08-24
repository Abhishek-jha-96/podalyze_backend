# ========================
# Stage 1: Build
# ========================
FROM node:20-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

# =========================
# Stage 2: Builder (production only)
# =========================
FROM base as builder

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ========================
# Stage 3: Production
# ========================
FROM builder AS runner

# Copy only essential files
COPY package.json pnpm-lock.yaml ./

# Only install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built code and other required files
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]