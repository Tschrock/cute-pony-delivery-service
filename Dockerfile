# Use the official Node.js 10 image.
# https://hub.docker.com/_/node
FROM node:lts-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Make sure git/etc are installed for node-gyp
RUN apk --no-cache --virtual build-dependencies add git openssh python make g++

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
CMD [ "npm", "start" ]
