FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]