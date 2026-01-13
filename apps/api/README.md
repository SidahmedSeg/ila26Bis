# ila26 User API

Backend API for the ila26 main application.

## Overview

- **Port**: 4000 (development)
- **Framework**: NestJS 11+ with Bun runtime
- **Database**: PostgreSQL (shared Prisma schema)
- **Authentication**: JWT tokens (separate from Admin API)

## Features

- User authentication (Email, Google OAuth)
- Multi-tenant architecture
- Enterprise profile management
- Subscription management
- Payment processing (Stripe)
- Mobility feature
- Invitation system

## Getting Started

### Prerequisites

- Bun 1.0+
- PostgreSQL (via Docker Compose)
- Redis (via Docker Compose)
- MinIO (via Docker Compose)

### Installation

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

### Database Setup

The Prisma schema is in `packages/shared/prisma`. 

```bash
# From root directory
cd packages/shared/prisma
bunx prisma generate
bunx prisma migrate dev
```

### Running

```bash
# Development
bun run start:dev

# Production build
bun run build

# Production start
bun run start:prod
```

### Testing

```bash
# Unit tests
bun test

# E2E tests
bun run test:e2e

# Test coverage
bun run test:cov
```

## API Documentation

Once running, Swagger documentation will be available at:
- http://localhost:4000/api (when configured)

## Environment Variables

See `.env.example` for all required environment variables.

## Architecture

- Uses shared Prisma schema from `packages/shared/prisma`
- Separate authentication system from Admin API
- Tenant-scoped queries
- JWT token authentication
