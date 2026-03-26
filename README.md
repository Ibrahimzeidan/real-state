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
MONGODB_URI="mongodb://ibrahimzeidan09_db_user:realstate123@ac-rz2ntp7-shard-00-00.lqgc1of.mongodb.net:27017,ac-rz2ntp7-shard-00-01.lqgc1of.mongodb.net:27017,ac-rz2ntp7-shard-00-02.lqgc1of.mongodb.net:27017/?ssl=true&replicaSet=atlas-3raywj-shard-0&authSource=admin&appName=Cluster0"
MONGODB_DB=cms
JWT_SECRET=EBDA605279DFA0AA53DEBD5F5A10633F748E0927AE4DC89FDC444A9A02C14C51
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000

```
Create a `.env` in the backend root:
```env
PORT=4000
MONGODB_URI="mongodb://ibrahimzeidan09_db_user:realstate123@ac-rz2ntp7-shard-00-00.lqgc1of.mongodb.net:27017,ac-rz2ntp7-shard-00-01.lqgc1of.mongodb.net:27017,ac-rz2ntp7-shard-00-02.lqgc1of.mongodb.net:27017/?ssl=true&replicaSet=atlas-3raywj-shard-0&authSource=admin&appName=Cluster0"
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
