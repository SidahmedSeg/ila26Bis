# ila26 - User Flows Documentation

This document details the complete user flows for registration, login, and mobility features.

---

## Table of Contents
1. [User Registration Flow](#1-user-registration-flow)
2. [User Login Flow](#2-user-login-flow)
3. [Mobility Feature Flow](#3-mobility-feature-flow)

---

## 1. User Registration Flow

### 1.1 Email Registration Flow

#### Step-by-Step Process

```
┌─────────────┐
│  User lands │
│  on /register│
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Select "Email"  │
│ registration    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Enter Email     │
│ Click "Send OTP"│
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: POST /api/auth/send-otp│
│ - Validate email format          │
│ - Check if email exists          │
│ - Generate 6-digit OTP           │
│ - Hash OTP (bcrypt)              │
│ - Store in OTP table             │
│   - email                        │
│   - hashed_code                  │
│   - expires_at (now + 10 min)    │
│   - used: false                  │
│ - Send email via Mailtrap        │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│ Email sent      │
│ Show OTP input  │
│ field           │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ User enters OTP│
│ Click "Verify"  │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: POST /api/auth/verify-otp│
│ - Find OTP by email              │
│ - Check if expired               │
│ - Check if already used          │
│ - Verify OTP code                │
│ - Mark OTP as used               │
│ - Return success + session token │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│ Show Registration│
│ Form             │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Registration Form Fields:        │
│ - Full Name (required)           │
│ - Company Name (required)       │
│   └─> INSEE autocomplete        │
│ - SIRET (required)              │
│   └─> Real-time INSEE validation│
│ - KBIS (required)               │
│   └─> Real-time INSEE validation│
│ - Password (required)            │
│   └─> Strength validation       │
│ - Confirm Password (required)   │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ User clicks "Register"          │
│ Frontend validates:             │
│ - All fields filled              │
│ - Password matches               │
│ - Password strength              │
│ - SIRET/KBIS valid              │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: POST /api/auth/register│
│ 1. Validate all inputs           │
│ 2. Check if email already exists │
│ 3. Validate SIRET via INSEE API │
│ 4. Validate KBIS via INSEE API  │
│ 5. Hash password (bcrypt)        │
│ 6. Create User:                  │
│    - email                       │
│    - password_hash               │
│    - full_name                   │
│    - email_verified: true        │
│    - email_verified_at: now      │
│ 7. Create Stripe Customer        │
│ 8. Create Tenant (Enterprise):   │
│    - name: company_name          │
│    - siret                       │
│    - kbis                        │
│    - owner_id: user.id           │
│    - status: active              │
│ 9. Create Free Subscription:     │
│    - tenant_id                   │
│    - plan_tier: free             │
│    - max_users: 1                │
│    - status: active              │
│ 10. Create TenantMembership:    │
│     - user_id                    │
│     - tenant_id                  │
│     - role_id: Admin (default)   │
│     - is_owner: true             │
│ 11. Generate JWT tokens          │
│ 12. Return:                     │
│     - access_token               │
│     - refresh_token              │
│     - user data                  │
│     - tenant data                │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│ Redirect to     │
│ Dashboard       │
│ Store tokens    │
│ in localStorage │
└─────────────────┘
```

#### API Endpoints

**POST /api/auth/send-otp**
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "OTP sent to email",
  "expiresIn": 600
}
```

**POST /api/auth/verify-otp**
```json
Request:
{
  "email": "user@example.com",
  "code": "123456"
}

Response:
{
  "success": true,
  "message": "OTP verified",
  "sessionToken": "temp_session_token",
  "expiresAt": "2024-01-01T12:10:00Z"
}
```

**POST /api/auth/register**
```json
Request:
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "companyName": "Acme Corp",
  "siret": "12345678901234",
  "kbis": "KBIS123456",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "sessionToken": "temp_session_token"
}

Response:
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "emailVerified": true
  },
  "tenant": {
    "id": "uuid",
    "name": "Acme Corp",
    "siret": "12345678901234"
  },
  "tokens": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### Error Handling

