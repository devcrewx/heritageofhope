FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/api/package.json packages/api/package.json

RUN npm ci --include-workspace-root

COPY packages/api/ packages/api/
COPY packages/api/prisma packages/api/prisma

RUN npx prisma generate --schema packages/api/prisma/schema.prisma

FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache curl

COPY --from=builder /app .

EXPOSE 4010
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD curl -f http://localhost:4010/api/health || exit 1

CMD ["node", "packages/api/src/index.js"]
