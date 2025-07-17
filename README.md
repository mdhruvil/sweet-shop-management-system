# Sweet Shop Management System

A full-stack Sweet Shop Management System built with TypeScript, following Test-Driven Development (TDD) principles.

## Architecture

This is a monorepo containing:

- **Backend** (`apps/backend/`): Node.js REST API with Express, TypeScript, and Vitest for testing
- **Frontend** (`apps/frontend/`): React application with Vite, TypeScript, and modern tooling

## Getting Started

### Prerequisites

- Node.js >=24.0.0
- pnpm 10.12.4 or higher

### Installation

```bash
# Install all dependencies for both frontend and backend
pnpm install

# Start both frontend and backend in development mode
pnpm dev

# Start only the backend
pnpm --filter backend dev

# Start only the frontend
pnpm --filter frontend dev
```

### Available Scripts

- `pnpm dev` - Start both frontend and backend in development mode
- `pnpm build` - Build both applications
- `pnpm start` - Start the backend server in production mode
- `pnpm test` - Run tests for both applications
- `pnpm lint` - Run linting for both applications
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier

### Workspace Structure

```
├── apps/
│   ├── backend/          # Express.js API
│   │   ├── src/          # Source code
│   │   ├── tests/        # Test files
│   │   └── package.json  # Backend dependencies
│   └── frontend/         # React application
│       ├── src/          # React components
│       ├── public/       # Static assets
│       └── package.json  # Frontend dependencies
├── packages/             # Shared packages (future)
├── package.json          # Root workspace configuration
└── pnpm-workspace.yaml   # Workspace definition
```

## Development

This project follows TDD principles. Write tests first, then implement functionality.

### Backend Features

- ✅ Add/Delete/View sweets
- ✅ Search by name, category, price range
- ✅ Purchase/Restock inventory management
- ✅ Comprehensive test coverage with Vitest

### Frontend Features

- 🚧 Modern React UI with TypeScript
- 🚧 Integration with backend API
- 🚧 Responsive design

## License

MIT
