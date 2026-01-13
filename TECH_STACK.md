# ila26 Tech Stack Recommendation

## Overview
This document recommends a production-ready, secure, and scalable tech stack for both ila26 and ila26 Admin Portal applications.

---

## Recommended Stack

### Frontend Applications

#### Option A: Next.js (React) - **RECOMMENDED**
**Why Next.js:**
- Server-side rendering (SSR) for better SEO and performance
- Built-in API routes (can simplify backend if needed)
- Excellent TypeScript support
- Great developer experience
- Strong ecosystem and community
- Built-in image optimization
- Easy deployment (Vercel, AWS, etc.)

**Tech Stack:**
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: 
  - **Shadcn/ui** (selected) - Modern, accessible, customizable, consistent design system
- **State Management**: 
  - **Zustand** (recommended) - Lightweight, simple
  - **Redux Toolkit** - If complex state needed
- **Forms**: React Hook Form + Zod (validation)
- **HTTP Client**: Axios or Fetch API
- **Authentication**: NextAuth.js (for Next.js) or custom JWT handling

#### Option B: Nuxt (Vue) - Alternative
**Why Nuxt:**
- Similar benefits to Next.js but for Vue ecosystem
- Great for teams familiar with Vue
- Excellent TypeScript support
- Strong performance

**Tech Stack:**
- **Framework**: Nuxt 3
- **Language**: TypeScript
- **UI Library**: 
  - **PrimeVue** - Enterprise components
  - **Vuetify** - Material Design
  - **Naive UI** - Modern, TypeScript-first
- **State Management**: Pinia
- **Forms**: VeeValidate + Yup/Zod
- **HTTP Client**: Axios

---

### Backend API

#### Option A: Bun with NestJS/Elysia - **RECOMMENDED**
**Why Bun:**
- **Fast Runtime**: 3-4x faster than Node.js
- **Built-in Tools**: Bundler, test runner, package manager
- **Native TypeScript**: No compilation needed
- **Node.js Compatible**: Works with most npm packages
- **Fast Startup**: Instant server startup
- **Better Performance**: Optimized for modern JavaScript

**Framework Options with Bun:**

**A1. NestJS with Bun** (Recommended for enterprise apps)
- **Framework**: NestJS 10+
- **Language**: TypeScript
- **Runtime**: Bun 1.0+
- **API Style**: RESTful API
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI (built-in)
- **Note**: NestJS works with Bun, compatibility verified

**A2. Elysia with Bun** (Alternative - Bun-native framework)
- **Framework**: Elysia (Bun-native, fastest)
- **Language**: TypeScript
- **Runtime**: Bun 1.0+
- **API Style**: RESTful API
- **Validation**: Built-in validation with type inference
- **Performance**: Fastest framework for Bun
- **Note**: Modern, Bun-optimized framework

**Tech Stack:**
- **Runtime**: Bun 1.0+
- **Language**: TypeScript (native support)
- **Package Manager**: Bun (instead of npm)
- **Build Tool**: Bun (built-in bundler)
- **Test Runner**: Bun (built-in test runner)

#### Option B: Bun with Hono - Lightweight Alternative
**Why Hono:**
- Ultra-fast, Bun-native framework
- Lightweight and minimal
- Excellent performance
- Type-safe routing
- Built for edge and serverless

**Tech Stack:**
- **Framework**: Hono
- **Runtime**: Bun 1.0+
- **Language**: TypeScript
- **Validation**: Built-in with Zod

#### Option C: Python with FastAPI - Alternative
**Why FastAPI:**
- Very fast (comparable to Node.js/Bun)
- Automatic API documentation
- Great for data-heavy applications
- Strong typing with Pydantic
- Excellent async support

**Tech Stack:**
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Validation**: Pydantic
- **Documentation**: Automatic OpenAPI/Swagger

---

### Database

#### Primary Database: PostgreSQL - **RECOMMENDED**
**Why PostgreSQL:**
- ACID compliant
- Excellent for multi-tenant (row-level security)
- Strong JSON support
- Excellent performance
- Mature and reliable
- Great tooling

**ORM/Query Builder:**
- **Prisma** (recommended) - Type-safe, excellent DX, migrations
- **TypeORM** - Mature, feature-rich
- **Drizzle ORM** - Lightweight, SQL-like

**Database Features to Use:**
- Row-Level Security (RLS) for tenant isolation
- JSON columns for flexible data
- Full-text search
- Triggers for audit logging

#### Cache: Redis
**Why Redis:**
- Fast in-memory cache
- Session storage
- Rate limiting
- Pub/Sub for real-time features
- Job queues (Bull/BullMQ)

