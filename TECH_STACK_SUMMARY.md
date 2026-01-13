# ila26 Tech Stack - Summary

## Overview
Complete technology stack for ila26 and ila26 Admin Portal applications.

---

## Frontend Applications

### ila26 App (Main Application)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: Shadcn/ui or Ant Design
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Authentication**: NextAuth.js or custom JWT

### ila26 Admin Portal
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: Shadcn/ui (consistent with main app)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Authentication**: Custom Admin Auth (separate system)

---

## Backend API

### Runtime & Framework
- **Runtime**: Bun 1.0+ ⚡ (3-4x faster than Node.js)
- **Framework**: NestJS 10+ (or Elysia for Bun-native)
- **Language**: TypeScript (native support in Bun)
- **API Style**: RESTful API
- **Package Manager**: Bun (faster than npm)
- **Test Runner**: Bun (built-in)
- **Build Tool**: Bun (built-in bundler)

### Key Libraries
- **ORM**: Prisma
- **Validation**: class-validator + class-transformer (NestJS)
- **Documentation**: Swagger/OpenAPI (built-in with NestJS)
- **Authentication**: JWT (jsonwebtoken or @nestjs/jwt)
- **Password Hashing**: Bun's built-in password hashing or bcrypt/argon2
- **OAuth**: passport-google-oauth20 or google-auth-library

---

## Database & Cache

### Primary Database
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Features Used**:
  - Row-Level Security (RLS) for tenant isolation
  - JSON columns for flexible data
  - Full-text search capabilities

### Cache & Session Storage
- **Cache**: Redis
- **Use Cases**:
  - Session storage
  - OTP storage (with expiration)
  - Rate limiting
  - Frequently accessed data caching
  - Tenant context caching

---

## File Storage

- **Solution**: MinIO (S3-compatible, self-hosted)
- **Deployment**: Local/Elastic Metal server
- **Buckets**:
  - `ila26-logos` (enterprise logos)
  - `ila26-documents` (enterprise documents)
  - `ila26-covers` (profile cover images)
- **SDK**: AWS SDK (`@aws-sdk/client-s3` - S3-compatible, works with MinIO)

---

## External Services & APIs

### Payment Processing
- **Provider**: Stripe
- **Products**: 
  - Paid Tier 1 (Monthly/Yearly)
  - Paid Tier 2 (Monthly/Yearly)
  - Mobility Feature (recurring subscription)
- **SDK**: `stripe` (npm package, works with Bun)
- **Compliance**: PCI SAQ-A (tokens only, no card data stored)

### Email Service
- **Provider**: Mailtrap
- **Usage**: Development, testing, and production
- **SDK**: `nodemailer` with Mailtrap SMTP or `@mailtrap/client`
- **Notifications**:
  - User invitations
  - Payment confirmations
  - Subscription changes
  - OTP codes
  - Welcome emails

### External APIs
- **INSEE API**: Real-time SIRET/KBIS validation
- **Google Places API**: Address autocomplete
- **Google OAuth API**: User authentication

---

## Infrastructure & Deployment

### Hosting
- **Primary**: Elastic Metal (Bare Metal servers)
- **Services on Elastic Metal**:
  - Application Server (Docker containers)
  - PostgreSQL (Docker or native)
  - Redis (Docker or native)
  - MinIO (self-hosted S3-compatible)
  - Nginx/Traefik (Load Balancer/Reverse Proxy)
  - Prometheus + Grafana (monitoring)

### Alternative: Cloud Providers
- AWS, GCP, or Azure (if cloud preferred)
- Managed services available

### Containerization
- **Docker**: Multi-stage builds
- **Docker Compose**: Local development
- **Orchestration**: Docker Compose or Kubernetes

---

## Development Tools

### Code Quality
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript (strict mode)
- **Pre-commit Hooks**: Husky + lint-staged

### Testing
- **Unit Tests**: Bun test runner (built-in, fastest)
- **E2E Tests**: Playwright
- **API Tests**: Bun test runner or Supertest

### CI/CD
- **Platform**: GitHub Actions
- **Pipeline Steps**:
  1. Lint & Type Check
  2. Run Tests (Bun test)
  3. Build Docker Images
  4. Deploy to Staging
  5. Run E2E Tests
  6. Deploy to Production (manual approval)

---

## Monitoring & Logging

### Application Performance Monitoring (APM)
- **Tool**: Sentry
- **Features**: Error tracking, performance monitoring

### Logging
- **Tool**: Winston (npm package, works with Bun)
- **Centralized Logging**: Prometheus + Grafana (self-hosted on Elastic Metal)

### Analytics
- **User Analytics**: PostHog or Mixpanel (optional)
- **Business Metrics**: Custom Grafana dashboard

---

## Security

### Authentication
- **JWT**: Access tokens (15 min) + Refresh tokens (7 days)
- **Password Hashing**: Bun's built-in password hashing or bcrypt/argon2
- **OAuth**: Google OAuth with PKCE flow

