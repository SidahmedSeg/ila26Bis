# Complete Testing Guide - Phase 3

## Prerequisites

1. **Start all services:**
   ```bash
   # Start database, Redis, MinIO (if using Docker)
   docker-compose up -d
   
   # Start backend API
   cd apps/api
   bun dist/main.js
   
   # Start frontend (optional for API testing)
   cd apps/ila26
   bun dev
   ```

2. **Verify services are running:**
   ```bash
   curl http://localhost:4000/health
   ```

---

## Testing Workflow

### Step 1: Registration Flow

#### 1.1 Send OTP
```bash
curl -X POST http://localhost:4000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

**Expected Response:**
```json
{"message":"OTP sent to your email"}
```

#### 1.2 Get OTP Code
**Option A: Check Mailtrap Email Logs**
1. Go to: https://mailtrap.io/email-logs
2. Find the email sent to your address
3. Copy the 6-digit OTP code

**Option B: Use Database (for testing - OTP is hashed)**
```bash
# This won't work as OTP is bcrypt hashed
# Use Mailtrap Email Logs instead
```

#### 1.3 Verify OTP
```bash
curl -X POST http://localhost:4000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your-email@example.com",
    "code":"123456"
  }'
```

**Expected Response:**
```json
{"verified":true}
```

#### 1.4 Complete Registration
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your-email@example.com",
    "fullName":"John Doe",
    "companyName":"Test Company",
    "siret":"12345678901234",
    "kbis":"KBIS123456",
    "password":"SecurePass123!",
    "confirmPassword":"SecurePass123!",
    "otpCode":"123456"
  }'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "user": {...},
  "tenant": {...}
}
```

**Save the `accessToken` for next steps!**

---

### Step 2: Login Flow (Alternative)

If you already have a registered user:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your-email@example.com",
    "password":"SecurePass123!"
  }'
```

**Save the `accessToken` from response!**

---

### Step 3: Test Enterprise Endpoints

Set your token:
```bash
export TOKEN="your-access-token-here"
```

#### 3.1 Get Enterprise Profile
```bash
curl -X GET http://localhost:4000/enterprise/profile \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json"
```

#### 3.2 Update Enterprise Profile
```bash
curl -X PUT http://localhost:4000/enterprise/profile \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Updated Company Name",
    "activityDomainId":"uuid-here",
    "specialityId":"uuid-here"
  }'
```

#### 3.3 Validate SIRET
```bash
curl -X POST http://localhost:4000/enterprise/validate-siret \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "siret":"12345678901234"
  }'
```

#### 3.4 Address Autocomplete
```bash
curl -X POST http://localhost:4000/enterprise/address/autocomplete \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "input":"123 Main Street",
    "country":"FR"
  }'
```

#### 3.5 Update Address
```bash
curl -X PUT http://localhost:4000/enterprise/address \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "street":"123 Main Street",
    "city":"Paris",
    "postalCode":"75001",
    "country":"France",
    "placeId":"ChIJD7fiBh9u5kcRYJSMaMOCCwQ"
  }'
```

#### 3.6 Get Activities (Public)
```bash
curl -X GET http://localhost:4000/enterprise/activities \
  -H "Content-Type: application/json"
```

#### 3.7 Get Specialities (Public)
```bash
curl -X GET "http://localhost:4000/enterprise/specialities?activityId=uuid-here" \
  -H "Content-Type: application/json"
```

---

### Step 4: Test File Uploads

#### 4.1 Upload Logo
```bash
curl -X POST http://localhost:4000/enterprise/logo \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "file=@/path/to/logo.png"
```

#### 4.2 Upload Cover Image
```bash
curl -X POST http://localhost:4000/enterprise/cover \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "file=@/path/to/cover.jpg"
```

#### 4.3 Upload Document
```bash
curl -X POST http://localhost:4000/enterprise/documents \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "file=@/path/to/document.pdf" \
  -F "categoryId=uuid-here" \
  -F "name=Document Name"
```

#### 4.4 List Documents
```bash
curl -X GET http://localhost:4000/enterprise/documents \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json"
```

#### 4.5 Delete Document
```bash
curl -X DELETE http://localhost:4000/enterprise/documents/{document-id} \
  -H "Authorization: Bearer ${TOKEN}"
```

#### 4.6 Delete Logo
```bash
curl -X DELETE http://localhost:4000/enterprise/logo \
  -H "Authorization: Bearer ${TOKEN}"
```

#### 4.7 Delete Cover
```bash
curl -X DELETE http://localhost:4000/enterprise/cover \
  -H "Authorization: Bearer ${TOKEN}"
```

---

### Step 5: Test External APIs

#### 5.1 INSEE API (SIRET Validation)
The SIRET validation endpoint uses INSEE API internally. Test it:
```bash
curl -X POST http://localhost:4000/enterprise/validate-siret \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"siret":"12345678901234"}'
```

**Verify:**
- Check response contains INSEE API data
- Verify company name is extracted
- Check error handling for invalid SIRET

#### 5.2 Google Places API (Address Autocomplete)
Test address autocomplete:
```bash
curl -X POST http://localhost:4000/enterprise/address/autocomplete \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "input":"123 Main Street Paris",
    "country":"FR"
  }'
```

**Verify:**
- Response contains suggestions
- Suggestions are formatted correctly
- Error handling works

---

### Step 6: Test Frontend Integration

1. **Start Frontend:**
   ```bash
   cd apps/ila26
   bun dev
   ```

2. **Open Browser:**
   - Navigate to: http://localhost:30000

3. **Test Registration Flow:**
   - Go to `/register`
   - Enter email
   - Check Mailtrap Email Logs for OTP
   - Enter OTP
   - Complete registration form
   - Verify redirect to dashboard

4. **Test Enterprise Profile:**
   - Navigate to `/dashboard/enterprise/basic-info`
   - Update profile
   - Test SIRET validation
   - Test address autocomplete
   - Upload logo/cover
   - Upload documents
   - Verify all data saves correctly

---

## Automated Testing Scripts

### Registration Flow
```bash
./test-registration-flow.sh
```

### All Endpoints (Public)
```bash
./test-all-endpoints.sh
```

### Authenticated Endpoints
```bash
./test-with-token.sh <your-access-token>
```

---

## Known Issues & Workarounds

### Issue 1: OTP Code Retrieval
- **Problem**: OTP is bcrypt hashed in database
- **Workaround**: Check Mailtrap Email Logs for OTP code
- **Future Fix**: Create test endpoint for development mode

### Issue 2: Mailtrap Email Visibility
- **Problem**: Emails go to Email Logs, not Testing inbox
- **Workaround**: Check Email Logs at https://mailtrap.io/email-logs
- **Future Fix**: Switch to Testing API or document clearly

---

## Test Checklist

- [ ] Registration flow (send OTP → verify → register)
- [ ] Login flow
- [ ] Get enterprise profile
- [ ] Update enterprise profile
- [ ] Validate SIRET
- [ ] Validate KBIS
- [ ] Address autocomplete
- [ ] Update address
- [ ] Get activities
- [ ] Get specialities
- [ ] Upload logo
- [ ] Delete logo
- [ ] Upload cover
- [ ] Delete cover
- [ ] Upload document
- [ ] List documents
- [ ] Delete document
- [ ] Get document categories
- [ ] Frontend registration flow
- [ ] Frontend enterprise profile tabs
- [ ] File uploads from frontend

---

## Next Steps After Testing

1. **Fix any bugs found**
2. **Update documentation**
3. **Create test reports**
4. **Mark Phase 3 as complete**
5. **Start Phase 4 (Subscription & Payments)**

