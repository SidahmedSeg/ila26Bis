# Quick Registration Test Guide

## ✅ Server Status
Check if server is running:
```bash
curl http://localhost:4000/health
```

If not running, start it:
```bash
cd apps/api && bun dist/main.js
```

## 🧪 Test Registration Flow

### Option 1: Using cURL (Command Line)

**Step 1: Send OTP**
```bash
curl -X POST http://localhost:4000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

**Step 2: Get OTP Code**
```bash
# From database
node packages/shared/get-otp-from-db.js your-email@example.com

# Or check Mailtrap inbox
# https://mailtrap.io/inboxes
```

**Step 3: Verify OTP**
```bash
curl -X POST http://localhost:4000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "code": "123456"
  }'
```

**Step 4: Complete Registration**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "fullName": "John Doe",
    "companyName": "Test Company",
    "siret": "12345678901234",
    "kbis": "KBIS123456",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!"
  }'
```

### Option 2: Using Frontend (Recommended)

1. **Start Frontend** (if not running):
   ```bash
   cd apps/ila26 && bun dev
   ```

2. **Navigate to**: http://localhost:30000/register

3. **Follow the UI**:
   - Enter email → Send OTP
   - Check Mailtrap for OTP code
   - Enter OTP → Verify
   - Complete registration form

### Option 3: Using Swagger UI

1. **Open**: http://localhost:4000/api/docs

2. **Test endpoints**:
   - `/auth/send-otp` - Send OTP
   - `/auth/verify-otp` - Verify OTP
   - `/auth/register` - Complete registration

## 📋 Expected Responses

### Send OTP Success:
```json
{
  "message": "OTP sent to your email"
}
```

### Verify OTP Success:
```json
{
  "verified": true,
  "message": "OTP verified successfully"
}
```

### Registration Success:
```json
{
  "accessToken": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "your-email@example.com",
    "fullName": "John Doe",
    "emailVerified": true
  },
  "tenant": {
    "id": "uuid",
    "name": "Test Company",
    "role": "Owner"
  }
}
```

## 🔍 Troubleshooting

- **Server not responding**: Check if port 4000 is in use
- **OTP not received**: Verify Mailtrap configuration
- **404 errors**: Ensure server is running and routes are registered
- **500 errors**: Check server logs for details

