# Getting Started - ila26 Platform

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Bun 1.0+** installed ([Install Bun](https://bun.sh))
- [ ] **Docker** and **Docker Compose** installed
- [ ] **Git** installed
- [ ] Code editor (VS Code recommended)
- [ ] API keys for:
  - [ ] Stripe (test mode)
  - [ ] Mailtrap
  - [ ] INSEE API
  - [ ] Google Places API
  - [ ] Google OAuth credentials

## Step-by-Step Setup

### 1. Verify Bun Installation

```bash
bun --version
# Should output: 1.0.x or higher
```

If Bun is not installed:
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies

From the project root:

```bash
bun install
```

### 3. Start Infrastructure Services

Start PostgreSQL, Redis, and MinIO using Docker Compose:

```bash
docker-compose up -d
```

Verify services are running:
```bash
docker-compose ps
```

You should see:
- `ila26-postgres` (port 5432)
- `ila26-redis` (port 6379)
- `ila26-minio` (ports 9000, 9001)

### 4. Access MinIO Console

1. Open http://localhost:9001 in your browser
2. Login with:
   - Username: `ila26minioadmin`
   - Password: `ila26minioadminpassword`
3. Create buckets:
   - `ila26-logos`
   - `ila26-documents`
   - `ila26-covers`

### 5. Set Up Environment Variables

Copy example env files (will be created in next steps):

```bash
# Backend API
cp apps/api/.env.example apps/api/.env

# Frontend ila26 app
cp apps/ila26/.env.example apps/ila26/.env

# Admin portal
cp apps/admin-portal/.env.example apps/admin-portal/.env
```

### 6. Configure Environment Variables

Edit the `.env` files with your configuration:

**apps/api/.env** (Backend):
```env
# Database
DATABASE_URL="postgresql://ila26:ila26_dev_password@localhost:5432/ila26_dev?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mailtrap
MAILTRAP_API_TOKEN=your-mailtrap-token
MAILTRAP_FROM_EMAIL=noreply@ila26.com

# INSEE API
INSEE_API_KEY=your-insee-api-key

# Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Google Places
GOOGLE_PLACES_API_KEY=your-google-places-api-key

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=ila26minioadmin
MINIO_SECRET_KEY=ila26minioadminpassword
MINIO_USE_SSL=false

# App
NODE_ENV=development
PORT=4000
```

**apps/ila26/.env.local** (Frontend):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

**apps/admin-portal/.env.local** (Admin Portal):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 7. Set Up Database

```bash
cd apps/api

# Run migrations
bunx prisma migrate dev

# Seed database (activities, specialities, default roles)
bunx prisma db seed
```

### 8. Start Development Servers

From the project root:

```bash
# Start all services (API + Frontend apps)
bun run dev
```

Or start individually:

```bash
# Backend API only (port 4000)
bun run dev:api

# Frontend ila26 app only (port 3000)
bun run dev:ila26

# Admin portal only (port 3001)
bun run dev:admin
```

## 🎯 Next Steps

1. **Backend API Setup** (Phase 1)
   - Initialize NestJS project
   - Set up Prisma schema
   - Configure authentication

2. **Frontend Setup** (Phase 2)
   - Initialize Next.js projects
   - Set up Shadcn/ui
   - Configure authentication

3. **Continue Implementation**
   - Follow the [Project Summary](./PROJECT_SUMMARY.md) for detailed phases
   - Refer to [Specification](./SPECIFICATION.md) for requirements
   - Check [Flows](./FLOWS.md) for user flows

## 🔧 Useful Commands

### Docker

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart postgres
```

### Database

```bash
# Run migrations
cd apps/api
bunx prisma migrate dev

# Generate Prisma client
bunx prisma generate

# Open Prisma Studio (GUI)
bunx prisma studio

# Reset database (careful!)
bunx prisma migrate reset
```

### Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Lint code
bun run lint

# Format code
bun run format
```

## 🐛 Troubleshooting

### Bun not found
- Install Bun: `curl -fsSL https://bun.sh/install | bash`
- Restart terminal
- Verify: `bun --version`

### Docker services not starting
- Check Docker is running: `docker ps`
- Check ports are available: `lsof -i :5432`, `lsof -i :6379`, `lsof -i :9000`
- View logs: `docker-compose logs`

### Database connection errors
- Verify PostgreSQL is running: `docker-compose ps postgres`
- Check DATABASE_URL in `.env`
- Try connecting: `docker-compose exec postgres psql -U ila26 -d ila26_dev`

### Prisma errors
- Regenerate client: `bunx prisma generate`
- Check migrations: `bunx prisma migrate status`
- Reset if needed: `bunx prisma migrate reset`

## 📚 Documentation

- [Specification](./SPECIFICATION.md) - Complete system specification
- [Tech Stack](./TECH_STACK.md) - Technology details
- [Project Summary](./PROJECT_SUMMARY.md) - Implementation phases
- [Flows](./FLOWS.md) - User flows
- [Bun Setup](./BUN_SETUP.md) - Bun runtime guide

## 🆘 Need Help?

- Check the documentation files
- Review error messages carefully
- Check Docker logs: `docker-compose logs`
- Verify environment variables
- Ensure all prerequisites are installed

---

**Ready to code!** 🚀

