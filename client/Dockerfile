# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies in one layer
RUN npm install && \
    npm install @tailwindcss/vite@next @radix-ui/react-select

# Copy project files
COPY . .

# Expose development port
EXPOSE 5173

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including build dependencies
RUN npm ci && \
    npm install @tailwindcss/vite@next

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
