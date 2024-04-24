# Base image
FROM node:lts-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src

RUN npm install

# Copy remaining application code (ensure entrypoint.sh is executable)
COPY . .

# Build the application if necessary
RUN npm run build

# Set the entry point
ENTRYPOINT ["sh","/app/entrypoint.sh"]
