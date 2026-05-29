FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Install nginx + supervisord untuk serve static files dan proxy Next.js
RUN apk add --no-cache nginx supervisor

ENV NODE_ENV=production
ENV HOSTNAME=127.0.0.1
ENV PORT=3001

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Nginx config: serve static dari filesystem, proxy dynamic ke Next.js
RUN mkdir -p /run/nginx && \
    printf 'server {\n\
    listen 3000;\n\
    location /_next/static/ {\n\
        alias /app/.next/static/;\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
    location /public/ {\n\
        alias /app/public/;\n\
    }\n\
    location / {\n\
        proxy_pass http://127.0.0.1:3001;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
    }\n\
}\n' > /etc/nginx/http.d/default.conf

# Supervisord config
RUN printf '[supervisord]\nnodaemon=true\n\n\
[program:nextjs]\ncommand=node /app/server.js\ndirectory=/app\nautostart=true\nautorestart=true\n\n\
[program:nginx]\ncommand=nginx -g "daemon off;"\nautostart=true\nautorestart=true\n' \
    > /etc/supervisord.conf

EXPOSE 3000
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
