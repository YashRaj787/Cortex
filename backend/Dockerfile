# Use the official Node.js 20 LTS image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 3000

# Start the backend
CMD ["node", "server.js"]
