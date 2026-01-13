# ila26 Admin API

Backend API for the ila26 Admin Portal.

## Overview

- **Port**: 4001 (development)
- **Framework**: NestJS 11+ with Bun runtime
- **Database**: PostgreSQL (shared Prisma schema)
- **Authentication**: JWT tokens (separate from User API)

## Features

- Admin authentication (separate system)
- Enterprise management
- Payment management
- Settings management (Activities, Specialities)
- System-wide access (not tenant-scoped)

## Getting Started

### Prerequisites

- Bun 1.0+
- PostgreSQL (via Docker Compose)
- Redis (via Docker Compose)

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
- http://localhost:4001/api (when configured)

## Environment Variables

See `.env.example` for all required environment variables.

## Architecture

- Uses shared Prisma schema from `packages/shared/prisma`
- Separate authentication system from User API
- System-wide queries (all tenants)
- Admin JWT token authentication
