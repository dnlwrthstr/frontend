# 🏗️ Custodian Frontend Setup Guide (React + Vite, MFE-Ready)

This guide sets up a modern, modular frontend for the OpenWealth-based Custodian Service using **React + Vite** — built to evolve into micro-frontends later if needed.

---

## ⚙️ 1. Prerequisites

- Node.js (v18 or later)
- npm or pnpm (preferred for workspaces)
- Git
- A running backend (FastAPI or GraphQL)

---

## 🚀 2. Create the Vite + React Project

```bash
npm create vite@latest custodian-frontend -- --template react
cd custodian-frontend
npm install
npm run dev
```

---

## 🧱 3. Folder Structure

Organize by **domain** to support modularity and future micro-frontend migration.

```
/src
  /features
    /positions
      PositionsList.jsx
      usePositions.js
    /transactions
      TransactionsTable.jsx
      useTransactions.js
    /accounts
      AccountDetails.jsx
  /components
    Button.jsx
    Card.jsx
  /shared
    useAuth.js
    formatCurrency.js
  /routes
    Dashboard.jsx
    Login.jsx
  /api
    client.js
    positionsApi.js
  App.jsx
  main.jsx
```

---

## 🔗 4. Backend Proxy (FastAPI or GraphQL)

Edit `vite.config.ts` to proxy local API calls:

```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
```

Then call:
```js
fetch('/api/positions')  // Proxied to backend
```

---

## 🧩 5. Prepare for Micro-Frontends

- ✅ Use **lazy loading** for route-based code splitting:
```js
const Positions = React.lazy(() => import('./features/positions/PositionsList'));
```

- ✅ Keep state local to features or use modular slices (e.g., Zustand, Redux Toolkit)
- ✅ Pass props explicitly to decouple dependencies between features
- ✅ Place shared logic in `/shared/` for future extraction into a shared module

---

## 🧪 6. Testing (Optional)

Use **Vitest** (comes with Vite) or install:

```bash
npm install --save-dev vitest @testing-library/react
```

---

## 📦 7. Component Libraries (Choose One)

| Option      | Notes                         |
|-------------|-------------------------------|
| `shadcn/ui` | Headless + Tailwind friendly  |
| Chakra UI   | Accessible + batteries-included |
| Material UI | Corporate & consistent        |

---

## 🛠️ 8. Useful Commands

| Task           | Command                |
|----------------|------------------------|
| Start dev      | `npm run dev`          |
| Build          | `npm run build`        |
| Preview        | `npm run preview`      |
| Run tests      | `npx vitest`           |

---

## 📚 9. What to Build First

| Feature         | Description                        |
|------------------|------------------------------------|
| Dashboard        | Overview of all security accounts  |
| Positions List   | ISINs, quantities, market values   |
| Transaction List | Trade history, dividends, fees     |
| Notifications    | (Optional) show mock real-time updates |

---

## ✅ Done!

You now have a performant, modular React frontend ready for:
- 💼 Banking data (OpenWealth)
- 🔀 REST or GraphQL
- 🧩 Future micro-frontend refactoring

> Need backend integration, test data, or auth mockup? Ask the team to hook you up with `/api/positions` and related endpoints.