- **Email already exists**: Return error, suggest login
- **Invalid OTP**: Show error message, allow retry
- **Expired OTP**: Show error, allow resend
- **Invalid SIRET/KBIS**: Show validation error from INSEE API
- **Weak password**: Show password requirements
- **Network errors**: Show retry option

---

### 1.2 Google OAuth Registration Flow

#### Step-by-Step Process

```
┌─────────────┐
│  User lands │
│  on /register│
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Select "Google" │
│ registration    │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Frontend: Initiate Google OAuth │
│ Redirect to Google OAuth        │
│ - client_id                     │
│ - redirect_uri                   │
│ - scope: email profile           │
│ - state: random_token            │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│ User grants     │
│ permissions on  │
│ Google          │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Google redirects to:            │
│ /api/auth/google/callback        │
│ - code: authorization_code      │
│ - state: random_token           │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: GET /api/auth/google/  │
│          callback               │
│ 1. Verify state token           │
│ 2. Exchange code for tokens     │
│ 3. Get user info from Google:   │
│    - email                      │
│    - name                       │
│    - picture                    │
│    - google_id                  │
│ 4. Check if user exists:        │
│    - If exists: Login flow      │
│    - If new: Continue           │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│ Show Additional │
│ Info Form       │
│ (Pre-filled)    │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Additional Info Form:           │
│ - Full Name (pre-filled, editable)│
│ - Company Name (required)       │
│   └─> INSEE autocomplete        │
│ - SIRET (required)              │
│   └─> Real-time INSEE validation│
│ - KBIS (required)               │
│   └─> Real-time INSEE validation│
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ User clicks "Complete           │
│ Registration"                   │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: POST /api/auth/register│
│          /google                 │
│ 1. Validate inputs              │
│ 2. Validate SIRET/KBIS          │
│ 3. Create User:                 │
│    - email (from Google)         │
│    - full_name                  │
│    - google_oauth_id            │
│    - email_verified: true       │
│    - email_verified_at: now      │
│ 4. Create Stripe Customer       │
│ 5. Create Tenant                │
│ 6. Create Free Subscription     │
│ 7. Create TenantMembership     │
│    (Owner role)                 │
│ 8. Generate JWT tokens          │
│ 9. Return user + tenant + tokens│
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│ Redirect to     │
│ Dashboard       │
└─────────────────┘
```

#### API Endpoints

**GET /api/auth/google**
```json
Response:
Redirect to Google OAuth URL
```

**GET /api/auth/google/callback**
```json
Query Params:
{
  "code": "authorization_code",
  "state": "random_token"
}

Response (if new user):
{
  "success": true,
  "isNewUser": true,
  "googleData": {
    "email": "user@gmail.com",
    "name": "John Doe",
    "picture": "https://..."
  },
  "sessionToken": "temp_session_token"
}

Response (if existing user):
{
  "success": true,
  "isNewUser": false,
  "tokens": {
    "accessToken": "jwt_token",
    "refreshToken": "jwt_refresh_token"
  },
  "user": { ... },
  "tenant": { ... }
}
```

**POST /api/auth/register/google**
```json
Request:
{
  "sessionToken": "temp_session_token",
  "fullName": "John Doe",
  "companyName": "Acme Corp",
  "siret": "12345678901234",
  "kbis": "KBIS123456"
}

Response:
{
  "success": true,
  "user": { ... },
  "tenant": { ... },
  "tokens": { ... }
}
```

---

## 2. User Login Flow

### 2.1 Email/Password Login

#### Step-by-Step Process

