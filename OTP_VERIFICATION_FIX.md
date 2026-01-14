# OTP Verification Fix

## Issue
When users tried to register after verifying OTP, they got:
```json
{"message":"OTP has already been used","error":"Bad Request","statusCode":400}
```

## Root Cause
The OTP verification flow had a problem:
1. User verifies OTP via `/auth/verify-otp` → OTP is marked as `used: true`
2. User tries to register via `/auth/register` → Registration also calls `verifyOtp()` → Fails because OTP is already marked as used

## Solution
Modified `verifyOtp()` method to accept an optional `markAsUsed` parameter:
- When called from `/auth/verify-otp` endpoint: `markAsUsed = false` (doesn't mark as used)
- When called from `/auth/register` endpoint: `markAsUsed = true` (marks as used)

This allows:
- User can verify OTP first (to confirm it's valid)
- Same OTP can then be used for registration
- OTP is only marked as used when registration completes

## Changes Made

### `apps/api/src/auth/auth.service.ts`

1. **Updated `verifyOtp` method signature:**
   ```typescript
   async verifyOtp(email: string, code: string, markAsUsed = false): Promise<{ verified: boolean }>
   ```

2. **Conditional marking as used:**
   ```typescript
   // Only mark as used if explicitly requested (e.g., during registration)
   if (markAsUsed) {
     await this.prisma.oTP.update({
       where: { id: otp.id },
       data: { used: true },
     });
   }
   ```

3. **Updated `register` method:**
   ```typescript
   // Verify OTP first and mark it as used (since registration completes the flow)
   await this.verifyOtp(registerDto.email, registerDto.otpCode, true);
   ```

## Testing
1. Send OTP: `POST /auth/send-otp`
2. Verify OTP: `POST /auth/verify-otp` (OTP not marked as used)
3. Register: `POST /auth/register` (OTP marked as used during registration)

## Status
✅ Fixed and deployed

