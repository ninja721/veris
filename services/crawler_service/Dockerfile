# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src
COPY public ./public

# Build TypeScript
RUN npm run build || npx tsc

# Copy public folder to dist
RUN cp -r public dist/public

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install production dependencies only
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port (Cloud Run uses PORT env var, defaults to 8080)
EXPOSE 8080

# Set default PORT for Cloud Run
ENV PORT=8080

# Start server
CMD ["node", "dist/server.js"]
