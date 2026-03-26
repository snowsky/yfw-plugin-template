FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from the standalone directory
COPY ui/standalone/package.json ui/standalone/package-lock.json* ./

RUN npm ci

# Copy the full ui/ tree so @shared alias resolves correctly
COPY ui/ ./ui/

# Build — Vite resolves @shared → /app/ui/shared
WORKDIR /app/ui/standalone
RUN npm run build

# ── Production image ──────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/ui/standalone/dist /usr/share/nginx/html
COPY ui/standalone/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
