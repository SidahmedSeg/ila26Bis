# Testing Registration Flow

## Prerequisites
- ✅ Server running on http://localhost:4000
- ✅ Database connected
- ✅ Mailtrap configured

## Registration Flow Steps

### Step 1: Send OTP
```bash
curl -X POST http://localhost:4000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

**Expected Response:**
```json
{
  "message": "OTP sent to your email"
}
```

### Step 2: Get OTP Code
After sending OTP, retrieve it from:
- **Mailtrap inbox**: Check your Mailtrap account
- **Database**: Run `node packages/shared/get-otp-from-db.js <email>`

### Step 3: Verify OTP
```bash
curl -X POST http://localhost:4000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "otp": "123456"
  }'
```

**Expected Response:**
```json
{
  "verified": true,
  "message": "OTP verified successfully"
}
```

### Step 4: Complete Registration
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

**Expected Response:**
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

## Testing with Frontend

Frontend is available at: http://localhost:30000

1. Navigate to http://localhost:30000/register
2. Enter email and click "Send OTP"
3. Check Mailtrap for OTP code
4. Enter OTP and verify
5. Complete registration form

## Troubleshooting

- **OTP not received**: Check Mailtrap configuration
- **404 errors**: Ensure server is running
- **500 errors**: Check server logs in `/tmp/api-server.log`

