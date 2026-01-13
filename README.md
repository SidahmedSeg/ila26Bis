# ila26 Platform

Multi-tenant SaaS platform with enterprise management features.

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) 1.0+ installed
- [Docker](https://www.docker.com) and Docker Compose
- PostgreSQL (via Docker)
- Redis (via Docker)
- MinIO (via Docker)

### Installation

1. **Install Bun** (if not already installed):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ila26Bis
   ```

3. **Install dependencies**:
   ```bash
   # Install all dependencies
   bun install
   ```

4. **Set up environment variables**:
   ```bash
   # Copy example env files
   cp apps/api/.env.example apps/api/.env
   cp apps/ila26/.env.example apps/ila26/.env
   cp apps/admin-portal/.env.example apps/admin-portal/.env
   ```

5. **Start infrastructure services**:
   ```bash
   docker-compose up -d
   ```

6. **Set up database**:
   ```bash
   cd apps/api
   bunx prisma migrate dev
   bunx prisma db seed
   ```

7. **Start development servers**:
   ```bash
   # From root directory
   bun run dev
   ```

## 📁 Project Structure

```
ila26Bis/
├── apps/
│   ├── api/              # ila26 User API (Backend - NestJS + Bun)
│   ├── admin-api/        # Admin API (Backend - NestJS + Bun)
│   ├── ila26/            # Main application (Frontend - Next.js)
│   └── admin-portal/     # Admin portal (Frontend - Next.js)
├── packages/
│   └── shared/           # Shared utilities, types, and Prisma schema
├── docker-compose.yml    # Local services (PostgreSQL, Redis, MinIO)
├── .gitignore
├── README.md
└── package.json
```

## 🛠️ Development

### Running Services

```bash
# Start all services (API + Frontend apps)
bun run dev

# Start only backend API
cd apps/api
bun run start:dev

# Start only frontend (ila26 app)
cd apps/ila26
bun run dev

# Start only admin portal
cd apps/admin-portal
bun run dev
```

### Database

```bash
# Run migrations
cd apps/api
bunx prisma migrate dev

# Generate Prisma client
bunx prisma generate

# Open Prisma Studio
bunx prisma studio
```

### Testing

```bash
# Run all tests
bun test

# Run backend tests
cd apps/api
bun test

# Run frontend tests
cd apps/ila26
bun test
```

## 📚 Documentation

- [Specification](./SPECIFICATION.md) - Complete system specification
- [Tech Stack](./TECH_STACK.md) - Technology stack details
- [Project Summary](./PROJECT_SUMMARY.md) - Implementation phases
- [Flows](./FLOWS.md) - User flows documentation
- [Bun Setup](./BUN_SETUP.md) - Bun runtime setup guide

## 🌐 Environment Variables

See `.env.example` files in each app directory for required environment variables.

## 📝 License

[Your License Here]

