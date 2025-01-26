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

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy source code
COPY . .

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

# Add wait-for script
ADD https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for /usr/local/bin/wait-for
RUN chmod +x /usr/local/bin/wait-for

EXPOSE 3000

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev \
    libc6-compat

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Install TypeScript globally for build
RUN npm install -g typescript

# Copy prisma schema
COPY prisma ./prisma/

# Copy source code and build
COPY . .
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Add wait-for script
ADD https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for /usr/local/bin/wait-for
RUN chmod +x /usr/local/bin/wait-for

EXPOSE 3000

CMD ["npm", "start"]