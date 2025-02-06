# Waqt - AI-Powered Time Management & Scheduling

## Overview

Waqt is an AI-enabled time management and auto-scheduling application designed to optimize users' daily routines efficiently. Built with Golang, the backend leverages advanced scheduling algorithms and AI to help users manage tasks effectively.

## Features

- **AI-Powered Scheduling** - Automatically generates optimized daily schedules based on user priorities.
- **Task Management** - Create, update, and delete tasks with ease.
- **Habit Tracking** - Learn from user behavior to suggest better schedules over time.
- **Automated Reminders** - Get notifications for upcoming tasks.
- **Smart Prioritization** - AI determines the most important tasks and allocates time accordingly.
- **Cross-Platform Support** - Accessible via mobile and web apps.

## Tech Stack

- **Backend:** Golang (Fiber)
- **Database:** PostgreSQL (GORM ORM)
- **AI Integration:** OpenAI API / Custom ML Models
- **Authentication:** JWT-based authentication
- **Task Scheduling:** Cron jobs for automated task execution
- **Deployment:** Docker, Railway/Fly.io/Render

## Project Structure

```
waqt-backend/
│── cmd/                   # Entry point for the application
│── config/                # Configuration files
│── internal/              # Business logic (models, services, repositories)
│── api/                   # API handlers and middleware
│── pkg/                   # Shared utilities
│── migrations/            # Database migrations
│── tests/                 # Unit and integration tests
│── .env                   # Environment variables
│── Dockerfile             # Docker configuration
│── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Golang installed
- PostgreSQL database set up

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/waqt.git
   cd waqt-backend
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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

## License

MIT License
