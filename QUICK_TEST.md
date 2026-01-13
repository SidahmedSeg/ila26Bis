# Quick Testing Guide

## Services Status

✅ **Docker Services**: Running
- PostgreSQL: `localhost:25000`
- Redis: `localhost:25100`
- MinIO: `localhost:25200` (API), `localhost:25201` (Console)

✅ **Backend API**: Starting on `http://localhost:4000`
✅ **Frontend**: Starting on `http://localhost:30000`

---

## Quick Test Steps

### 1. Verify Services

**Backend API:**
```bash
curl http://localhost:4000/api/docs
# Should return HTML (Swagger UI)
```

**Frontend:**
```bash
curl http://localhost:3000
# Should return HTML
```

**Swagger Documentation:**
Open in browser: `http://localhost:4000/api/docs`

---

### 2. Test Registration Flow

1. **Open Frontend:**
   ```
   http://localhost:30000/register
   ```

2. **Enter Email:**
   - Enter a test email (e.g., `test@example.com`)
   - Click "Send Verification Code"

3. **Check Mailtrap:**
   - Go to Mailtrap inbox
   - Copy the OTP code

4. **Verify OTP:**
   - Enter the OTP code
   - Click "Verify Code"

5. **Complete Registration:**
   - Fill in:
     - Full Name: `Test User`
     - Company Name: `Test Company`
     - SIRET: `12345678901234`
     - KBIS: `KBIS123`
     - Password: `Test123!@#` (must have uppercase, lowercase, number, special char)
     - Confirm Password: `Test123!@#`
   - Click "Create Account"

**Expected:** Redirected to `/dashboard`

---

### 3. Test Login

1. **Go to Login:**
   ```
   http://localhost:30000/login
   ```

2. **Enter Credentials:**
   - Email: `test@example.com`
   - Password: `Test123!@#`
   - Click "Login"

**Expected:** Redirected to `/dashboard`

---

### 4. Test Enterprise Profile

#### Basic Info Tab

1. **Navigate:** `http://localhost:30000/dashboard/enterprise/basic-info`

2. **Test SIRET Validation:**
   - Enter a SIRET number
   - Click "Validate" button
   - Should show validation status

3. **Update Profile:**
   - Change enterprise name
   - Select activity domain
   - Select speciality
   - Click "Save Changes"
   - Should see success message

#### Address Tab

1. **Navigate:** `http://localhost:30000/dashboard/enterprise/address`

2. **Test Autocomplete:**
   - Type in street field (e.g., "1600 Amphitheatre")
   - Should show suggestions
   - Select a suggestion
   - Fields should populate

3. **Save Address:**
   - Fill in address fields
   - Click "Save Address"
   - Should see success message

#### Marketing Tab

1. **Navigate:** `http://localhost:30000/dashboard/enterprise/marketing`

2. **Upload Logo:**
   - Drag & drop or click to upload
   - Max 2MB, JPEG/PNG/WebP
   - Should upload and show preview

3. **Upload Cover:**
   - Drag & drop or click to upload
   - Max 5MB, JPEG/PNG/WebP
   - Should upload and show preview

#### Documents Tab

1. **Navigate:** `http://localhost:30000/dashboard/enterprise/documents`

2. **Upload Document:**
   - Click "Upload" button
   - Enter document name
   - Select category
   - Upload file (max 10MB)
   - Should appear in list

3. **Download Document:**
   - Click download icon
   - Should open file

4. **Delete Document:**
   - Click delete icon
   - Confirm
   - Should be removed

#### Subscription Tab

1. **Navigate:** `http://localhost:30000/dashboard/enterprise/subscription`

2. **View Plan:**
   - Should show current subscription
   - Display plan tier, status, max users

---

## API Testing with Swagger

1. **Open Swagger:** `http://localhost:4000/api/docs`

2. **Get Auth Token:**
   - Use `/auth/login` endpoint
   - Enter email and password
   - Copy the `access_token` from response

3. **Authorize:**
   - Click "Authorize" button (top right)
   - Enter: `Bearer {your_access_token}`
   - Click "Authorize"

4. **Test Endpoints:**
   - Try `GET /enterprise/profile`
   - Try `PUT /enterprise/profile`
   - Try `POST /enterprise/logo` (file upload)
   - Try `GET /enterprise/documents`

---

## Common Issues

### Backend not starting?
```bash
cd apps/api
bun run start:dev
```

### Frontend not starting?
```bash
cd apps/ila26
bun run dev
```

### Database connection error?
```bash
# Check Docker services
docker-compose ps

# Check DATABASE_URL in apps/api/.env
# Should be: postgresql://postgres:postgres@localhost:25000/ila26
```

### File upload fails?
```bash
# Check MinIO is running
docker-compose ps minio

# Check MinIO credentials in apps/api/.env
# Access MinIO Console: http://localhost:25201
```

### CORS errors?
- Check `FRONTEND_URL` in `apps/api/.env`
- Should be: `http://localhost:30000`

---

## Next Steps

After testing:
1. Fix any bugs found
2. Improve error messages
3. Add more validation
4. Proceed to Phase 4 (Subscription & Payments)

