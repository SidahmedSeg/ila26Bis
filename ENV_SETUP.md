# Environment Variables Setup Guide

## Port Configuration (5-digit ports)

All services use 5-digit ports:
- **PostgreSQL**: Port `25000`
- **Redis**: Port `25100`
- **MinIO API**: Port `25200`
- **MinIO Console**: Port `25201`

## Setup Instructions

### 1. User API (apps/api)

Copy `.env.example` to `.env`:
```bash
cd apps/api
cp .env.example .env
```

The `.env` file should contain:
```env
# Server
PORT=4000
NODE_ENV=development

# Database (Shared Prisma schema)
DATABASE_URL="postgresql://ila26:ila26_dev_password@localhost:25000/ila26_dev?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=25100

# JWT - User API (Separate from Admin API)
JWT_SECRET=your-user-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-user-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Mailtrap
MAILTRAP_API_TOKEN=your-mailtrap-token
MAILTRAP_FROM_EMAIL=noreply@ila26.com

# INSEE API
INSEE_API_KEY=your-insee-api-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Google Places API
GOOGLE_PLACES_API_KEY=your-google-places-api-key

# MinIO (S3-compatible)
MINIO_ENDPOINT=localhost
MINIO_PORT=25200
MINIO_ACCESS_KEY=ila26minioadmin
MINIO_SECRET_KEY=ila26minioadminpassword
MINIO_USE_SSL=false

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 2. Admin API (apps/admin-api)

Copy `.env.example` to `.env`:
```bash
cd apps/admin-api
cp .env.example .env
```

The `.env` file should contain:
```env
# Server
PORT=4001
NODE_ENV=development

# Database (Shared Prisma schema)
DATABASE_URL="postgresql://ila26:ila26_dev_password@localhost:25000/ila26_dev?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=25100

# JWT - Admin API (Separate from User API)
JWT_SECRET=your-admin-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-admin-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3001
```

### 3. Shared Prisma (packages/shared/prisma)

The `.env` file should contain:
```env
DATABASE_URL="postgresql://ila26:ila26_dev_password@localhost:25000/ila26_dev?schema=public"
```

## Quick Setup Commands

```bash
# From project root

# User API
cd apps/api
cp .env.example .env
# Edit .env with your API keys

# Admin API
cd ../admin-api
cp .env.example .env
# Edit .env with your API keys

# Shared Prisma (already created)
# packages/shared/prisma/.env already has DATABASE_URL
```

## Port Summary

| Service | Port | Usage |
|---------|------|-------|
| PostgreSQL | 25000 | Database connection |
| Redis | 25100 | Cache and sessions |
| MinIO API | 25200 | File storage API |
| MinIO Console | 25201 | MinIO web console |
| User API | 4000 | Backend API for main app |
| Admin API | 4001 | Backend API for admin portal |

## MinIO Console Access

- URL: http://localhost:25201
- Username: `ila26minioadmin`
- Password: `ila26minioadminpassword`

After login, create the following buckets:
- `ila26-logos`
- `ila26-documents`
- `ila26-covers`

---

**Note**: Update all `your-*-key` placeholders with actual API keys before running the applications.

