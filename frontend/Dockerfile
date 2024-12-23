# Base image
FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Define build arguments
ARG VITE_CADDY_URL
ARG VITE_BACKEND_URL
ARG INSTANCE_SHORT_NAME
ARG INSTANCE_NAME

# Echo the build arguments and set environment variables in the same step
RUN echo "VITE_BACKEND_URL: $VITE_BACKEND_URL" && \
    echo "VITE_CADDY_URL: $VITE_CADDY_URL" && \
    echo "INSTANCE_SHORT_NAME: $INSTANCE_SHORT_NAME" && \
    echo "INSTANCE_NAME: $INSTANCE_NAME" && \
    export VITE_BACKEND_URL=$VITE_BACKEND_URL && \
    export VITE_CADDY_URL=$VITE_CADDY_URL && \
    export INSTANCE_SHORT_NAME=$INSTANCE_SHORT_NAME && \
    export INSTANCE_NAME=$INSTANCE_NAME

# Set the environment variables for future steps
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_CADDY_URL=$VITE_CADDY_URL
ENV INSTANCE_SHORT_NAME=$INSTANCE_SHORT_NAME
ENV INSTANCE_NAME=$INSTANCE_NAME

# Copy application code (excluding what's defined in .dockerignore)
COPY . .

# Install serve to render index.html in ENV=PROD
RUN npm install --global serve

# Build the application
RUN npm run build

EXPOSE 4000

# Command to run the application
ENTRYPOINT ["sh","/app/entrypoint.sh"]
