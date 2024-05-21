# Base image
FROM node:20-alpine as builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application code (excluding what's defined in .dockerignore)
COPY . .

# Build the application if necessary
RUN npm run build

# Change ownership (if necessary) and adjust permissions
RUN chown -R node:node /app && chmod -R 755 /app

# Use non-root user
USER node

# Command to run the application
CMD ["npm", "run","dev"]
