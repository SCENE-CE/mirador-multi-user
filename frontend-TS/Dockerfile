# Base image
FROM node:16-alpine as builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application code (excluding what's defined in .dockerignore)
COPY . .

RUN chmod +x ./script.sh

RUN ls
# Use the script as the entrypoint
ENTRYPOINT ["sh","./entrypoint.sh"]

# Command to run the application
CMD ["npm", "run","dev"]
