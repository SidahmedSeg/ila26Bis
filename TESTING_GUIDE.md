# Testing Guide - UI with Backend APIs

## Prerequisites

1. **Docker Services Running**
   ```bash
   docker-compose up -d
   ```
   This starts:
   - PostgreSQL (port 25000)
   - Redis (port 25100)
   - MinIO (ports 25200, 25201)

2. **Environment Variables**
   - Backend API: `apps/api/.env`
   - Frontend: `apps/ila26/.env.local`

3. **Database Migrations**
   ```bash
   cd packages/shared
   bunx prisma migrate dev
   ```

---

## Step 1: Start Backend API

```bash
cd apps/api
bun run start:dev
```

The API should start on `http://localhost:4000`

**Verify it's running:**
```bash
curl http://localhost:4000/health
# or visit http://localhost:4000/api/docs for Swagger
```

---

## Step 2: Start Frontend

```bash
cd apps/ila26
bun run dev
```

The frontend should start on `http://localhost:30000`

---

## Step 3: Test Authentication Flow

### 3.1 Register a New User

1. Go to `http://localhost:30000/register`
2. Enter email address
3. Check Mailtrap inbox for OTP code
4. Enter OTP code
5. Fill registration form:
   - Full Name
   - Company Name
   - SIRET (e.g., `12345678901234`)
   - KBIS
   - Password (must contain: uppercase, lowercase, number, special char)
6. Submit form

**Expected Result:**
- User created
- Tenant created
- Redirected to `/dashboard`

### 3.2 Login

1. Go to `http://localhost:30000/login`
2. Enter email and password
3. Click Login

**Expected Result:**
- JWT token received
- User authenticated
- Redirected to `/dashboard`

---

## Step 4: Test Enterprise Profile

### 4.1 Basic Info Tab

**URL:** `http://localhost:30000/dashboard/enterprise/basic-info`

**Test Cases:**
1. **View Profile**
   - Should load current enterprise info
   - Should show activity domains dropdown

2. **Update Name**
   - Change enterprise name
   - Click "Save Changes"
   - Should see success message

3. **Validate SIRET**
   - Enter SIRET number
   - Click "Validate" button
   - Should show validation status
   - If valid, should auto-fill name

4. **Select Activity Domain**
   - Select an activity domain
   - Should load specialities
   - Select a speciality
   - Save changes

**API Endpoints Tested:**
- `GET /enterprise/profile`
- `PUT /enterprise/profile`
- `POST /enterprise/validate-siret`
- `GET /enterprise/activities`
- `GET /enterprise/specialities?activityDomainId=xxx`

### 4.2 Address Tab

**URL:** `http://localhost:30000/dashboard/enterprise/address`

**Test Cases:**
1. **View Current Address**
   - Should load existing address if available

2. **Address Autocomplete**
   - Type in street field (e.g., "1600 Amphitheatre")
   - Should show Google Places suggestions
   - Select a suggestion
   - Should populate fields

3. **Update Address**
   - Fill in address fields
   - Click "Save Address"
   - Should see success message

**API Endpoints Tested:**
- `GET /enterprise/profile` (for address)
- `POST /enterprise/address/autocomplete`
- `PUT /enterprise/address`

### 4.3 Marketing Tab

**URL:** `http://localhost:30000/dashboard/enterprise/marketing`

**Test Cases:**
1. **Upload Logo**
   - Drag & drop or click to upload logo
   - Max 2MB, formats: JPEG, PNG, WebP
   - Should upload and show preview
   - Should see success message

2. **Delete Logo**
   - Click "Delete Logo"
   - Confirm deletion
   - Logo should be removed

3. **Upload Cover Image**
   - Drag & drop or click to upload cover
   - Max 5MB, formats: JPEG, PNG, WebP
   - Should upload and show preview

4. **Delete Cover Image**
   - Click "Delete Cover"
   - Confirm deletion
   - Cover should be removed

**API Endpoints Tested:**
- `GET /enterprise/profile` (for logo/cover URLs)
- `POST /enterprise/logo` (multipart/form-data)
- `DELETE /enterprise/logo`
- `POST /enterprise/cover` (multipart/form-data)
- `DELETE /enterprise/cover`

