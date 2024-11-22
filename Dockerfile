FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Create and configure uploads directory
RUN mkdir -p /usr/share/nginx/html/uploads && \
    chown -R nginx:nginx /usr/share/nginx/html/uploads && \
    chmod 755 /usr/share/nginx/html/uploads

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]