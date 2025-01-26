# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev \
    libc6-compat

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and build
COPY . .
RUN npm run build

# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev \
    libc6-compat

# Install wait-on globally
RUN npm install -g wait-on

# Add wait-for script
ADD https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for /usr/local/bin/wait-for
RUN chmod +x /usr/local/bin/wait-for

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma files and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy source code
COPY . .

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
RUN apk add --no-cache openssl libc6-compat

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy prisma files and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Add wait-for script and make it executable
ADD https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for /usr/local/bin/wait-for
RUN chmod +x /usr/local/bin/wait-for

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["npm", "start"]