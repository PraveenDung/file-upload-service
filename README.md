-- Project Overview
A backend microservice for secure file uploads, metadata storage, and async processing using BullMQ and Redis.

-- How to Run Locally
bash commands
git clone https://github.com/PraveenDung/file-upload-service.git
cd file-upload-service
npm install
cp .env.example .env
# Update .env with your DB + Redis config

npx prisma migrate dev --name init
npx prisma generate

-- Running Services
bashCommands
# Terminal 1 - API Server
npx nodemon src/index.js

# Terminal 2 - Background Worker
npx nodemon src/jobs/worker.js

# Optional - DB Viewer
npx prisma studio

-- Authentication Flow
POST /auth/login — returns JWT

Add Authorization: Bearer <token> to all protected routes

-- File Upload Flow
POST /upload — upload file (limit 5MB, rate limited to 5/min/user)

GET /files/:id — view uploaded file status and metadata

-- Design Choices
Express.js for routing

Prisma + PostgreSQL for persistence

BullMQ + Redis for background job handling

Multer for file uploads (to ./uploads)

JWT for auth

-- Known Limitations
No frontend
File checksum is mocked
No retries implemented for failed jobs
