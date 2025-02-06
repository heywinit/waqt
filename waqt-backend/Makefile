.PHONY: build run test clean migrate-up migrate-down dev docker-build docker-run lint

# Go parameters
BINARY_NAME=waqt-api
MAIN_PATH=./cmd/server
GO_FILES=$(shell find . -name '*.go' -not -path "./vendor/*")

# Docker parameters
DOCKER_IMAGE=waqt-backend
DOCKER_TAG=latest

all: clean build

build:
	@echo "Building..."
	go build -o bin/$(BINARY_NAME) $(MAIN_PATH)

run:
	@echo "Running..."
	go run $(MAIN_PATH)

test:
	@echo "Running tests..."
	go test -v ./...

clean:
	@echo "Cleaning..."
	go clean
	rm -f bin/$(BINARY_NAME)

# Database migrations
migrate-up:
	@echo "Running migrations up..."
	migrate -path migrations -database "$(DB_URL)" up

migrate-down:
	@echo "Running migrations down..."
	migrate -path migrations -database "$(DB_URL)" down

# Development
dev:
	@echo "Starting development server..."
	air -c .air.toml

# Install development tools
install-tools:
	@echo "Installing development tools..."
	go install github.com/cosmtrek/air@latest
	go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Linting
lint:
	@echo "Running linter..."
	golangci-lint run

# Docker commands
docker-build:
	@echo "Building Docker image..."
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

docker-run:
	@echo "Running Docker container..."
	docker run -p 8080:8080 --env-file .env $(DOCKER_IMAGE):$(DOCKER_TAG)

# Help
help:
	@echo "Available commands:"
	@echo "  make build         - Build the application"
	@echo "  make run          - Run the application"
	@echo "  make test         - Run tests"
	@echo "  make clean        - Clean build files"
	@echo "  make migrate-up   - Run database migrations up"
	@echo "  make migrate-down - Run database migrations down"
	@echo "  make dev          - Run development server with hot reload"
	@echo "  make lint         - Run linter"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run   - Run Docker container"
	@echo "  make install-tools- Install development tools"
