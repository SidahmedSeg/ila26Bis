# Schema Issue: Tenant/Subscription Circular Dependency

## Problem

The Prisma schema has a circular dependency between `Tenant` and `Subscription` models:

1. **Tenant model** has:
   - `subscriptionId String @unique` (required field)
   - `subscription Subscription?` (optional relation)

2. **Subscription model** has:
   - `tenantId String @unique` (required field)
   - `tenant Tenant @relation(fields: [tenantId], references: [id])` (required relation)

## The Issue

This creates a circular dependency:
- To create a Tenant, we need `subscriptionId` (which requires Subscription to exist first)
- To create a Subscription, we need `tenantId` (which requires Tenant to exist first)

## Solution

The schema should be fixed. Since Subscription already has `tenantId` and defines the relation, the `subscriptionId` field in Tenant is redundant. The relation should be one-way:

**Option 1: Remove `subscriptionId` from Tenant (Recommended)**
- Remove `subscriptionId String @unique` from Tenant model
- Keep only the `subscription Subscription?` relation
- Subscription already has `tenantId` which defines the relation

**Option 2: Make `subscriptionId` optional in Tenant**
- Change `subscriptionId String @unique` to `subscriptionId String? @unique`
- Then we can create Tenant first, create Subscription with tenantId, then update Tenant with subscriptionId

## Current Status

- ✅ OTP model fixed (using `findFirst` instead of `findUnique`)
- ❌ Tenant/Subscription creation blocked by schema issue
- ⏳ Authentication module structure is complete
- ⏳ Need to fix schema or work around the circular dependency

## Next Steps

1. **Fix the schema** (recommended):
   ```prisma
   model Tenant {
     // Remove: subscriptionId  String   @unique @map("subscription_id") @db.Uuid
     // Keep: subscription    Subscription?
   }
   ```

2. **OR** Make subscriptionId optional:
   ```prisma
   subscriptionId  String?  @unique @map("subscription_id") @db.Uuid
   ```

3. **OR** Use a workaround in code (not recommended - creates technical debt)

## Recommendation

**Remove `subscriptionId` from Tenant model** since Subscription already has `tenantId` and defines the relation. This is the cleanest solution and follows Prisma best practices for one-to-one relationships.

