# ========================
# Stage 1: Build
# ========================
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ========================
# Stage 2: Production
# ========================
FROM node:20-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

# Copy only essential files
COPY package.json pnpm-lock.yaml ./

# Only install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built code and other required files
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]