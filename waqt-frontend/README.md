# Waqt Frontend - AI-Powered Time Management & Scheduling

## Overview

The frontend of Waqt is a web application built using React, Vite, and TailwindCSS. It serves as the user interface for managing tasks, scheduling, and tracking productivity.

## Tech Stack

- **Language:** TypeScript
- **Framework:** React (Vite)
- **UI Library:** TailwindCSS, ShadCN
- **State Management:** Context API / Redux (if needed)
- **API Communication:** REST API via Node Fetch
- **Deployment:** Vercel

## Project Structure

```
frontend/
│── public/               # Static assets
│   └── vite.svg
│── src/                  # Source files
│   ├── assets/           # Images, icons, and other static assets
│   │   └── react.svg
│   ├── lib/              # Utility functions
│   │   └── utils.ts
│   ├── pages/            # Page components
│   │   ├── HomePage/     # Homepage-specific components
│   │   │   └── HeroSection.tsx
│   │   └── HomePage.tsx  # Main homepage component
│   ├── App.tsx           # Root application component
│   ├── index.css         # Global styles
│   ├── main.tsx          # Entry point
│   └── vite-env.d.ts     # Vite environment definitions
│── components.json       # UI component references
│── eslint.config.js      # ESLint configuration
│── index.html            # Main HTML file
│── package.json          # Project dependencies
│── package-lock.json     # Dependency lock file
│── postcss.config.js     # PostCSS configuration
│── README.md             # Frontend documentation
│── tailwind.config.js    # TailwindCSS configuration
│── tsconfig.app.json     # TypeScript config for app
│── tsconfig.json         # TypeScript global config
│── tsconfig.node.json    # TypeScript config for Node
│── vercel.json           # Deployment config for Vercel
│── vite.config.ts        # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js installed
- Backend service running

### Installation

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   ```sh
   cp .env.example .env
   ```
4. Run the application:
   ```sh
   npm run dev
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

## License

MIT License
