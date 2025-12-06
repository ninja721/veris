# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npx tsc

# Production stage  
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy package and install prod deps
COPY package.json ./
RUN npm install --omit=dev

# Copy built JS files
COPY --from=builder /app/dist ./dist

# Copy public folder INSIDE dist (so ../public from dist/server.js works)
COPY public ./dist/public

EXPOSE 8080
CMD ["node", "dist/server.js"]
