# @ila26/shared - Shared Package

This package contains shared code used by both User API and Admin API.

## Structure

```
packages/shared/
├── prisma/          # Shared Prisma schema
├── types/           # Shared TypeScript types
├── utils/           # Shared utilities
├── constants/       # Shared constants
└── package.json
```

## Prisma Schema

The shared Prisma schema defines all database models used by both APIs.

### Usage

To use Prisma in the APIs, import from `@prisma/client` which will be generated from this schema.

### Commands

```bash
# Generate Prisma client
cd packages/shared/prisma
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# Open Prisma Studio
bunx prisma studio

# Seed database
bunx prisma db seed
```

### Environment Variables

Copy `.env.example` to `.env` in the prisma directory:

```bash
DATABASE_URL="postgresql://ila26:ila26_dev_password@localhost:5432/ila26_dev?schema=public"
```

## Database Models

The schema includes:

- **User Models**: User, AdminUser
- **Tenant Models**: Tenant, TenantMembership
- **Role Models**: Role, RolePermission
- **Subscription Models**: Subscription, Payment, UserFeature
- **Enterprise Models**: Document, DocumentCategory
- **Settings Models**: ActivityDomain, Speciality
- **Feature Models**: FeatureFlag, PlanFeature
- **Auth Models**: OTP

## Next Steps

1. Generate Prisma client: `bunx prisma generate`
2. Run migrations: `bunx prisma migrate dev`
3. Import Prisma client in APIs: `import { PrismaClient } from '@prisma/client'`

