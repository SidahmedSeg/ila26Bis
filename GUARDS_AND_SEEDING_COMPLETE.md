# JWT Guards and Admin Seeding - Complete ✅

## Summary

✅ **JWT Guards**: Created for both APIs  
✅ **Public Decorator**: Added for public routes  
✅ **Admin Seeding**: Admin users created  

---

## User API Guards

### ✅ Created
- **JWT Guard**: `apps/api/src/auth/guards/jwt-auth.guard.ts`
- **Public Decorator**: `apps/api/src/auth/decorators/public.decorator.ts`
- **Current User Decorator**: `apps/api/src/auth/decorators/current-user.decorator.ts`
- **Global Guard**: Applied to all routes (public routes exempted)

### Usage
```typescript
// Public route (no auth required)
@Public()
@Get('public-endpoint')
async publicEndpoint() {
  return { message: 'Public access' };
}

// Protected route (auth required)
@Get('protected-endpoint')
@UseGuards(JwtAuthGuard)
async protectedEndpoint(@CurrentUser() user) {
  return { user };
}
```

### Public Routes
- ✅ `POST /auth/send-otp`
- ✅ `POST /auth/verify-otp`
- ✅ `POST /auth/register`
- ✅ `POST /auth/login`
- ✅ `POST /auth/google/register`
- ✅ `POST /auth/google/login`

---

## Admin API Guards

### ✅ Created
- **JWT Guard**: `apps/admin-api/src/auth/guards/jwt-auth.guard.ts`
- **Public Decorator**: `apps/admin-api/src/auth/decorators/public.decorator.ts`
- **Current Admin Decorator**: `apps/admin-api/src/auth/decorators/current-admin.decorator.ts`
- **Global Guard**: Applied to all routes (public routes exempted)

### Usage
```typescript
// Public route (no auth required)
@Public()
@Get('public-endpoint')
async publicEndpoint() {
  return { message: 'Public access' };
}

// Protected route (auth required)
@Get('protected-endpoint')
@UseGuards(JwtAuthGuard)
async protectedEndpoint(@CurrentAdmin() admin) {
  return { admin };
}
```

### Public Routes
- ✅ `POST /auth/login`

---

## Admin User Seeding

### ✅ Created Admin Users

**Admin User**:
- Email: `admin@ila26.com`
- Password: `Admin123!`
- Role: `ADMIN`

**Super Admin User**:
- Email: `superadmin@ila26.com`
- Password: `SuperAdmin123!`
- Role: `SUPER_ADMIN`

### Seed Script
Updated `packages/shared/prisma/seed.ts` to include admin user creation.

### Run Seeding
```bash
cd packages/shared/prisma
bun run prisma:seed
```

---

## Testing

### Test Admin Login
```bash
# Login as Admin
curl -X POST http://localhost:4001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ila26.com",
    "password": "Admin123!"
  }'

# Login as Super Admin
curl -X POST http://localhost:4001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@ila26.com",
    "password": "SuperAdmin123!"
  }'
```

### Test Protected Routes
```bash
# Get JWT token from login response
TOKEN="your-jwt-token-here"

# Test protected route (should succeed)
curl -X GET http://localhost:4001/protected-route \
  -H "Authorization: Bearer $TOKEN"

# Test without token (should fail with 401)
curl -X GET http://localhost:4001/protected-route
```

---

## Architecture

### Guard Behavior
1. **Global Guard**: Applied to all routes by default
2. **Public Routes**: Exempted using `@Public()` decorator
3. **Protected Routes**: Require valid JWT token
4. **User Context**: Available via `@CurrentUser()` or `@CurrentAdmin()` decorators

### Security
- ✅ JWT token validation
- ✅ Separate secrets per API
- ✅ Public route exemption
- ✅ User context injection
- ✅ Automatic 401 for invalid tokens

---

## Status

✅ **User API Guards**: Complete  
✅ **Admin API Guards**: Complete  
✅ **Admin Seeding**: Complete  
✅ **Build Status**: Both APIs building successfully  

**All routes are now protected by default, with public routes explicitly marked!** 🎉

