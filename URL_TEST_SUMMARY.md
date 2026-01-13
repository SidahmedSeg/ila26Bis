# URL Test Summary

## ✅ Working URLs

### Backend API
- **Root**: http://localhost:4000 ✅
- **Health Check**: http://localhost:4000/health ✅
  - Returns: `{"status":"ok","database":"connected","timestamp":"..."}`

### Docker Services
- **PostgreSQL**: localhost:25000 ✅ (Running)
- **Redis**: localhost:25100 ✅ (Running)
- **MinIO API**: localhost:25200 ✅ (Running)
- **MinIO Console**: http://localhost:25201 ✅ (Status: 200)

## ⏳ Starting

### Frontend
- **Main App**: http://localhost:30000 ⏳ (Starting in background)
  - Port: 30000 (6 digits as requested)
  - Check status: `lsof -ti:30000`

## 🔍 Routes to Test

### Backend API Endpoints

#### Authentication
- `POST /auth/send-otp` - Send OTP to email
- `POST /auth/verify-otp` - Verify OTP code
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/google/register` - Google OAuth registration
- `POST /auth/google/login` - Google OAuth login

#### Enterprise Profile
- `GET /enterprise/profile` - Get enterprise profile (requires auth)
- `PUT /enterprise/profile` - Update profile (requires auth)
- `POST /enterprise/validate-siret` - Validate SIRET
- `POST /enterprise/validate-kbis` - Validate KBIS
- `PUT /enterprise/address` - Update address
- `POST /enterprise/address/autocomplete` - Address autocomplete
- `GET /enterprise/activities` - Get activity domains
- `GET /enterprise/specialities` - Get specialities
- `POST /enterprise/logo` - Upload logo
- `DELETE /enterprise/logo` - Delete logo
- `POST /enterprise/cover` - Upload cover image
- `DELETE /enterprise/cover` - Delete cover image
- `GET /enterprise/documents` - List documents
- `POST /enterprise/documents` - Upload document
- `DELETE /enterprise/documents/:id` - Delete document
- `GET /enterprise/documents/categories` - Get categories

#### Documentation
- `GET /api/docs` - Swagger documentation

### Frontend Pages

#### Public Pages
- `/` - Home page
- `/login` - Login page
- `/register` - Registration start page
- `/register/verify-otp` - OTP verification page
- `/register/form` - Registration form page

#### Protected Pages (require authentication)
- `/dashboard` - Main dashboard
- `/dashboard/enterprise/basic-info` - Basic Info tab
- `/dashboard/enterprise/address` - Address tab
- `/dashboard/enterprise/marketing` - Marketing tab
- `/dashboard/enterprise/documents` - Documents tab
- `/dashboard/enterprise/subscription` - Subscription tab

## 🧪 Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:4000/health
```

### Test Frontend
```bash
curl http://localhost:30000
```

### Test Auth Endpoint
```bash
curl -X POST http://localhost:4000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Check Port Usage
```bash
lsof -ti:30000  # Frontend
lsof -ti:4000    # Backend
```

### Check Docker Services
```bash
docker-compose ps
```

## 📝 Notes

1. **Frontend Port**: Changed to 30000 (6 digits) to avoid conflicts
2. **Backend Port**: Remains 4000
3. **CORS**: Configured to allow `http://localhost:30000`
4. **Routes**: API routes are at root level (no `/api` prefix except Swagger)
5. **Swagger**: Available at `/api/docs` (special route)

## ⚠️ Troubleshooting

### Frontend not starting?
```bash
cd apps/ila26
bun run dev
```

### Backend routes returning 404?
- Check if backend is running: `lsof -ti:4000`
- Restart backend: `cd apps/api && bun run start:dev`
- Check if routes are registered in `app.module.ts`

### CORS errors?
- Update `FRONTEND_URL` in `apps/api/.env` to `http://localhost:30000`
- Or restart backend to pick up changes from `main.ts`

### Port conflicts?
- Frontend: Check `lsof -ti:30000`
- Backend: Check `lsof -ti:4000`
- Kill process if needed: `kill -9 $(lsof -ti:PORT)`

