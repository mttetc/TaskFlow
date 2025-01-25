#!/bin/sh
set -e

# Wait for database to be ready
echo "Waiting for database to be ready..."
wait-on -v tcp:db:5432 -t 30000

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Then exec the container's main process (what's set as CMD in the Dockerfile)
exec "$@"