```
┌─────────────┐
│  User lands │
│  on /login  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Enter Credentials│
│ - Email          │
│ - Password       │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────────┐
│ User clicks "Login"            │
│ Frontend validates:            │
│ - Email format                  │
│ - Password not empty            │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: POST /api/auth/login   │
│ 1. Find user by email           │
│ 2. Check if user exists         │
│ 3. Verify password (bcrypt)     │
│ 4. Check if email verified      │
│ 5. Get user's tenant memberships│
│ 6. Get default tenant (owner)   │
│    or most recent tenant        │
│ 7. Get user's role in tenant    │
│ 8. Get tenant subscription      │
│ 9. Generate JWT tokens:         │
│    - access_token (15 min)      │
│    - refresh_token (7 days)     │
│    Payload:                     │
│    {                            │
│      userId,                    │
│      email,                     │
│      tenantId (current),        │
│      role,                      │
│      permissions                │
│    }                            │
│ 10. Update last_login_at        │
│ 11. Return tokens + user data   │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│ Store tokens in │
│ localStorage    │
│ Redirect to     │
│ Dashboard       │
└─────────────────┘
```

#### API Endpoints

**POST /api/auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "emailVerified": true
  },
  "tenant": {
    "id": "uuid",
    "name": "Acme Corp",
    "siret": "12345678901234"
  },
  "role": {
    "id": "uuid",
    "name": "Admin",
    "permissions": [
      {
        "module": "enterprise_profile",
        "permission": "write"
      },
      ...
    ]
  },
  "tokens": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "expiresIn": 900
  }
}
```

#### Error Handling

- **Invalid credentials**: "Invalid email or password"
- **Email not verified**: "Please verify your email first"
- **Account suspended**: "Your account has been suspended"
- **Rate limiting**: "Too many attempts, please try again later"

---

### 2.2 Google OAuth Login

#### Step-by-Step Process

```
┌─────────────┐
│  User lands │
│  on /login  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Click "Login    │
│ with Google"    │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Frontend: Initiate Google OAuth │
│ Redirect to Google OAuth        │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│ User grants     │
│ permissions     │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: GET /api/auth/google/  │
│          callback               │
│ 1. Exchange code for tokens      │
│ 2. Get user info from Google     │
│ 3. Find user by google_oauth_id │
│    or email                      │
│ 4. If user found:                │
│    - Get tenant memberships      │
│    - Get default tenant          │
│    - Get role                    │
│    - Generate JWT tokens         │
│    - Update last_login_at        │
│    - Return tokens + user data   │
│ 5. If user not found:            │
│    - Redirect to registration    │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│ Store tokens    │
│ Redirect to     │
│ Dashboard       │
└─────────────────┘
```

---

### 2.3 Token Refresh Flow

```
┌─────────────────┐
│ Access token    │
│ expired         │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Frontend: POST /api/auth/refresh│
│ - Send refresh_token            │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend:                        │
│ 1. Verify refresh_token         │
│ 2. Check if expired             │
│ 3. Get user from token          │
│ 4. Generate new access_token    │
│ 5. Optionally rotate refresh    │
│    token (security best practice)│
│ 6. Return new tokens            │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│ Update tokens   │
│ Continue request│
└─────────────────┘
```

---

## 3. Mobility Feature Flow

### 3.1 Purchasing Mobility Feature

#### Step-by-Step Process

```
┌─────────────────┐
│ User in         │
│ Settings/Profile│
│ or Dashboard    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Click "Enable   │
│ Mobility" or    │
│ "Upgrade"       │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Check if user already has       │
│ Mobility feature                 │
│ - If yes: Show already active   │
│ - If no: Continue                │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Show Mobility Feature Page:     │
│ - Description                   │
│ - Benefits                      │
│ - Pricing (Monthly/Yearly)      │
│ - Select billing period          │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ User selects billing period     │
│ (Monthly or Yearly)             │
│ Clicks "Subscribe"              │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: POST /api/features/    │
│          mobility/subscribe     │
│ 1. Get user's Stripe customer   │
│ 2. Check if already subscribed  │
│ 3. Create Stripe Subscription:  │
│    - customer_id                │
│    - items: [mobility_product]  │
│    - billing: monthly/yearly    │
│ 4. Create UserFeature record:  │
│    - user_id                    │
│    - feature_type: mobility      │
│    - stripe_subscription_id     │
│    - status: active              │
│    - current_period_start       │
│    - current_period_end         │
│ 5. Return subscription details  │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ If payment method needed:       │
│ - Redirect to Stripe Checkout  │
│ - Or use Stripe Elements        │
│ - User completes payment        │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Stripe Webhook:                 │
│ customer.subscription.created   │
│ 1. Update UserFeature status    │
│ 2. Set status: active           │
│ 3. Send confirmation email      │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│ Show success    │
│ message         │
│ "Mobility       │
│ enabled!"       │
└─────────────────┘
```

#### API Endpoints

**GET /api/features/mobility/status**
```json
Response:
{
  "hasMobility": true,
  "status": "active",
  "currentPeriodEnd": "2024-02-01T00:00:00Z",
  "billingPeriod": "monthly"
}
```

**POST /api/features/mobility/subscribe**
```json
Request:
{
  "billingPeriod": "monthly" // or "yearly"
}

