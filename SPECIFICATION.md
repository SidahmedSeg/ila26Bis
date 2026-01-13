# ila26 & ila26 Admin Portal - Technical Specification Document

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Application 1: ila26 (Main Application)](#application-1-ila26-main-application)
4. [Application 2: ila26 Admin Portal](#application-2-ila26-admin-portal)
5. [Data Models](#data-models)
6. [Authentication & Authorization](#authentication--authorization)
7. [Payment & Subscription System](#payment--subscription-system)
8. [Multi-Tenant Architecture](#multi-tenant-architecture)
9. [API Integrations](#api-integrations)
10. [Security Requirements](#security-requirements)
11. [Performance Requirements](#performance-requirements)
12. [Deployment Architecture](#deployment-architecture)

---

## Overview

### Project Description
Two interconnected applications:
- **ila26**: Multi-tenant enterprise management platform with subscription-based access
- **ila26 Admin Portal**: Administrative dashboard for managing enterprises, payments, and system settings

### Key Features
- Multi-tenant architecture with user mobility across tenants
- Email and Google OAuth registration
- Subscription management (Free, Monthly Paid, Yearly Paid)
- Stripe payment integration
- Enterprise profile management
- Guest user invitations with role-based access
- Admin portal for enterprise and payment management

---

## System Architecture

### High-Level Architecture
```
┌─────────────────┐         ┌─────────────────┐
│   ila26 App     │         │  Admin Portal   │
│  (Multi-tenant) │         │   (Admin Only)  │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │                           │
┌────────▼────────┐      ┌──────────▼──────────┐
│  ila26 API      │      │  Admin API          │
│  (User API)     │      │  (Admin API)        │
│  NestJS + Bun   │      │  NestJS + Bun       │
└────────┬────────┘      └──────────┬──────────┘
         │                           │
         └───────────┬───────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼───┐    ┌──────▼──────┐  ┌─────▼─────┐
│  DB   │    │   Stripe    │  │  External │
│Postgres│   │   Payment   │  │   APIs    │
│ Redis │    └─────────────┘  │  - INSEE  │
│ MinIO │                     │  - Google│
└───────┘                     │  - Mailtrap│
                              └───────────┘
```

### Core Principles
- **Separation of Concerns**: 
  - Two distinct frontend applications
  - Two separate backend APIs (User API + Admin API)
  - Shared database and infrastructure
  - Shared packages for common code (Prisma, types, utilities)
- **Multi-Tenancy**: Row-level security with tenant isolation
- **User Identity**: Single user profile across all tenants
- **Scalability**: Stateless API design, horizontal scaling capability
- **Security**: Complete isolation between user API and admin API

---

## Application 1: ila26 (Main Application)

### 1.1 Registration Flow

#### 1.1.1 Email Registration Flow
```
1. User clicks "Register" → Selects "Email"
2. Enter email address → Send OTP via Email
3. Verify OTP (valid for 10 minutes)
4. Registration Form:
   - Full Name (required)
   - Company Name (required, with INSEE autocomplete)
   - SIRET/KBIS (required, validated via INSEE API in real-time)
   - Password (with strength validation: min 8 chars, uppercase, lowercase, number, special char)
   - Confirm Password
5. Submit → Create User Account
6. Provision Free Subscription Enterprise Tenant
7. Assign Owner Role to User
8. Redirect to Dashboard
```

#### 1.1.2 Google OAuth Registration Flow
```
1. User clicks "Register" → Selects "Google"
2. OAuth Flow:
   - Redirect to Google OAuth
   - User grants permissions
   - Receive: email, name, profile picture
3. Check if email exists:
   - If exists: Login and redirect
   - If new: Continue registration
4. Additional Information Form (REQUIRED):
   - Full Name (pre-filled from Google, editable)
   - Company Name (required, with INSEE autocomplete)
   - SIRET/KBIS (required, validated via INSEE API in real-time)
5. Submit → Create User Account (Google OAuth linked)
6. Provision Free Subscription Enterprise Tenant
7. Assign Owner Role to User
8. Redirect to Dashboard
```

#### 1.1.3 Password Validation Rules
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

### 1.2 Subscription Tiers

#### Free Subscription
- **Max Users**: 1 user per tenant
- **Features**: Dynamic feature flags (features assigned to plan)
- Access to personal account
- Basic enterprise settings (view only)
- Cannot invite users to other tenants
- Cannot be invited to other tenants (without Mobility)

#### Paid Subscription Tier 1 (Monthly/Yearly)
- **Max Users**: 3 users per tenant
- **Features**: Dynamic feature flags (features assigned to plan)
- Access to personal account
- Full enterprise tenant settings (create, edit, delete)
- Can invite users (if Mobility enabled)
- Can be invited to other tenants (if Mobility enabled)

#### Paid Subscription Tier 2 (Monthly/Yearly)
- **Max Users**: 8 users per tenant
- **Features**: Dynamic feature flags (features assigned to plan)
- Access to personal account
- Full enterprise tenant settings (create, edit, delete)
- Can invite users (if Mobility enabled)
- Can be invited to other tenants (if Mobility enabled)

#### Feature Flag System
- **Dynamic Features**: Features are managed via feature flags
- **Plan Assignment**: Features can be assigned to specific plans dynamically
- **Flexibility**: Add/modify features per plan as the product evolves
- **Implementation**: Feature flags stored in database, checked per tenant subscription

### 1.3 Enterprise Profile

#### Tab 1: Basic Info
- **Enterprise Name**: Read-only (set during registration)
- **SIRET**: Editable, validated via INSEE API in real-time
- **KBIS**: Editable, validated via INSEE API in real-time
- **Activity Domain**: Dropdown (from admin-defined list in Admin Portal)
- **Speciality**: Dropdown (filtered by selected Activity Domain, hierarchical relationship)

#### Tab 2: Enterprise Address
- **Address**: Google Places Autocomplete
- **Creation Date**: Read-only, auto-generated

#### Tab 3: Marketing
- **Enterprise Logo**: Image upload (max 5MB, formats: JPG, PNG, SVG)
- **Enterprise Profile Cover Image**: Image upload (max 10MB, formats: JPG, PNG)

#### Tab 4: Enterprise Documents
- **Document List**: Table view
  - Document Name
  - Category (from predefined list, managed in Admin Portal)
  - Upload Date
  - Actions (View, Download, Delete)
- **Upload Document**: Drag & drop or file picker

#### Tab 5: Subscription
- **Current Plan**: Display (Free/Monthly Paid/Yearly Paid)
- **Upgrade/Downgrade**: 
  - Upgrade: Show available plans
  - Downgrade: Confirmation modal
- **Payment History**: Table with:
  - Date
  - Amount
  - Status (Success/Failed/Pending)
  - Invoice Download (PDF)
- **Payment Method**: 
  - Display current method (masked card number)
  - Add/Edit payment method (Stripe Elements)
- **Next Planned Payment**: Display date and amount

### 1.4 Multi-Tenant & Mobility Feature

#### User-Tenant Relationship
- **One User Profile**: Single user identity across all tenants
- **Multiple Tenant Memberships**: User can belong to multiple tenants
- **Role per Tenant**: User has different roles in different tenants
  - Owner (own tenant)
  - Guest (invited tenant)

#### Tenant Switching
- **UI Component**: Dropdown in header/navigation
- **Display**: Current tenant name, dropdown with all accessible tenants
- **Switch Action**: Change active tenant context, reload relevant data

#### Invitation Flow
```
1. Owner/Admin (User B - Tenant B - Paid) invites User A (Tenant A - Free)
   - Check tenant user limit (based on subscription tier)
   - Owner/Admin can invite users and assign roles
2. System checks:
   - If User A has Mobility feature: Allow invitation
   - If User A doesn't have Mobility: Show upgrade prompt
   - If tenant has reached max users: Show upgrade prompt
3. Owner/Admin assigns role to invited user:
   - Select from: Admin, Member, Viewer, or Custom Role
4. Send invitation email to User A (email notification)
5. User A accepts invitation
6. Create TenantMembership record:
   - user_id: User A
   - tenant_id: Tenant B
   - role_id: Selected role (Admin/Member/Viewer/Custom)
   - invited_by: User B
   - invited_at: Current timestamp
7. User A can now switch between Tenant A and Tenant B via dropdown
8. User A's access is determined by assigned role permissions
```

#### Mobility Feature (Stripe Product)
- **Activation**: User purchases Mobility feature via Stripe
- **Effect**: Enables user to be invited to multiple tenants
- **Billing**: Recurring subscription
- **Scope**: Per user, not per tenant
- **Stripe Product**: Separate recurring subscription product

### 1.5 Role-Based Access Control (RBAC)

#### Default Roles
1. **Admin**: Full access to all features and settings
2. **Member**: Standard user access (permissions to be defined)
3. **Viewer**: Read-only access (permissions to be defined)

#### Custom Roles
- **Creation**: Admin and Owner can create custom roles
- **Permission Assignment**: Per module, with granular permissions
- **Permission Types**: 
  - **Read**: View/access the module
  - **Write**: Create, edit, delete in the module
- **Module Examples**:
  - Enterprise Profile: Read, Write
  - Feature 1: Read, Write
  - Feature 2: Read, Write
  - Documents: Read, Write
  - Settings: Read, Write
  - (Additional modules as product evolves)

#### Role Assignment
- **Owner**: Automatically has Admin role in own tenant
- **Invited Guests**: Assigned a role (Admin, Member, Viewer, or Custom Role) by Owner/Admin
- **Tenant Members**: Assigned a role by Owner/Admin
- **Role per Tenant**: User can have different roles in different tenants

#### Role Management UI
- **Role List**: View all roles (default + custom)
- **Create Custom Role**: 
  - Role name
  - Select permissions per module (Read/Write checkboxes)
- **Edit Role**: Modify permissions
- **Delete Role**: Remove custom role (with confirmation)
- **Assign Role**: Assign role to users (members or guests)

---

## Application 2: ila26 Admin Portal

### 2.1 Authentication
- **Separate Auth System**: Independent from ila26 app
- **Admin Users**: Separate admin users, created manually (not regular users)
- **Access Control**: Admin role required for all pages
- **AdminUser Model**: Separate table with independent authentication

### 2.2 Enterprise Management Page

#### Table Columns
- **Name**: Enterprise name
- **Registration Date**: When tenant was created
- **Owner Name**: Full name of tenant owner
- **Owner Email**: Email of tenant owner
- **SIRET**: Enterprise SIRET number
- **Status**: 
  - Active (default)
  - Suspended (admin action only)
  - Not Active (triggered by payment issues: subscription expired/cancelled, payment failed)
- **Payment Status**: 
  - Paid
  - Unpaid
  - Past Due
  - Free

#### Features
- **Search**: By name, email, SIRET
- **Filters**: 
  - By Activity Domain
  - By Speciality
  - By Status
  - By Payment Status
- **Actions**: 
  - View Details
  - Suspend/Activate
  - View Payments

### 2.3 Enterprise Details Page

#### Tabs (Inherited from Enterprise Profile)
- Basic Info
- Enterprise Address
- Marketing
- Enterprise Documents
- Subscription

#### Additional Admin Features
- **Admin Actions**:
  - Suspend/Activate Enterprise (admin only)
  - Force subscription change
  - View payment history
  - Impersonate user (optional, for support)
  - **Note**: Audit logging not implemented in initial version

### 2.4 Payment Management Page

#### Table Columns
- **Date**: Payment date
- **Enterprise**: Enterprise name
- **Owner Email**: Owner email
- **Amount**: Payment amount with currency
- **Status**: Success/Failed/Pending/Refunded
- **Payment Method**: Last 4 digits of card
- **Invoice**: Download link (PDF)
- **Plan**: Subscription plan name (Free/Monthly Paid/Yearly Paid)
- **Transaction ID**: Stripe transaction ID
- **Other fields**: Additional fields as needed

#### Features
- **Search**: By enterprise name, email, transaction ID
- **Filters**: 
  - By Date Range
  - By Status
  - By Amount Range
  - By Enterprise
- **Export**: CSV/Excel export
- **Actions**: 
  - View Details
  - Download Invoice
  - Refund (if applicable)

### 2.5 Settings Page

#### Tab 1: Specialities
- **List**: All available specialities (admin-defined)
- **Actions**: 
  - Create new speciality
  - Edit existing
  - Delete (with confirmation)
  - Link to Activity Domain (hierarchical relationship)
- **Fields**: 
  - Name
  - Description
  - Associated Activity Domain (required, hierarchical)
- **Usage**: Available for enterprise and user profile selection

#### Tab 2: Activities
- **List**: All available activity domains (admin-defined)
- **Actions**: 
  - Create new activity
  - Edit existing
  - Delete (with confirmation)
- **Fields**: 
  - Name
  - Description
  - Code (optional)
- **Usage**: Available for enterprise and user profile selection

---

## Data Models

### Core Entities

#### User
```yaml
id: UUID (Primary Key)
email: String (Unique, Indexed)
password_hash: String (nullable, for OAuth users)
full_name: String
google_oauth_id: String (nullable)
email_verified: Boolean
email_verified_at: DateTime (nullable)
created_at: DateTime
updated_at: DateTime
```

#### Tenant (Enterprise)
```yaml
id: UUID (Primary Key)
name: String
siret: String (Unique, Indexed)
kbis: String (nullable)
activity_domain_id: UUID (Foreign Key)
speciality_id: UUID (Foreign Key, nullable)
address: JSON (Google Places data)
creation_date: DateTime
logo_url: String (nullable)
cover_image_url: String (nullable)
subscription_id: UUID (Foreign Key)
status: Enum (active, suspended, not_active)
created_at: DateTime
updated_at: DateTime
```

#### TenantMembership
```yaml
id: UUID (Primary Key)
user_id: UUID (Foreign Key)
tenant_id: UUID (Foreign Key)
role_id: UUID (Foreign Key) - References Role
is_owner: Boolean (default: false) - True if user owns the tenant
invited_by: UUID (Foreign Key, nullable)
invited_at: DateTime (nullable)
created_at: DateTime
updated_at: DateTime
Unique Constraint: (user_id, tenant_id)
```

#### Role
```yaml
id: UUID (Primary Key)
tenant_id: UUID (Foreign Key, nullable) - null for default roles
name: String (e.g., "Admin", "Member", "Viewer", or custom name)
is_default: Boolean (default: false) - True for Admin, Member, Viewer
is_system: Boolean (default: false) - True for system default roles
description: String (nullable)
created_by: UUID (Foreign Key, nullable)
created_at: DateTime
updated_at: DateTime
```

#### RolePermission
```yaml
id: UUID (Primary Key)
role_id: UUID (Foreign Key)
module: String (e.g., "enterprise_profile", "feature_1", "documents")
permission: Enum (read, write)
created_at: DateTime
Unique Constraint: (role_id, module, permission)
```

#### Subscription
```yaml
id: UUID (Primary Key)
tenant_id: UUID (Foreign Key)
plan_tier: Enum (free, paid_tier_1, paid_tier_2)
billing_period: Enum (monthly, yearly) - nullable for free
stripe_subscription_id: String (nullable)
stripe_customer_id: String
max_users: Integer (1 for free, 3 for tier_1, 8 for tier_2)
status: Enum (active, cancelled, past_due, unpaid)
current_period_start: DateTime
current_period_end: DateTime
cancel_at_period_end: Boolean
created_at: DateTime
updated_at: DateTime
```

#### Payment
```yaml
id: UUID (Primary Key)
tenant_id: UUID (Foreign Key)
subscription_id: UUID (Foreign Key)
stripe_payment_intent_id: String
stripe_invoice_id: String
amount: Decimal
currency: String (default: EUR)
status: Enum (succeeded, failed, pending, refunded)
payment_method: String (last 4 digits)
invoice_url: String (nullable)
paid_at: DateTime (nullable)
created_at: DateTime
```

#### UserFeature (Mobility)
```yaml
id: UUID (Primary Key)
user_id: UUID (Foreign Key)
feature_type: Enum (mobility)
stripe_product_id: String
stripe_subscription_id: String (required - recurring subscription)
status: Enum (active, cancelled, past_due, expired)
current_period_start: DateTime
current_period_end: DateTime
cancel_at_period_end: Boolean
activated_at: DateTime
created_at: DateTime
updated_at: DateTime
```

#### FeatureFlag
```yaml
id: UUID (Primary Key)
name: String (Unique) - e.g., "advanced_analytics", "api_access"
description: String (nullable)
is_active: Boolean (default: true)
created_at: DateTime
updated_at: DateTime
```

#### PlanFeature
```yaml
id: UUID (Primary Key)
plan_tier: Enum (free, paid_tier_1, paid_tier_2)
feature_flag_id: UUID (Foreign Key)
is_enabled: Boolean (default: true)
created_at: DateTime
updated_at: DateTime
Unique Constraint: (plan_tier, feature_flag_id)
```

#### Document
```yaml
id: UUID (Primary Key)
tenant_id: UUID (Foreign Key)
name: String
category_id: UUID (Foreign Key) - References DocumentCategory
file_url: String
file_size: Integer
mime_type: String
uploaded_by: UUID (Foreign Key)
created_at: DateTime
updated_at: DateTime
```

#### ActivityDomain
```yaml
id: UUID (Primary Key)
name: String
code: String (nullable)
description: String (nullable)
created_at: DateTime
updated_at: DateTime
```

#### Speciality
```yaml
id: UUID (Primary Key)
name: String
description: String (nullable)
activity_domain_id: UUID (Foreign Key)
created_at: DateTime
updated_at: DateTime
```

#### OTP
```yaml
id: UUID (Primary Key)
email: String (Indexed)
code: String (hashed)
expires_at: DateTime
used: Boolean
created_at: DateTime
```

#### AdminUser
```yaml
id: UUID (Primary Key)
email: String (Unique, Indexed)
password_hash: String
role: Enum (super_admin, admin)
last_login_at: DateTime (nullable)
created_at: DateTime
updated_at: DateTime
```

#### DocumentCategory
```yaml
id: UUID (Primary Key)
name: String (Unique)
description: String (nullable)
created_at: DateTime
updated_at: DateTime
```

---

## Authentication & Authorization

### ila26 App Authentication

#### Email/Password Auth
- JWT tokens (access + refresh)
- Password hashing: bcrypt/argon2
- Session management: stateless JWT

#### Google OAuth
- OAuth 2.0 flow
- Store OAuth tokens securely
- Link OAuth account to user record

#### Token Structure
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "tenant_id": "uuid (current active tenant)",
  "role": "owner|guest",
  "permissions": ["permission1", "permission2"],
  "exp": 1234567890
}
```

### Admin Portal Authentication

#### Separate Auth System
- Independent user table (AdminUser)
- Different JWT secret
- Admin-specific roles and permissions

#### AdminUser Model
```yaml
id: UUID (Primary Key)
email: String (Unique, Indexed)
password_hash: String
role: Enum (super_admin, admin)
created_at: DateTime
updated_at: DateTime
last_login_at: DateTime (nullable)
```

### Authorization

#### Role-Based Access Control (RBAC)
- **Default Roles**: Admin, Member, Viewer (system-defined)
- **Custom Roles**: Admin and Owner can create custom roles with specific permissions
- **Permission Granularity**: Per module (Read/Write permissions)
- **Role Assignment**: Owner/Admin assigns roles to members and guests
- **Permission Checking**: Check role permissions on each API request
- **Tenant Isolation**: Permissions scoped per tenant

---

## Payment & Subscription System

### Stripe Integration

#### Products
1. **Paid Tier 1 - Monthly**: Recurring monthly payment (3 users max)
2. **Paid Tier 1 - Yearly**: Recurring yearly payment (3 users max)
3. **Paid Tier 2 - Monthly**: Recurring monthly payment (8 users max)
4. **Paid Tier 2 - Yearly**: Recurring yearly payment (8 users max)
5. **Mobility Feature**: Recurring subscription (monthly or yearly)

#### Webhooks
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `payment_intent.succeeded`
- `payment_intent.failed`

#### Payment Flow
```
1. User selects subscription plan
2. Create/Update Stripe Customer
3. Create Stripe Subscription
4. Redirect to Stripe Checkout (or use Stripe Elements)
5. User completes payment
6. Webhook receives confirmation
7. Update subscription status in DB
8. Grant access to features
```

#### Invoice Generation
- **Automatic**: Generated automatically on payment via Stripe
- **Format**: Stripe default invoice with custom fields
- **Storage**: Store invoice URL in Payment record
- **Download**: PDF download via Stripe API

---

## Multi-Tenant Architecture

### Tenant Isolation Strategy

#### Row-Level Security
- All tenant-scoped queries include `tenant_id` filter
- Middleware validates tenant access
- Database-level constraints where possible

#### Data Isolation
- User data: Scoped by user_id
- Tenant data: Scoped by tenant_id
- Cross-tenant queries: Only via explicit TenantMembership

### Tenant Context
- Current tenant stored in JWT token
- Tenant switcher updates token (or session)
- API requests include tenant context

---

## API Integrations

### INSEE API (SIRET/KBIS Validation)
- **Endpoint**: https://api.insee.fr/entreprises/sirene/V3
- **Authentication**: API Key
- **Usage**: 
  - Real-time validation of SIRET on registration and updates
  - Real-time validation of KBIS
  - Auto-complete company name from SIRET
  - Verify KBIS information in real-time

### Google Places API
- **Endpoint**: Google Places Autocomplete
- **Authentication**: API Key
- **Usage**: Address autocomplete in Enterprise Address tab

### Stripe API
- **Endpoints**: Multiple (Customers, Subscriptions, Payments, Webhooks)
- **Authentication**: Secret Key + Webhook Secret
- **Usage**: Payment processing, subscription management
- **Payment Methods**: Store only tokens (Payment Method IDs), not card numbers
- **PCI Compliance**: SAQ-A (simplified) - Stripe handles card data

---

## Security Requirements

### Data Security
- **Encryption at Rest**: Database encryption
- **Encryption in Transit**: HTTPS/TLS 1.3
- **Password Storage**: Bcrypt/Argon2 hashing
- **Sensitive Data**: PCI-DSS compliance for payment data

### API Security
- **Rate Limiting**: Prevent abuse
- **CORS**: Configured for specific origins
- **Input Validation**: All inputs validated and sanitized
- **SQL Injection Prevention**: Parameterized queries
- **XSS Prevention**: Content Security Policy

### Authentication Security
- **JWT Expiration**: Short-lived access tokens (15 min), longer refresh tokens (7 days)
- **OTP Security**: One-time use, time-limited (10 min)
- **OAuth Security**: State parameter, PKCE flow

### Access Control
- **Tenant Isolation**: Enforced at API and database level
- **Role-Based Access**: Permissions checked on each request
- **Audit Logging**: Not implemented in initial version

---

## Performance Requirements

### Response Times
- **API Response**: < 200ms (p95)
- **Page Load**: < 2s (first contentful paint)
- **Database Queries**: < 100ms (p95)

### Scalability
- **Horizontal Scaling**: Stateless API design
- **Database**: Read replicas for read-heavy operations
- **Caching**: Redis for session data, frequently accessed data
- **CDN**: Static assets (images, documents)

### Optimization
- **Database Indexing**: On foreign keys, frequently queried fields
- **Pagination**: All list endpoints paginated
- **Lazy Loading**: Load data on demand
- **Image Optimization**: Compress and resize images

---

## Deployment Architecture

### Recommended Stack (To Be Detailed)

#### Frontend
- **Framework**: React/Next.js or Vue/Nuxt
- **State Management**: Redux/Zustand or Pinia
- **UI Library**: Material-UI, Ant Design, or Tailwind CSS
- **Forms**: React Hook Form or VeeValidate

#### Backend
- **Framework**: Node.js (Express/NestJS) or Python (FastAPI/Django)
- **Database**: PostgreSQL (primary), Redis (cache)
- **ORM**: Prisma, TypeORM, or SQLAlchemy

#### Infrastructure
- **Hosting**: Elastic Metal (bare metal servers) or cloud provider (AWS, GCP, Azure)
- **Containerization**: Docker
- **Orchestration**: Kubernetes or Docker Compose
- **CI/CD**: GitHub Actions, GitLab CI, or CircleCI
- **File Storage**: Local MinIO (S3-compatible object storage)
- **Email Service**: Mailtrap (for development/testing, can be used for production)

#### Monitoring & Logging
- **APM**: New Relic, Datadog, or Sentry
- **Logging**: ELK Stack or CloudWatch
- **Monitoring**: Prometheus + Grafana

---

## Email Notifications

### Events Triggering Email Notifications
- **User Invitations**: When a user is invited to a tenant
- **Payment Confirmations**: When payment succeeds
- **Payment Failures**: When payment fails
- **Subscription Changes**: When subscription is upgraded/downgraded/cancelled
- **Subscription Renewals**: Upcoming renewal reminders
- **OTP Codes**: Email verification codes
- **Welcome Emails**: After successful registration

### Email Service
- **Provider**: Mailtrap
- **Usage**: Development, testing, and production
- **Templates**: Customizable email templates for each event type

---

## Finalized Decisions

### Authentication & Registration
1. ✅ **Google Registration**: Collects full name, company name, SIRET/KBIS (all required)
2. ✅ **OTP Verification**: Email-based, 10 minutes validity
3. ✅ **Password Requirements**: Minimum 8 chars, uppercase, lowercase, number, special char

### Multi-Tenant & Mobility
4. ✅ **Guest Permissions**: Specific actions as per assigned permissions (configurable per tenant)
5. ✅ **Tenant Switching**: Dropdown UI component
6. ✅ **Owner Role**: Can invite users and assign roles/permissions

### Payments & Subscriptions
7. ✅ **Subscription Tiers**: Feature and limit differences (specifics to be defined)
8. ✅ **Invoice Generation**: Automatic, Stripe default invoice with custom fields, PDF format
9. ✅ **Payment Methods**: Store only tokens (Stripe Payment Method IDs), PCI SAQ-A compliance

### Enterprise Profile
10. ✅ **Activity Domain & Speciality**: Admin-defined in Admin Portal, hierarchical relationship (speciality depends on domain)
11. ✅ **Document Categories**: Predefined list (managed in Admin Portal)
12. ✅ **KBIS/SIRET Validation**: Real-time validation with INSEE API

### Admin Portal
13. ✅ **Admin Access**: Separate admin users (not regular users), created manually
14. ✅ **Enterprise Status**: Admin only can suspend/activate, triggered by payment issues
15. ✅ **Payment Page Columns**: Date, amount, enterprise, status, invoice link, plan, transaction ID, etc.

### Technical Preferences
16. ✅ **Deployment**: Elastic Metal (bare metal) or cloud provider
17. ✅ **Database**: PostgreSQL
18. ✅ **Email Service**: Mailtrap
19. ✅ **File Storage**: Local MinIO (S3-compatible)

### Additional Features
20. ✅ **Email Notifications**: Yes, for invitations, payment confirmations, subscription changes
21. ✅ **Audit Logging**: Not implemented in initial version

### Role-Based Access Control (RBAC) - FINALIZED
- **Default Roles**: Admin, Member, Viewer
- **Custom Roles**: Admin and Owner can create custom roles
- **Permission System**: Per module (e.g., Enterprise Profile, Feature 1, Feature 2)
- **Permission Types**: Read, Write per module
- **Role Assignment**: Owner/Admin assigns roles to members and invited guests
- **Role per Tenant**: User can have different roles in different tenants

### Subscription Tiers - FINALIZED
- **Free Plan**: 
  - Max Users: 1
  - Features: Dynamic feature flags
- **Paid Tier 1**: 
  - Max Users: 3
  - Features: Dynamic feature flags
  - Billing: Monthly or Yearly
- **Paid Tier 2**: 
  - Max Users: 8
  - Features: Dynamic feature flags
  - Billing: Monthly or Yearly
- **Feature Flag System**: Dynamic feature assignment per plan, flexible for future additions

### Mobility Feature - FINALIZED
- **Pricing**: Recurring subscription (monthly or yearly)
- **Stripe Product**: Separate recurring subscription product
- **Effect**: Enables user to be invited to multiple tenants

---

## Next Steps

1. **Review this specification** and provide answers to open questions
2. **Define guest permissions** in detail
3. **Finalize subscription tier features**
4. **Choose tech stack** based on team expertise
5. **Set up project structure** and development environment
6. **Create detailed API specifications**
7. **Design database schema** with migrations
8. **Set up CI/CD pipeline**

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Status**: Draft - Awaiting Review

