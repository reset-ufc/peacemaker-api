# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.18.1

# Base stage with shared configurations
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app
RUN corepack enable pnpm

# Development dependencies stage
FROM base AS deps

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Build stage
FROM deps AS builder

COPY . .
ARG NODE_ENV=production
ARG NEST_API_PORT
ARG NEST_API_SERVER_URL
ARG JWT_SECRET
ARG JWT_EXPIRATION_TIME_SECONDS
ARG GITHUB_APP_ID
ARG GITHUB_APP_INSTALLATION
ARG GITHUB_OAUTH_CLIENT_ID
ARG GITHUB_OAUTH_CLIENT_SECRET
ARG GITHUB_OAUTH_CALLBACK_URL
ARG GITHUB_OAUTH_SCOPE
ARG GITHUB_OATH_PRIVATE_KEY_PATH
ARG MONGODB_URI
ARG PERSPECTIVE_API_SECRET
ARG PERSPECTIVE_API_URL
ARG GROQ_API_KEY

ENV NODE_ENV=${NODE_ENV} \
    NEST_API_PORT=${NEST_API_PORT} \
    NEST_API_SERVER_URL=${NEST_API_SERVER_URL} \
    JWT_SECRET=${JWT_SECRET} \
    JWT_EXPIRATION_TIME_SECONDS=${JWT_EXPIRATION_TIME_SECONDS} \
    GITHUB_APP_ID=${GITHUB_APP_ID} \
    GITHUB_APP_INSTALLATION=${GITHUB_APP_INSTALLATION} \
    GITHUB_OAUTH_CLIENT_ID=${GITHUB_OAUTH_CLIENT_ID} \
    GITHUB_OAUTH_CLIENT_SECRET=${GITHUB_OAUTH_CLIENT_SECRET} \
    GITHUB_OAUTH_CALLBACK_URL=${GITHUB_OAUTH_CALLBACK_URL} \
    GITHUB_OAUTH_SCOPE=${GITHUB_OAUTH_SCOPE} \
    GITHUB_OATH_PRIVATE_KEY_PATH=${GITHUB_OATH_PRIVATE_KEY_PATH} \
    MONGODB_URI=${MONGODB_URI} \
    PERSPECTIVE_API_SECRET=${PERSPECTIVE_API_SECRET} \
    PERSPECTIVE_API_URL=${PERSPECTIVE_API_URL} \
    GROQ_API_KEY=${GROQ_API_KEY}

RUN pnpm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

EXPOSE $NEST_API_PORT
CMD [ "pnpm", "run", "start:prod" ]