**Use Cases:**
- Session storage
- OTP storage (with expiration)
- Rate limiting
- Frequently accessed data caching
- Tenant context caching

---

### Authentication & Security

#### JWT Library
- **Bun/Node.js**: `jsonwebtoken` or `@nestjs/jwt` (npm package, works with Bun)
- **Python**: `python-jose` or `PyJWT`

#### Password Hashing
- **Bun/Node.js**: `bcrypt` or `argon2` (npm packages, work with Bun)
- **Bun Native**: Bun's built-in `Bun.password` (bcrypt/scrypt) - Recommended
- **Python**: `passlib` with bcrypt or argon2

#### OAuth
- **Google OAuth**: `passport-google-oauth20` (npm package, works with Bun) or `google-auth-library`
- **NextAuth.js**: Built-in OAuth providers (for Next.js frontend)

#### Security Middleware
- **Helmet**: Security headers
- **CORS**: Configured for specific origins
- **Rate Limiting**: `express-rate-limit` or `@nestjs/throttler`
- **Input Validation**: Built into frameworks

---

### Payment Processing

#### Stripe Integration
- **SDK**: 
  - Bun/Node.js: `stripe` npm package (works with Bun via npm compatibility)
  - Python: `stripe` pip package
- **Webhooks**: Secure webhook handling with signature verification
- **Payment Methods**: Stripe Elements (frontend) or Stripe Checkout

**Recommended Approach:**
- Use Stripe Checkout for initial setup (simpler)
- Migrate to Stripe Elements for custom UI later

---

### File Storage

#### MinIO - **SELECTED (Local/Self-Hosted)**
**Why MinIO:**
- S3-compatible API
- Self-hosted (full control)
- High performance
- Scalable object storage
- Can be deployed on Elastic Metal
- Open source
- Perfect for on-premise or self-hosted infrastructure

**SDK:**
- Bun/Node.js: `@aws-sdk/client-s3` (npm package, S3-compatible, works with MinIO and Bun)
- Python: `boto3` (S3-compatible, works with MinIO)

**Deployment:**
- Deploy MinIO on Elastic Metal server
- Use MinIO Console for management
- Configure buckets for different file types (logos, documents, covers)
- Set up access policies and CORS

**Configuration:**
- Endpoint: `http://your-minio-server:9000` (or custom domain)
- Access Key & Secret Key: Generated during setup
- Buckets: `ila26-logos`, `ila26-documents`, `ila26-covers`

---

### External API Integrations

