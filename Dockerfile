# ========================
# Base
# ========================
FROM node:20-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

# ========================
# Dependencies
# ========================
FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ========================
# Development
# ========================
FROM deps AS development

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]

# ========================
# Builder
# ========================
FROM deps AS builder

COPY . .

RUN pnpm run build

# ========================
# Production
# ========================
FROM base AS production

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]