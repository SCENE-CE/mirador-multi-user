# Base image
FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application code (excluding what's defined in .dockerignore)
COPY . .

RUN rm -f ./src/config/config.ts
RUN cp ./src/config/config.sample.ts ./src/config/config.ts


# install serve to render index.html in ENV=PROD
RUN npm install --global serve

# Build the application if necessary
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN npm run build

# Change ownership (if necessary) and adjust permissions
RUN chown -R 1000:node /app && chmod -R 770 /app && find /app -type f -exec chmod 660 {} \;

# Use non-root user
USER node

EXPOSE 4000

# Command to run the application
ENTRYPOINT ["sh","/app/entrypoint.sh"]
