# syntax=docker/dockerfile:1
# Image produksi frontend (Next.js standalone). Dibangun dari be/deploy/docker-compose.yml.

FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Dibaca next.config.ts (images.remotePatterns) & saat prerender halaman ISR, jadi wajib ada saat build.
ARG BACKEND_API_URL
ARG BACKEND_STORAGE_URL
ENV BACKEND_API_URL=$BACKEND_API_URL \
    BACKEND_STORAGE_URL=$BACKEND_STORAGE_URL \
    NEXT_TELEMETRY_DISABLED=1
# Token lewat build secret supaya tidak tersimpan di layer image.
RUN --mount=type=secret,id=backend_api_token,env=BACKEND_API_TOKEN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
