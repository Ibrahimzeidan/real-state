<<<<<<< HEAD
## Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Ibrahimzeidan/real-state.git
cd real-state
```

### 2. Install dependencies
Install both frontend and backend dependencies:
```bash
# cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

### 3. Environment Variables
Create a `.env.local` in the backend root:
```env
PORT=4000
MONGODB_URI=you mongodb connection
MONGODB_DB=cms
JWT_SECRET=EBDA605279DFA0AA53DEBD5F5A10633F748E0927AE4DC89FDC444A9A02C14C51
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000

```
Create a `.env` in the backend root:
```env
PORT=4000
MONGODB_URI=you mongodb connection
MONGODB_DB=cms
JWT_SECRET=EBDA605279DFA0AA53DEBD5F5A10633F748E0927AE4DC89FDC444A9A02C14C51
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000

```

### 4. Run the project
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---
=======
# PrimeNest Estates Monorepo

This repository contains the frontend and backend applications for PrimeNest Estates.

## Structure

```text
.
|-- frontend/
|   |-- public/          # Static assets
|   |-- src/
|   |   |-- app/         # Next.js App Router pages and API routes
|   |   |-- components/  # Shared UI and feature components
|   |   |-- hooks/       # Reusable React hooks
|   |   |-- lib/         # Utilities, auth helpers, db access, validation
|   |   |-- models/      # Mongoose models used by the frontend app
|   |   |-- services/    # Client-facing service helpers
|   |   |-- styles/      # Additional stylesheet assets
|   |   `-- middleware.ts
|   `-- package.json
|-- backend/
|   |-- src/
|   |   |-- config/      # Environment and database configuration
|   |   |-- middlewares/ # Express middleware
|   |   |-- models/      # Mongoose models
|   |   |-- routes/      # API route modules
|   |   |-- services/    # Backend services
|   |   `-- utils/       # Shared backend utilities
|   `-- package.json
`-- package.json         # Workspace helper scripts
```

## Getting Started

### Frontend

```bash
npm run frontend:dev
```

### Backend

```bash
npm run backend:dev
```

## Environment Files

- `frontend/.env`
- `backend/.env`

Use the included `.env.example` files as templates when setting up a new environment.
>>>>>>> 8eefceb (Added static admin system and protected admin route)
