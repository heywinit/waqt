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
- **Deployment:** Vercel

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
│── Dockerfile             # Docker configuration
│── README.md              # Backend documentation
```

## Getting Started

### Prerequisites

- Golang installed
- PostgreSQL database set up

### Installation

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   go mod tidy
   ```
3. Set up environment variables:
   ```sh
   cp .env.example .env
   ```
4. Run the application:
   ```sh
   go run cmd/server/main.go
   ```

## API Endpoints

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/auth/signup`       | User registration          |
| POST   | `/auth/login`        | User login                 |
| GET    | `/tasks`             | Fetch all tasks            |
| POST   | `/tasks`             | Create a task              |
| GET    | `/schedule/generate` | Generate AI-based schedule |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

## License

MIT License
