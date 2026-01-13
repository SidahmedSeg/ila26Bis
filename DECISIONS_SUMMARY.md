# ila26 Project - Key Decisions Summary

This document summarizes all key decisions made for the ila26 and ila26 Admin Portal projects.

---

## ✅ Authentication & Registration

### Email Registration
- **OTP Method**: Email-based (not SMS)
- **OTP Validity**: 10 minutes
- **Password Requirements**: 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (!@#$%^&*)

### Google OAuth Registration
- **Additional Data Required**: Full name, company name, SIRET/KBIS (all required)
- **Flow**: OAuth → Collect company info → Create account

---

## ✅ Multi-Tenant & Permissions

### Tenant Switching
- **UI Component**: Dropdown in header/navigation
- **Implementation**: Change active tenant context, reload relevant data

### Owner Role
- **Can Invite Users**: Yes
- **Can Assign Roles/Permissions**: Yes
- **Full Control**: Over own tenant

### Guest Permissions
- **Type**: Specific actions as per assigned permissions
- **Configurable**: Per tenant by owner
- **Details**: To be defined (specific permission types)

---

## ✅ Subscriptions & Payments

### Subscription Tiers
- **Free**: Basic features, limited access
- **Monthly Paid**: Full features
- **Yearly Paid**: Full features
- **Feature Differences**: To be defined (specific features/limits)

### Payment Methods
- **Storage**: Only tokens (Stripe Payment Method IDs)
- **PCI Compliance**: SAQ-A (simplified, Stripe handles card data)
- **Never Store**: Full card numbers, CVV codes

### Invoices
- **Generation**: Automatic via Stripe
- **Format**: Stripe default invoice with custom fields
- **Download**: PDF format

### Mobility Feature
- **Purpose**: Enable users to be invited to multiple tenants
- **Pricing**: To be defined (one-time or recurring)

---

## ✅ Enterprise Profile

### Basic Info Tab
- **SIRET/KBIS Validation**: Real-time validation with INSEE API
- **Activity Domain**: Admin-defined in Admin Portal
- **Speciality**: Admin-defined, hierarchical (depends on Activity Domain)

### Documents Tab
- **Categories**: Predefined list (managed in Admin Portal)

---

## ✅ Admin Portal

### Admin Users
- **Type**: Separate admin users (not regular users)
- **Creation**: Manual creation
- **Authentication**: Independent auth system

### Enterprise Status Management
- **Who Can Suspend/Activate**: Admin only
- **Status Triggers**: Payment issues (expired subscription, failed payment)

### Payment Page
- **Columns**: Date, amount, enterprise, status, invoice link, plan, transaction ID, etc.

### Settings
- **Activities**: Admin-defined, available for enterprise/user profiles
- **Specialities**: Admin-defined, hierarchical relationship with activities

---

## ✅ Technical Stack

### Database
- **Primary**: PostgreSQL
- **Cache**: Redis
- **ORM**: Prisma (recommended)

### File Storage
- **Solution**: Local MinIO (S3-compatible, self-hosted)
- **Buckets**: Separate buckets for logos, documents, cover images

### Email Service
- **Provider**: Mailtrap
- **Usage**: Development, testing, and production
- **Notifications**: 
  - User invitations
  - Payment confirmations
  - Payment failures
  - Subscription changes
  - Subscription renewals
  - OTP codes
  - Welcome emails

### Deployment
- **Infrastructure**: Elastic Metal (bare metal servers)
- **Alternative**: Cloud providers (AWS, GCP, Azure) if preferred
- **Containerization**: Docker
- **Orchestration**: Docker Compose or Kubernetes

### External APIs
- **INSEE API**: Real-time SIRET/KBIS validation
- **Google Places API**: Address autocomplete
- **Stripe API**: Payment processing, subscriptions

---

## ✅ Security & Compliance

### Payment Data
- **Storage**: Only Stripe tokens (Payment Method IDs)
- **PCI Compliance**: SAQ-A (simplified questionnaire)
- **Card Data**: Never stored, handled by Stripe

### Authentication
- **JWT Tokens**: Access + refresh tokens
- **Password Hashing**: bcrypt/argon2
- **OTP Security**: One-time use, time-limited

---

## ✅ Role-Based Access Control (RBAC) - FINALIZED

### Default Roles
- **Admin**: Full access to all features and settings
- **Member**: Standard user access
- **Viewer**: Read-only access

### Custom Roles
- **Creation**: Admin and Owner can create custom roles
- **Permission Assignment**: Per module with granular permissions
- **Permission Types**: 
  - **Read**: View/access the module
  - **Write**: Create, edit, delete in the module
- **Module Examples**: Enterprise Profile, Feature 1, Feature 2, Documents, Settings, etc.

### Role Assignment
- **Owner**: Automatically has Admin role in own tenant
- **Invited Guests**: Assigned a role (Admin, Member, Viewer, or Custom) by Owner/Admin
- **Tenant Members**: Assigned a role by Owner/Admin
- **Role per Tenant**: User can have different roles in different tenants

---

## ✅ Subscription Tiers - FINALIZED

### Free Plan
- **Max Users**: 1 user per tenant
- **Features**: Dynamic feature flags (features assigned to plan)
- **Billing**: Free

### Paid Tier 1
- **Max Users**: 3 users per tenant
- **Features**: Dynamic feature flags (features assigned to plan)
- **Billing**: Monthly or Yearly

### Paid Tier 2
- **Max Users**: 8 users per tenant
- **Features**: Dynamic feature flags (features assigned to plan)
- **Billing**: Monthly or Yearly

### Feature Flag System
- **Dynamic Features**: Features managed via feature flags
- **Plan Assignment**: Features can be assigned to specific plans dynamically
- **Flexibility**: Add/modify features per plan as product evolves
- **Implementation**: Feature flags stored in database, checked per tenant subscription

---

## ✅ Mobility Feature - FINALIZED

- **Pricing**: Recurring subscription (monthly or yearly)
- **Stripe Product**: Separate recurring subscription product
- **Effect**: Enables user to be invited to multiple tenants
- **Scope**: Per user, not per tenant

---

## 📋 Next Steps

1. ✅ ~~Define guest permission types in detail~~ - COMPLETED (RBAC system)
2. ✅ ~~Finalize subscription tier features and limits~~ - COMPLETED (Feature flags + user limits)
3. ✅ ~~Decide on Mobility feature pricing model~~ - COMPLETED (Recurring subscription)
4. Create detailed API specifications
5. Design complete database schema with Prisma
6. Set up development environment
7. Begin implementation

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Status**: Finalized Decisions

