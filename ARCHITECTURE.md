# ila26 Platform Architecture

## Overview

The ila26 platform consists of **4 main applications**:

1. **ila26 App** (Frontend) - Main multi-tenant application
2. **ila26 API** (Backend) - User-facing API
3. **Admin Portal** (Frontend) - Administrative dashboard
4. **Admin API** (Backend) - Admin-only API

## System Architecture

### High-Level Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│   ila26 App         │         │  Admin Portal       │
│   (Frontend)        │         │  (Frontend)         │
│   Next.js + Shadcn  │         │  Next.js + Shadcn   │
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           │                               │
┌──────────▼──────────┐      ┌────────────▼────────────┐
│  ila26 API          │      │  Admin API              │
│  (Backend)          │      │  (Backend)              │
│  NestJS + Bun       │      │  NestJS + Bun           │
│  Port: 4000         │      │  Port: 4001             │
│  User Authentication│      │  Admin Authentication   │
│  JWT Tokens         │      │  JWT Tokens             │
└──────────┬──────────┘      └────────────┬────────────┘
           │                               │
           └───────────┬───────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
┌──────▼──────┐  ┌─────▼─────┐  ┌─────▼──────┐
│ PostgreSQL  │  │   Redis   │  │   MinIO    │
│  (Database) │  │  (Cache)  │  │ (Storage)  │
└─────────────┘  └───────────┘  └────────────┘
       │               │               │
       └───────────────┼───────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐  ┌────▼──────┐
