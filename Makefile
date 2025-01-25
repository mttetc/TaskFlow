.PHONY: up down restart logs ps clean build migrate seed

# Development commands
up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

ps:
	docker compose ps

# Database commands
migrate:
	docker compose exec server npx prisma migrate dev

migrate-name:
	docker compose exec server npx prisma migrate dev --name $(name)

migrate-deploy:
	docker compose exec server npx prisma migrate deploy

seed:
	docker compose exec server npx prisma db seed

# Cleanup commands
clean:
	docker compose down -v
	docker system prune -f

# Build commands
build:
	docker compose build --no-cache

# Production commands
prod-up:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

prod-down:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# Helper commands
shell-server:
	docker compose exec server sh

shell-client:
	docker compose exec client sh

shell-db:
	docker compose exec db psql -U postgres -d taskflow
