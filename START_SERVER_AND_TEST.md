# Start Server and Test Registration

## 🚀 Quick Start

### 1. Fix Prisma Paths (if needed)
```bash
cd /Users/intelifoxdz/ila26Bis
node scripts/fix-prisma-paths.js
```

### 2. Start the Server
```bash
cd apps/api
bun dist/main.js
```

The server should start on http://localhost:4000

### 3. Test Registration

**Option A: Use the test script**
```bash
./test-registration.sh
```

**Option B: Manual testing**

1. **Send OTP:**
```bash
curl -X POST http://localhost:4000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

2. **Get OTP Code:**
```bash
node packages/shared/get-otp-from-db.js your-email@example.com
```

3. **Verify OTP:**
```bash
curl -X POST http://localhost:4000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","code":"123456"}'
```

4. **Complete Registration:**
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

### 4. Or Use Frontend

Start frontend:
```bash
cd apps/ila26
bun dev
```

Navigate to: http://localhost:30000/register

## ✅ Expected Results

- Server starts without errors
- Health endpoint returns: `{"status":"ok","database":"connected"}`
- OTP is sent and can be retrieved
- Registration completes successfully