│   Stripe     │ │  INSEE   │  │  Google   │
│  (Payments)  │ │   API    │  │   APIs    │
└──────────────┘ └──────────┘  └───────────┘
```

## Application Details

### 1. ila26 App (Frontend)
- **Technology**: Next.js 14+, TypeScript, Shadcn/ui
- **Port**: 3000 (development)
- **Purpose**: Main multi-tenant application for users
- **Features**:
  - User registration/login
  - Enterprise profile management
  - Tenant switching
  - Subscription management
  - Mobility feature

### 2. ila26 API (Backend)
- **Technology**: NestJS 10+, Bun, TypeScript
- **Port**: 4000 (development)
- **Purpose**: User-facing API
- **Authentication**: User JWT tokens
- **Features**:
  - User authentication (Email, Google OAuth)
  - Enterprise CRUD operations
  - Tenant management
  - Subscription management
  - Payment processing (Stripe)
  - Invitation system
  - Mobility feature

### 3. Admin Portal (Frontend)
- **Technology**: Next.js 14+, TypeScript, Shadcn/ui
- **Port**: 3001 (development)
- **Purpose**: Administrative dashboard
- **Features**:
  - Enterprise management
  - Payment management
  - Settings (Activities, Specialities)
  - Admin authentication

### 4. Admin API (Backend)
- **Technology**: NestJS 10+, Bun, TypeScript
- **Port**: 4001 (development)
- **Purpose**: Admin-only API
- **Authentication**: Admin JWT tokens (separate system)
- **Features**:
  - Admin authentication
  - Enterprise management (CRUD, status updates)
  - Payment management
  - Settings management (Activities, Specialities)
  - Admin user management

## Shared Resources

### Database (PostgreSQL)
- **Shared Database**: Both APIs use the same PostgreSQL database
- **Schema**: Managed via Prisma
- **Shared Package**: `packages/shared/prisma` - Prisma schema and client
- **Access Control**: 
  - User API: Tenant-scoped queries
  - Admin API: Full access to all data

### Cache (Redis)
- **Shared Redis**: Both APIs use the same Redis instance
- **Namespace Separation**: Different key prefixes for user API vs admin API
- **Use Cases**:
  - Session storage
  - OTP storage
  - Rate limiting
  - Caching

### File Storage (MinIO)
- **Shared MinIO**: Both APIs use the same MinIO instance
- **Buckets**:
  - `ila26-logos`
  - `ila26-documents`
  - `ila26-covers`
- **Access Control**: API-level access control

### Shared Packages
- **`packages/shared/prisma`**: Prisma schema and generated client
- **`packages/shared/types`**: Shared TypeScript types
- **`packages/shared/utils`**: Shared utilities
- **`packages/shared/constants`**: Shared constants

## Authentication & Authorization

### User API Authentication
- **Method**: JWT tokens (access + refresh)
- **User Types**: Regular users
- **Token Structure**: User ID, email, tenant ID, role, permissions
- **Scopes**: Tenant-scoped operations

### Admin API Authentication
- **Method**: JWT tokens (separate secret, access + refresh)
- **User Types**: Admin users only
- **Token Structure**: Admin ID, email, role (admin/super_admin)
- **Scopes**: System-wide operations

### Complete Isolation
- **Different Token Secrets**: User API and Admin API use different JWT secrets
- **Different User Tables**: `users` vs `admin_users`
- **Different Auth Endpoints**: `/api/auth/*` vs `/api/admin/auth/*`
- **No Cross-Contamination**: Admin API cannot authenticate users, User API cannot authenticate admins

## Data Access Patterns

### User API Data Access
- **Tenant-Scoped**: All queries filtered by tenant
- **Row-Level Security**: Middleware enforces tenant isolation
- **User Permissions**: Role-based permissions within tenant
- **Read/Write**: Based on user role and permissions

### Admin API Data Access
- **System-Wide**: Full access to all data
- **No Tenant Filtering**: Can access all tenants
- **Admin Permissions**: Role-based (admin, super_admin)
- **Read/Write**: Full access (with permission checks)

## Communication Flow

### User Flow
```
User Browser
    ↓
ila26 App (Frontend)
    ↓
ila26 API (Backend) - Port 4000
    ↓
PostgreSQL / Redis / MinIO
```

### Admin Flow
```
Admin Browser
    ↓
Admin Portal (Frontend)
    ↓
Admin API (Backend) - Port 4001
    ↓
PostgreSQL / Redis / MinIO
```

## Project Structure

```
ila26Bis/
├── apps/
│   ├── api/              # ila26 User API (Backend)
│   │   ├── src/
│   │   ├── prisma/
│   │   └── package.json
│   │
│   ├── admin-api/        # Admin API (Backend)
│   │   ├── src/
│   │   ├── prisma/
│   │   └── package.json
│   │
│   ├── ila26/            # ila26 App (Frontend)
│   │   ├── src/
│   │   └── package.json
│   │
│   └── admin-portal/     # Admin Portal (Frontend)
│       ├── src/
│       └── package.json
│
├── packages/
│   ├── shared/
│   │   ├── prisma/       # Shared Prisma schema
│   │   ├── types/        # Shared TypeScript types
│   │   ├── utils/        # Shared utilities
│   │   └── constants/    # Shared constants
│   │
│   └── ...
│
├── docker-compose.yml    # Infrastructure services
└── package.json          # Root workspace
```

## Security Considerations

### API Isolation
- ✅ **Separate Authentication**: Different JWT secrets
- ✅ **Separate User Tables**: No shared authentication
- ✅ **Separate Endpoints**: `/api/*` vs `/api/admin/*`
- ✅ **Separate Deployment**: Can deploy independently

### Data Access
- ✅ **User API**: Tenant-scoped, permission-based
- ✅ **Admin API**: System-wide, role-based
- ✅ **Database**: Same database, different access patterns
- ✅ **Row-Level Security**: Enforced at API level

### Network Security
- ✅ **CORS**: Different origins for user app vs admin portal
- ✅ **Rate Limiting**: Separate limits for user API vs admin API
- ✅ **API Gateway**: Can route to different APIs based on path
- ✅ **Firewall Rules**: Can restrict admin API access

## Benefits of Separate APIs

### 1. Security
- Complete isolation between user and admin operations
- Different authentication systems
- No risk of admin endpoints being exposed to users

### 2. Scalability
- Can scale user API and admin API independently
- Different performance requirements
- Different traffic patterns

### 3. Maintainability
- Clear separation of concerns
- Easier to understand and maintain
- Different deployment schedules

### 4. Development
- Different teams can work on different APIs
- Independent versioning
- Independent testing

### 5. Flexibility
- Different frameworks if needed (future)
- Different deployment strategies
- Different monitoring and logging

## Deployment Architecture

### Development
```
User API:     localhost:4000
Admin API:    localhost:4001
User App:     localhost:3000
Admin Portal: localhost:3001
```

### Production
```
User API:     api.ila26.com (or subdomain)
Admin API:    admin-api.ila26.com (internal or VPN)
User App:     app.ila26.com
Admin Portal: admin.ila26.com
```

### Infrastructure
- **Same Infrastructure**: PostgreSQL, Redis, MinIO
- **Different Containers**: User API and Admin API in separate containers
- **Different Scaling**: Scale independently based on load
- **Different Monitoring**: Separate monitoring for each API

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Status**: Architecture Decision - Separate Backend APIs