Response:
{
  "success": true,
  "subscription": {
    "id": "sub_xxx",
    "status": "active",
    "currentPeriodEnd": "2024-02-01T00:00:00Z"
  },
  "checkoutUrl": "https://checkout.stripe.com/..." // if payment needed
}
```

---

### 3.2 Being Invited to Another Tenant (With Mobility)

#### Step-by-Step Process

```
┌─────────────────┐
│ Owner/Admin of  │
│ Tenant B invites│
│ User A          │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: POST /api/tenants/    │
│          {tenantId}/invitations │
│ 1. Check tenant subscription    │
│ 2. Check current user count     │
│ 3. Check if at max users        │
│ 4. Get invited user             │
│ 5. Check if user has Mobility:   │
│    - Query UserFeature table    │
│    - Check status: active       │
│ 6. If no Mobility:              │
│    - Return error: "User needs  │
│      Mobility feature"          │
│ 7. If Mobility active:          │
│    - Create TenantMembership:  │
│      * user_id                  │
│      * tenant_id                │
│      * role_id (selected)       │
│      * invited_by               │
│    - Send invitation email      │
│ 8. Return success              │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Email sent to User A:           │
│ "You've been invited to        │
│  Tenant B"                      │
│ - Inviter name                  │
│ - Tenant name                   │
│ - Role assigned                 │
│ - Accept/Decline buttons       │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ User A clicks "Accept" in email│
│ or in app notification         │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: POST /api/invitations/│
│          {invitationId}/accept  │
│ 1. Verify invitation token      │
│ 2. Check if already accepted   │
│ 3. Update TenantMembership:    │
│    - Set accepted: true         │
│    - Set accepted_at: now       │
│ 4. Send confirmation email      │
│ 5. Return tenant info          │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ User A can now:                 │
│ - See Tenant B in tenant        │
│   switcher dropdown             │
│ - Switch to Tenant B            │
│ - Access based on assigned role │
└─────────────────────────────────┘
```

#### API Endpoints

**POST /api/tenants/{tenantId}/invitations**
```json
Request:
{
  "email": "userA@example.com",
  "roleId": "uuid" // Admin, Member, Viewer, or Custom Role
}

Response (if Mobility required):
{
  "success": false,
  "error": "USER_MOBILITY_REQUIRED",
  "message": "User must have Mobility feature to be invited"
}

Response (if success):
{
  "success": true,
  "invitation": {
    "id": "uuid",
    "email": "userA@example.com",
    "tenantName": "Tenant B",
    "roleName": "Member",
    "invitedBy": "Owner Name"
  }
}
```

**POST /api/invitations/{invitationId}/accept**
```json
Request:
{
  "token": "invitation_token"
}