#### INSEE API
- **HTTP Client**: Axios or Fetch
- **Authentication**: API Key in headers
- **Caching**: Cache responses in Redis (SIRET data doesn't change often)

#### Google Places API
- **SDK**: `@react-google-maps/api` (React) or `@googlemaps/js-api-loader`
- **Authentication**: API Key
- **Rate Limiting**: Implement client-side and server-side

---

### Email Service

#### Mailtrap - **SELECTED**
**Why Mailtrap:**
- Excellent for development and testing
- Can be used for production
- Email testing and debugging
- Inbox preview
- API integration
- SMTP and API support

**SDK:**
- Bun/Node.js: `nodemailer` (npm package, works with Bun) with Mailtrap SMTP or `@mailtrap/client`
- Bun Native: Bun's built-in `Bun.serve` with SMTP or Mailtrap API
- Python: `smtplib` or Mailtrap API client

**Configuration:**
- SMTP: Use Mailtrap SMTP credentials
- API: Use Mailtrap API for programmatic sending
- Templates: Support for email templates

---

### Development Tools

#### Code Quality
- **Linting**: ESLint (JS/TS) or Ruff (Python)
- **Formatting**: Prettier (JS/TS) or Black (Python)
- **Type Checking**: TypeScript (strict mode)
- **Pre-commit Hooks**: Husky + lint-staged

#### Testing
- **Unit Tests**: 
  - **Bun**: Built-in test runner (fastest, recommended) or Jest/Vitest
  - Python: pytest
- **E2E Tests**: 
  - Playwright (recommended)
  - Cypress
- **API Tests**: Bun test runner (built-in) or Supertest (npm package, works with Bun)

---

### Infrastructure & DevOps

#### Containerization
- **Docker**: Multi-stage builds
- **Docker Compose**: Local development

#### Hosting Options

##### Option A: Elastic Metal (Bare Metal) - **SELECTED**
**Why Elastic Metal:**
- Full control over hardware
- High performance (no virtualization overhead)
- Cost-effective at scale
- Can host everything on same infrastructure
- Perfect for self-hosted MinIO
- Predictable performance

**Services on Elastic Metal:**
- **Application Server**: Docker containers (API + Frontend)
- **Database**: PostgreSQL (Docker or native installation)
- **Cache**: Redis (Docker or native installation)
- **Storage**: MinIO (self-hosted S3-compatible)
- **Load Balancer**: Nginx or Traefik
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: GitHub Actions with self-hosted runners

**Providers:**
- **Scaleway Elastic Metal**: European provider, good pricing
- **OVH Bare Metal**: European provider
- **Hetzner Dedicated**: Cost-effective
- **AWS EC2 Bare Metal**: If AWS ecosystem needed

##### Option B: Cloud Providers (Alternative)
**AWS:**
- ECS/EC2 for compute
- RDS PostgreSQL
- ElastiCache Redis
- S3 for storage
- CloudFront CDN

**DigitalOcean:**
- App Platform or Droplets
- Managed PostgreSQL
- Spaces (S3-compatible)
- Load Balancer

**Railway / Render:**
- Simpler deployment
- PostgreSQL included
- Automatic deployments

#### CI/CD
- **GitHub Actions** (recommended)
- **GitLab CI**
- **CircleCI**

**Pipeline Steps:**
1. Lint & Type Check
2. Run Tests
3. Build Docker Images
4. Deploy to Staging
5. Run E2E Tests
6. Deploy to Production (manual approval)

---

### Monitoring & Logging

#### Application Performance Monitoring (APM)
- **Sentry** (recommended) - Error tracking, performance monitoring
- **Datadog** - Full observability
- **New Relic** - Enterprise APM

#### Logging
- **Bun/Node.js**: `winston` (npm package, works with Bun) or Bun's built-in console
- **Python**: `structlog`
- **Centralized Logging**: 
  - AWS CloudWatch
  - Datadog
  - ELK Stack (Elasticsearch, Logstash, Kibana)

#### Analytics
- **User Analytics**: PostHog or Mixpanel
- **Business Metrics**: Custom dashboard (Grafana)

---

## Recommended Final Stack (Production-Ready)

### Frontend
```
ila26 App:
- Next.js 14+ (App Router)
- TypeScript
- Shadcn/ui or Ant Design
- Zustand (state management)
- React Hook Form + Zod
- Axios
- NextAuth.js (or custom JWT)

ila26 Admin Portal:
- Next.js 14+ (App Router)
- TypeScript
- Shadcn/ui (consistent with main app)
- Zustand
- React Hook Form + Zod
- Axios
- Custom Admin Auth
```

### Backend
```
API Server:
- Bun 1.0+ (Runtime)
- NestJS 10+ or Elysia (Framework)
- TypeScript (native support)
- PostgreSQL (Prisma ORM)
- Redis (cache & sessions)
- JWT (authentication)
- Stripe SDK (npm package)
- AWS SDK (S3, npm package)
- Mailtrap SDK (npm package)
- Bun (built-in test runner, bundler, package manager)
```

### Infrastructure
```
Hosting: Elastic Metal (Bare Metal)
- Docker containers (API + Frontend)
- PostgreSQL (Docker or native)
- Redis (Docker or native)
- MinIO (self-hosted S3-compatible storage)
- Nginx/Traefik (Load Balancer/Reverse Proxy)
- Prometheus + Grafana (monitoring)

Alternative: Cloud Provider
- AWS/GCP/Azure if cloud preferred
- Managed services available
```

### Development
```
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- ESLint + Prettier
- Bun (runtime, package manager, test runner, bundler)
- Playwright (E2E)
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CDN (CloudFront)                      │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌────────▼────────┐
│  ila26 App     │      │  Admin Portal   │
│  (Next.js)     │      │  (Next.js)      │
│  Vercel/AWS    │      │  Vercel/AWS     │
└───────┬────────┘      └────────┬────────┘
        │                        │
        └────────────┬───────────┘
                     │
        ┌────────────▼────────────┐
        │   API Server (NestJS)    │
        │   ECS/App Runner         │
        └────────────┬────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────┐    ┌──────▼──────┐  ┌────▼─────┐
│Postgres│    │    Redis    │  │    S3    │
│  (RDS) │    │ (ElastiCache)│  │          │
└────────┘    └─────────────┘  └──────────┘
                     │
        ┌────────────▼────────────┐
        │   External Services      │
        │  - Stripe                │
        │  - SendGrid             │
        │  - INSEE API            │
        │  - Google Places API    │
        └─────────────────────────┘
```

---

## Cost Estimation (Monthly - Rough)

### Development/Staging (Elastic Metal)
- **Elastic Metal Server (8GB RAM, 4 vCPU)**: ~$40-60
- **PostgreSQL**: Included (Docker)
- **Redis**: Included (Docker)
- **MinIO**: Included (Docker)
- **Mailtrap (Free tier)**: Free
- **Domain**: ~$10-15/year
- **Total**: ~$40-60/month

### Production (Small Scale - Elastic Metal)
- **Elastic Metal Server (16GB RAM, 8 vCPU)**: ~$80-120
- **PostgreSQL**: Included
- **Redis**: Included
- **MinIO**: Included
- **Mailtrap (Paid)**: ~$15-30
- **Sentry (Team)**: ~$26
- **Domain + SSL**: ~$10-15/year
- **Backup Storage**: ~$5-10
- **Total**: ~$130-190/month

### Production (Medium Scale - Elastic Metal)
- **Elastic Metal Server (32GB RAM, 16 vCPU)**: ~$150-250
- **PostgreSQL**: Included
- **Redis**: Included
- **MinIO**: Included
- **Mailtrap (Pro)**: ~$50-100
- **Sentry (Team)**: ~$26
- **Domain + SSL**: ~$10-15/year
- **Backup Storage**: ~$10-20
- **Load Balancer (if needed)**: ~$10-20
- **Total**: ~$250-420/month

**Note**: Elastic Metal provides significant cost savings compared to cloud managed services, especially at scale. All services run on the same server, reducing infrastructure costs.

---

## Security Checklist

- [ ] HTTPS everywhere (TLS 1.3)
- [ ] Environment variables for secrets
- [ ] Database encryption at rest
- [ ] Row-level security (PostgreSQL RLS)
- [ ] Rate limiting on all endpoints
- [ ] Input validation on all inputs
- [ ] SQL injection prevention (ORM/parameterized queries)
- [ ] XSS prevention (CSP headers)
- [ ] CORS properly configured
- [ ] JWT tokens with short expiration
- [ ] Secure password hashing (bcrypt/argon2)
- [ ] OAuth state parameter & PKCE
- [ ] Webhook signature verification (Stripe)
- [ ] Regular security audits
- [ ] Dependency scanning (Snyk, Dependabot)
- [ ] Secrets management (AWS Secrets Manager)

---

## Performance Optimization

### Frontend
- Code splitting
- Image optimization (Next.js Image)
- Lazy loading
- Service workers (PWA)
- CDN for static assets

### Backend
- Database indexing
- Query optimization
- Caching (Redis)
- Connection pooling
- Pagination on all lists
- Compression (gzip/brotli)

### Database
- Proper indexing
- Query analysis
- Read replicas (if needed)
- Connection pooling
- Vacuum and analyze regularly

---

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Load balancer (ALB)
- Auto-scaling groups
- Database read replicas

### Vertical Scaling
- Increase instance sizes
- Database instance upgrade
- Cache memory increase

### Future Considerations
- Microservices architecture (if needed)
- Message queue (RabbitMQ, AWS SQS)
- Event-driven architecture
- Caching layers (multiple levels)

---

## Getting Started

1. **Set up development environment**
   - Install Bun 1.0+ (replaces Node.js)
     - macOS/Linux: `curl -fsSL https://bun.sh/install | bash`
     - Windows: Use WSL or install from bun.sh
   - Install Docker, Docker Compose
   - Clone repository
   - Set up environment variables

2. **Initialize database**
   - Run Prisma migrations: `bunx prisma migrate dev`
   - Seed initial data: `bunx prisma db seed`

3. **Set up external services**
   - Stripe account
   - Mailtrap account (for email)
   - INSEE API key
   - Google Places API key

4. **Set up local MinIO (development)**
   - Run MinIO via Docker: `docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"`
   - Create buckets: `ila26-logos`, `ila26-documents`, `ila26-covers`
   - Get access keys from MinIO console

5. **Install dependencies**
   - `bun install` (instead of `npm install` - faster!)

6. **Run locally**
   - `docker-compose up` (PostgreSQL, Redis, MinIO)
   - `bun run dev` (Next.js apps - can use Bun or npm)
   - `bun run start:dev` (API server - Bun runtime)

6. **Deploy to Elastic Metal**
   - Provision Elastic Metal server
   - Install Docker and Docker Compose
   - Set up Nginx/Traefik as reverse proxy
   - Deploy via CI/CD or manual deployment
   - Configure MinIO on server
   - Set up SSL certificates (Let's Encrypt)
   - Configure monitoring (Prometheus + Grafana)

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Status**: Recommendation - Ready for Review