### Data Security
- **Encryption at Rest**: Database encryption
- **Encryption in Transit**: HTTPS/TLS 1.3
- **PCI Compliance**: SAQ-A (Stripe handles card data)
- **Payment Data**: Only tokens stored (Stripe Payment Method IDs)

### API Security
- **Rate Limiting**: Implemented via Redis
- **CORS**: Configured for specific origins
- **Input Validation**: All inputs validated
- **SQL Injection Prevention**: Prisma ORM (parameterized queries)
- **XSS Prevention**: Content Security Policy headers

---

## Package Management

### Commands
| Task | Command |
|------|---------|
| Install dependencies | `bun install` |
| Add package | `bun add <package>` |
| Add dev dependency | `bun add -d <package>` |
| Run script | `bun run <script>` |
| Run file | `bun <file.ts>` |
| Test | `bun test` |
| Build | `bun build` |
| Prisma CLI | `bunx prisma <command>` |

---

## Quick Start Commands

### Development Setup
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Set up database
bunx prisma migrate dev
bunx prisma db seed

# Start services (Docker)
docker-compose up

# Run frontend
bun run dev

# Run backend API
bun run start:dev
```

### Production Build
```bash
# Build frontend
bun run build

# Build backend
bun build src/main.ts --outdir ./dist

# Run production
bun run start
```

---

## Tech Stack Summary Table

| Category | Technology | Version | Notes |
|----------|-----------|---------|-------|
| **Frontend Framework** | Next.js | 14+ | App Router |
| **Frontend Language** | TypeScript | Latest | Type-safe |
| **UI Library** | Shadcn/ui / Ant Design | Latest | Modern components |
| **State Management** | Zustand | Latest | Lightweight |
| **Runtime** | Bun | 1.0+ | 3-4x faster than Node.js |
| **Backend Framework** | NestJS | 10+ | Enterprise-grade |
| **Backend Language** | TypeScript | Latest | Native in Bun |
| **Database** | PostgreSQL | Latest | ACID compliant |
| **ORM** | Prisma | 5.0+ | Type-safe queries |
| **Cache** | Redis | Latest | In-memory cache |
| **File Storage** | MinIO | Latest | S3-compatible |
| **Payment** | Stripe | Latest | PCI compliant |
| **Email** | Mailtrap | Latest | SMTP/API |
| **Containerization** | Docker | Latest | Multi-stage builds |
| **Monitoring** | Sentry | Latest | Error tracking |
| **CI/CD** | GitHub Actions | Latest | Automated pipelines |

---

## Key Benefits of This Stack

### Performance
- ✅ **Bun Runtime**: 3-4x faster than Node.js
- ✅ **Next.js SSR**: Fast page loads
- ✅ **Redis Caching**: Fast data access
- ✅ **Built-in Tools**: Faster development cycles

### Developer Experience
- ✅ **TypeScript**: Type safety everywhere
- ✅ **Prisma**: Type-safe database queries
- ✅ **Bun Tools**: Single toolchain (runtime, bundler, test runner, package manager)
- ✅ **Hot Reload**: Fast development feedback

### Scalability
- ✅ **Multi-tenant Architecture**: Row-level security
- ✅ **Horizontal Scaling**: Stateless API design
- ✅ **Database Optimization**: Connection pooling, indexing
- ✅ **CDN Ready**: Static assets optimization

### Security
- ✅ **PCI SAQ-A**: Simplified compliance
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Input Validation**: All inputs validated
- ✅ **Tenant Isolation**: Database-level security

### Cost Efficiency
- ✅ **Elastic Metal**: Cost-effective hosting
- ✅ **Self-hosted Services**: MinIO, Redis, PostgreSQL
- ✅ **Open Source**: Most tools are open source
- ✅ **Scalable Pricing**: Pay for what you use

---

## Estimated Monthly Costs

### Development/Staging
- Elastic Metal Server: ~$40-60/month
- Mailtrap (Free tier): Free
- **Total**: ~$40-60/month

### Production (Small Scale)
- Elastic Metal Server: ~$80-120/month
- Mailtrap (Paid): ~$15-30/month
- Sentry (Team): ~$26/month
- **Total**: ~$130-190/month

### Production (Medium Scale)
- Elastic Metal Server: ~$150-250/month
- Mailtrap (Pro): ~$50-100/month
- Sentry (Team): ~$26/month
- **Total**: ~$250-420/month

---

## Next Steps

1. ✅ Tech stack defined
2. ✅ Infrastructure decided (Elastic Metal, MinIO, Mailtrap)
3. ✅ Runtime chosen (Bun)
4. ⏭️ Set up project structure
5. ⏭️ Configure development environment
6. ⏭️ Create database schema (Prisma)
7. ⏭️ Set up CI/CD pipeline
8. ⏭️ Begin implementation

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Status**: Final - Ready for Implementation