Response:
{
  "success": true,
  "tenant": {
    "id": "uuid",
    "name": "Tenant B"
  },
  "role": {
    "id": "uuid",
    "name": "Member",
    "permissions": [...]
  }
}
```

---

### 3.3 Being Invited Without Mobility

#### Step-by-Step Process

```
┌─────────────────┐
│ Owner tries to   │
│ invite User A   │
│ (no Mobility)    │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend checks Mobility:        │
│ - User A doesn't have Mobility │
│ - Return error                  │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Show error to Owner:            │
│ "User must enable Mobility      │
│  feature to be invited"         │
│ - Option to notify user         │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ OR: Show upgrade prompt to      │
│ User A (if viewing invitation): │
│ "Enable Mobility to join this  │
│  tenant"                        │
│ - Link to Mobility purchase     │
└─────────────────────────────────┘
```

---

### 3.4 Switching Between Tenants

#### Step-by-Step Process

```
┌─────────────────┐
│ User logged in  │
│ Currently in    │
│ Tenant A        │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────────┐
│ User clicks tenant switcher     │
│ dropdown in header              │
│ Shows:                           │
│ - Current: Tenant A (Owner)     │
│ - Tenant B (Guest - Member)     │
│ - Tenant C (Guest - Viewer)     │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ User selects "Tenant B"         │
│ Frontend:                       │
│ - Update active tenant context  │
│ - Store in state                │
│ - Update JWT token (optional)   │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: GET /api/tenants/      │
│          switch/{tenantId}      │
│ 1. Verify user has membership   │
│ 2. Get user's role in tenant    │
│ 3. Get role permissions         │
│ 4. Generate new JWT with:       │
│    - Updated tenantId           │
│    - Updated role                │
│    - Updated permissions         │
│ 5. Return new token + tenant    │
│    data                         │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Frontend:                       │
│ - Update tokens                 │
│ - Reload tenant-specific data   │
│ - Update UI based on role        │
│ - Show tenant name in header    │
└─────────────────────────────────┘
```

#### API Endpoints

**GET /api/tenants/switch/{tenantId}**
```json
Response:
{
  "success": true,
  "tenant": {
    "id": "uuid",
    "name": "Tenant B",
    "siret": "..."
  },
  "role": {
    "id": "uuid",
    "name": "Member",
    "permissions": [
      {
        "module": "enterprise_profile",
        "permission": "read"
      },
      {
        "module": "documents",
        "permission": "write"
      }
    ]
  },
  "tokens": {
    "accessToken": "new_jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**GET /api/tenants/my-tenants**
```json
Response:
{
  "tenants": [
    {
      "id": "uuid",
      "name": "Tenant A",
      "role": "Owner",
      "isOwner": true
    },
    {
      "id": "uuid",
      "name": "Tenant B",
      "role": "Member",
      "isOwner": false
    }
  ]
}
```

---

### 3.5 Managing Mobility Subscription

#### Viewing Mobility Status

```
┌─────────────────┐
│ User in Settings│
│ or Profile      │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Show Mobility section:          │
│ - Status: Active                │
│ - Billing: Monthly              │
│ - Next billing: Feb 1, 2024    │
│ - Cancel/Manage button          │
└─────────────────────────────────┘
```

#### Canceling Mobility

```
┌─────────────────────────────────┐
│ User clicks "Cancel Mobility"   │
│ Show confirmation modal:        │
│ "You'll lose access to all      │
│  invited tenants"               │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: POST /api/features/   │
│          mobility/cancel        │
│ 1. Cancel Stripe subscription   │
│ 2. Update UserFeature:         │
│    - status: cancelled           │
│    - cancel_at_period_end: true │
│ 3. Send cancellation email      │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ At period end:                  │
│ - Stripe webhook: subscription. │
│   deleted                        │
│ - Update UserFeature status     │
│ - Remove access to invited       │
│   tenants (keep TenantMembership│
│   but mark as inactive)         │
└─────────────────────────────────┘
```

---

## Flow Diagrams Summary

### Registration Flow
```
Email → OTP → Verify → Form → Register → Dashboard
Google → OAuth → Additional Info → Register → Dashboard
```

### Login Flow
```
Email/Password → Verify → Generate Tokens → Dashboard
Google → OAuth → Verify → Generate Tokens → Dashboard
```

### Mobility Flow
```
Purchase → Stripe → Active → Can Be Invited → Accept → Switch Tenants
```

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Status**: Complete

