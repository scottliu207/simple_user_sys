# Stage 1: Install dependencies
FROM node:20-alpine3.16 AS deps

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Stage 2: Build the application
FROM node:20-alpine3.16 AS builder

WORKDIR /app

# Copy the application code
COPY . .

# Copy node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# COPY --from=deps /app/.env ./.env

# Build the application
RUN npm run build

# Stage 3: Final image
FROM node:20-alpine3.16 AS runner

# Set working directory and environment
WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules and built files from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Run the application as the non-root user 'node'
USER node

# Expose the port on which the application runs
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/app.js"]
