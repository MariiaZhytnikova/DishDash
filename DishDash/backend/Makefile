# ==========================
# DishDash Development Makefile
# ==========================

# Environment
ifneq (,$(wildcard .env))
    include .env
    export
endif

# --------------------------
# PostgreSQL / Docker
# --------------------------

# Start DB container in background
up:
	docker-compose up -d

# Stop DB container
down:
	docker-compose down

# Follow DB logs
logs:
	docker-compose logs -f db

# Enter PostgreSQL shell
db-shell:
	docker exec -it dishdash-db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

# Reset DB (delete volumes, start fresh)
reset:
	docker-compose down -v
	docker-compose up -d

# --------------------------
# Migrations (golang-migrate)
# --------------------------

# Apply all migrations
migrate-up:
	migrate -path $(pwd)internal/migrations -database "$$DATABASE_URL" up

# Rollback last migration
migrate-down:
	migrate -path internal/migrations -database "$$DATABASE_URL" down

# --------------------------
# Go server / app
# --------------------------

# Run Go server with auto-reload (requires fresh)
dev:
	@echo "Starting Go server with auto-reload..."
	# Export environment variables from .env
	@export $$(grep -v '^#' .env | xargs) && \
	cd cmd && fresh

# Run all tests
test:
	go test ./... -v

# Run tests with race detector
test-race:
	go test ./... -race -v

# Format code
fmt:
	go fmt ./...

# Lint code (if you have golangci-lint)
lint:
	golangci-lint run
