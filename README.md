# Custodian Frontend

A modern, modular frontend for an OpenWealth-based Custodian Service using React + Vite.

## Features

- Dashboard for overview of security accounts
- Positions List (ISINs, quantities, market values)
- Transaction List (trade history, dividends, fees)
- Account management

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Chakra UI
- Axios

## Prerequisites

- Node.js (v18 or later)
- npm or pnpm
- A running backend API (on http://localhost:8010)

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3003.

### Environment Configuration

The application uses a `.env` file for local development configuration. By default, the standalone development server runs on port 3003. You can modify this by changing the `PORT` value in the `.env` file:

```
PORT=3003
```

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
  App.tsx        # Main application component
  main.tsx       # Entry point
```

## API Integration

The frontend connects to a backend API running on http://localhost:8010. The development server proxies API calls to the backend.

API documentation is available at http://localhost:8010/docs.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run test` - Run tests

## Docker Deployment

To run the application in Docker (note that Docker uses port 3002 while standalone development uses port 3003):

1. Build the Docker image:
```bash
docker build -t custodian-frontend .
```

2. Run the container:
```bash
docker run -p 3002:3002 custodian-frontend
```

The application will be available at http://localhost:3002.

Note: The Docker configuration uses Nginx to serve the application and proxies API requests to a backend service. Make sure to configure the backend service address in the nginx.conf file if needed.

## License

MIT
