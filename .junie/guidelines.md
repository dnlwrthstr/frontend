# Custodian Frontend Project Guidelines

## Project Overview
This project is a modern, modular frontend for an OpenWealth-based Custodian Service using React + Vite. It's designed to be scalable and potentially evolve into micro-frontends in the future.

### Purpose
The frontend provides a user interface for banking data (OpenWealth) with features including:
- Dashboard for overview of security accounts
- Positions List (ISINs, quantities, market values)
- Transaction List (trade history, dividends, fees)
- Notifications for real-time updates

## Project Structure
The project follows a domain-based organization to support modularity:

```
/src
  /features      # Domain-specific features
    /positions   # Position-related components and hooks
    /transactions # Transaction-related components and hooks
    /accounts    # Account-related components and hooks
  /components    # Reusable UI components
  /shared        # Shared utilities and hooks
  /routes        # Page components
  /api           # API clients and endpoints
  App.jsx        # Main application component
  main.jsx       # Entry point
```

## Development Guidelines

### Prerequisites
- Node.js (v18 or later)
- npm or pnpm (preferred for workspaces)
- Git
- A running backend (FastAPI or GraphQL)

### Testing
- Tests should be written using Vitest and React Testing Library
- Run tests with `npx vitest`
- Ensure all tests pass before submitting changes

### Building
- Development server: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`

### Code Style
- Follow React best practices
- Use functional components with hooks
- Keep state local to features when possible
- Use lazy loading for route-based code splitting
- Place shared logic in `/shared/` directory

## Integration with Backend
The frontend connects to a backend API (FastAPI or GraphQL) through a proxy configuration in Vite:
- API calls should be made to `/api/*` endpoints
- The development server proxies these calls to the backend

## Component Libraries
Choose one of the following component libraries:
- shadcn/ui (Headless + Tailwind friendly)
- Chakra UI (Accessible + batteries-included)
- Material UI (Corporate & consistent)
