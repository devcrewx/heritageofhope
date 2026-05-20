FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/admin/package.json packages/admin/package.json

RUN npm ci --include-workspace-root

COPY packages/admin/ packages/admin/

ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

RUN npm run build --workspace=@heritageofhope/admin

FROM nginx:alpine
COPY packages/admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/packages/admin/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
