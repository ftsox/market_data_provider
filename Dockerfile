FROM node:latest AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN apt update
RUN apt install -y git
RUN yarn

# Copy app files
COPY . .
RUN chmod +x ./ftso_start.sh
