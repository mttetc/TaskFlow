# TaskFlow

A modern task management application with React frontend and Express backend.

## Prerequisites

- Docker Desktop
- Make (pre-installed on macOS/Linux)

## Quick Start

```bash
# Start development environment
make up

# Run database migrations
make migrate

# Seed the database (optional)
make seed
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Development Commands

```bash
# Start containers
make up

# Stop containers
make down

# View logs
make logs

# Rebuild containers (after dependency changes)
make build

# Database commands
make migrate     # Run migrations
make seed        # Seed database

# Access shells
make shell-server  # Node.js server
make shell-client  # React client
make shell-db      # PostgreSQL database
```

## Troubleshooting

If you encounter issues:

```bash
# Full reset
make down        # Stop containers
make clean       # Remove volumes
make build       # Rebuild images
make up          # Start fresh
make migrate     # Run migrations
```

## Tech Stack

- **Frontend**: React, Tailwind CSS, React Query
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL
- **DevOps**: Docker, Docker Compose