# Waqt - AI-Powered Time Management & Scheduling

## Overview

Waqt is an AI-powered time management and auto-scheduling application designed to help users efficiently manage their daily tasks, meetings, and projects. The system consists of a backend built with Golang and a frontend developed using React, Vite, and TailwindCSS.

## Tech Stack

### Backend

- **Language:** Golang
- **Framework:** Fiber
- **Database:** PostgreSQL
- **ORM:** GORM
- **Authentication:** JWT / OAuth
- **AI Integration:** OpenAI API / Custom ML models
- **Deployment:** Docker, Kubernetes, AWS / DigitalOcean

### Frontend

- **Language:** TypeScript
- **Framework:** React (Vite)
- **UI Library:** TailwindCSS, ShadCN
- **State Management:** Context API / Redux (if needed)
- **API Communication:** REST API via Axios
- **Deployment:** Vercel / Netlify

## Monorepo Structure

```
waqt/
│── backend/             # Backend service (Golang)
│   ├── cmd/             # Application entry points
│   ├── config/          # Configuration files
│   ├── internal/        # Core business logic
│   ├── models/          # Database models
│   ├── routes/          # API route handlers
│   ├── services/        # Service layer
│   ├── main.go          # Main entry point
│   └── ...
│── frontend/            # Frontend service (React, Vite, TailwindCSS)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│── docs/                # Documentation
│── .gitignore           # Git ignore rules
│── docker-compose.yml   # Docker setup for services
│── README.md            # Root documentation
```

## Getting Started

### Prerequisites

- **Backend:** Go 1.20+, PostgreSQL, Docker
- **Frontend:** Node.js 18+, npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/axiom-svgu/waqt.git
   cd waqt
   ```
2. Set up the backend:
   ```sh
   cd backend
   go mod tidy
   go run main.go
   ```
3. Set up the frontend:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:3000`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

## License

MIT License
