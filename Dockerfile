# Build stage
FROM node:22.21.1-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Set build-time environment variable
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build
# Production stage
FROM node:22.21.1-alpine
WORKDIR /app
COPY --from=builder /app/dist build/
COPY package.json .
RUN npm install -g serve
EXPOSE 3011
ENV NODE_ENV=production
CMD ["serve", "-s", "build", "-l", "3011"]