**Verify in MinIO:**
- Files should be stored in `ila26` bucket
- Logo: `logos/{tenantId}/logo.{ext}`
- Cover: `covers/{tenantId}/cover.{ext}`

### 4.4 Documents Tab

**URL:** `http://localhost:30000/dashboard/enterprise/documents`

**Test Cases:**
1. **View Documents List**
   - Should show empty state if no documents
   - Or show list of documents with metadata

2. **Upload Document**
   - Click "Upload" button
   - Enter document name
   - Select category
   - Drag & drop or select file
   - Max 10MB
   - Should upload and appear in list

3. **Download Document**
   - Click download icon
   - Should open file in new tab

4. **Delete Document**
   - Click delete icon
   - Confirm deletion
   - Document should be removed

**API Endpoints Tested:**
- `GET /enterprise/documents`
- `GET /enterprise/documents/categories`
- `POST /enterprise/documents` (multipart/form-data)
- `DELETE /enterprise/documents/:id`

### 4.5 Subscription Tab

**URL:** `http://localhost:30000/dashboard/enterprise/subscription`

**Test Cases:**
1. **View Current Plan**
   - Should display current subscription
   - Show plan tier, status, max users
   - Show features if available

2. **Payment Information**
   - Should show placeholder for Phase 4

**API Endpoints Tested:**
- `GET /enterprise/profile` (for subscription info)

---

## Step 5: Test Error Handling

### 5.1 Invalid Credentials
- Try login with wrong password
- Should show error message

### 5.2 Invalid File Types
- Try uploading non-image file as logo
- Should show validation error

### 5.3 File Size Limits
- Try uploading file > 2MB as logo
- Should show size limit error

### 5.4 Network Errors
- Stop backend API
- Try to load profile
- Should show error message

---

## Step 6: Verify Backend Logs

Check backend console for:
- Request logs
- Error messages
- Database queries
- File upload progress

---

## Step 7: Verify Database

```bash
cd packages/shared
bunx prisma studio
```

Check:
- `User` table - user created
- `Tenant` table - tenant created
- `TenantMembership` table - membership created
- `Document` table - documents uploaded
- `Subscription` table - subscription created

---

## Step 8: Verify MinIO

1. Access MinIO Console: `http://localhost:25201`
2. Login with credentials from `.env`
3. Check `ila26` bucket
4. Verify files are stored correctly

---

## Common Issues & Solutions

### Issue: "Cannot connect to API"
**Solution:** 
- Check backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Issue: "401 Unauthorized"
**Solution:**
- Check JWT token is being sent
- Check token is valid
- Try logging in again

### Issue: "File upload fails"
**Solution:**
- Check MinIO is running
- Check MinIO credentials in backend `.env`
- Check bucket `ila26` exists

### Issue: "SIRET validation fails"
**Solution:**
- Check INSEE API key in backend `.env`
- Check API key is valid
- May need real SIRET number for testing

### Issue: "Address autocomplete doesn't work"
**Solution:**
- Check Google Places API key in backend `.env`
- Check API key has Places API enabled
- Check billing is enabled for Google Cloud project

---

## Testing Checklist

- [ ] Backend API starts successfully
- [ ] Frontend starts successfully
- [ ] User can register
- [ ] User can login
- [ ] Dashboard loads
- [ ] Basic Info tab loads and updates
- [ ] SIRET validation works
- [ ] Address autocomplete works
- [ ] Address can be updated
- [ ] Logo can be uploaded
- [ ] Logo can be deleted
- [ ] Cover image can be uploaded
- [ ] Cover image can be deleted
- [ ] Documents can be uploaded
- [ ] Documents can be listed
- [ ] Documents can be downloaded
- [ ] Documents can be deleted
- [ ] Subscription info displays
- [ ] Error messages show correctly
- [ ] Loading states work
- [ ] Success messages show

---

## Next Steps After Testing

1. Fix any bugs found
2. Improve error messages if needed
3. Add more validation if needed
4. Optimize performance if needed
5. Proceed to Phase 4 (Subscription & Payments)

