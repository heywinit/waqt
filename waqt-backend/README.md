# Waqt Backend - AI-Powered Time Management & Scheduling

## Overview

The backend of Waqt is built using Golang and provides AI-enabled scheduling and time management services. It exposes a REST API for the frontend and other clients.

## Tech Stack

- **Language:** Golang
- **Framework:** Fiber
- **Database:** PostgreSQL (GORM ORM) (hosted on SupaBase)
- **Authentication:** JWT-based authentication
- **AI Integration:** OpenAI API / Custom ML Models
- **Task Scheduling:** Cron jobs for automated task execution
- **Development Tools:**
  - Air (Hot Reload)
  - Golang Migrate
  - GolangCI-Lint
- **Deployment:** Docker

## Project Structure

```
backend/
│── cmd/                   # Entry point for the application
│── config/                # Configuration files
│── internal/              # Business logic (models, services, repositories)
│── api/                   # API handlers and middleware
│── pkg/                   # Shared utilities
│── migrations/            # Database migrations
│── tests/                 # Unit and integration tests
│── .env                   # Environment variables
│── Dockerfile            # Docker configuration
│── docker-compose.yml    # Docker compose configuration
│── .dockerignore         # Docker ignore rules
│── .air.toml            # Air configuration for hot reload
│── Makefile             # Development and build commands
│── README.md            # Backend documentation
```

## Getting Started

### Prerequisites

- Golang 1.21 or higher
- PostgreSQL database
- Docker (optional)
- Make (for using Makefile commands)

### Installation

1. Install development tools:

   ```sh
   make install-tools
   ```

   This will install:

   - Air (for hot reloading)
   - Golang Migrate (for database migrations)
   - GolangCI-Lint (for code linting)

2. Set up environment variables:

   ```sh
   cp .env.example .env
   ```

3. Install dependencies:
   ```sh
   go mod tidy
   ```

### Development

The project includes several Make commands to help with development:

```sh
# Start development server with hot reload
make dev

# Build the application
make build

# Run the application
make run

# Run tests
make test

# Run linter
make lint

# Clean build artifacts
make clean

# Database migrations
make migrate-up    # Apply migrations
make migrate-down  # Rollback migrations
```

### Docker Deployment

The project includes a multi-stage Dockerfile for optimized production builds:

```sh
# Build Docker image
make docker-build

# Run Docker container
make docker-run
```

The Dockerfile:

- Uses multi-stage build for smaller final image
- Includes only necessary runtime dependencies
- Runs as non-root user for security
- Includes migration files
- Exposes port 8080

### Development Tools Configuration

#### Air (Hot Reload)

The `.air.toml` file configures hot reloading during development:

- Watches for file changes
- Automatically rebuilds and restarts the server
- Excludes unnecessary directories
- Configures build and run settings

#### Docker

The `.dockerignore` file excludes unnecessary files from the Docker build:

- Development files
- Version control
- Build artifacts
- Documentation
- Test files

## API Endpoints

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/auth/signup`       | User registration          |
| POST   | `/auth/login`        | User login                 |
| POST   | `/auth/logout`       | User logout                |
| GET    | `/auth/me`           | Get current user           |
| GET    | `/tasks`             | Fetch all tasks            |
| POST   | `/tasks`             | Create a task              |
| GET    | `/tasks/:id`         | Get task by ID             |
| PUT    | `/tasks/:id`         | Update task                |
| DELETE | `/tasks/:id`         | Delete task                |
| GET    | `/schedule`          | Get schedule               |
| POST   | `/schedule/generate` | Generate AI-based schedule |
| PUT    | `/schedule/update`   | Update schedule            |
| GET    | `/settings`          | Get user settings          |
| PUT    | `/settings/update`   | Update user settings       |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

## License

MIT License
