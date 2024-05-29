# Base image
FROM node:20-alpine as builder
WORKDIR /app

ARG BACKEND_URL
RUN echo ${BACKEND_URL}
ENV BACKEND_URL=${BACKEND_URL}
## Set environment variables to front end TS
#RUN echo $BACKEND_URL

# Install dependencies
COPY package*.json ./
RUN npm ci


# Copy application code (excluding what's defined in .dockerignore)
COPY . .

RUN rm -f ./src/config/config.ts
RUN cp ./src/config/config.sample.ts ./src/config/config.ts
RUN sed -i "s/SED_REPLACEMENT_BACKEND_URL/"$BACKEND_URL"/g" ./src/config/config.ts
RUN cat ./src/config/config.ts
# install serve to render index.html in ENV=PROD
RUN npm install --global serve

# Build the application if necessary
RUN npm run build

# Change ownership (if necessary) and adjust permissions
RUN chown -R 1000:node /app && chmod -R 770 /app && find /app -type f -exec chmod 660 {} \;

# Use non-root user
USER node

EXPOSE 4000

# Command to run the application
ENTRYPOINT ["sh","/app/entrypoint.sh"]
