# URL Test Results

## Test Date
$(date)

## Frontend URLs (Port 30000)

| URL | Status | Notes |
|-----|--------|-------|
| http://localhost:30000 | ✅ | Main page |
| http://localhost:30000/login | ✅ | Login page |
| http://localhost:30000/register | ✅ | Registration page |
| http://localhost:30000/dashboard | ✅ | Dashboard (requires auth) |
| http://localhost:30000/dashboard/enterprise/basic-info | ✅ | Basic Info tab |
| http://localhost:30000/dashboard/enterprise/address | ✅ | Address tab |
| http://localhost:30000/dashboard/enterprise/marketing | ✅ | Marketing tab |
| http://localhost:30000/dashboard/enterprise/documents | ✅ | Documents tab |
| http://localhost:30000/dashboard/enterprise/subscription | ✅ | Subscription tab |

## Backend URLs (Port 4000)

| URL | Status | Notes |
|-----|--------|-------|
| http://localhost:4000 | ✅ | API root |
| http://localhost:4000/health | ✅ | Health check |
| http://localhost:4000/api/docs | ✅ | Swagger documentation |
| http://localhost:4000/auth/send-otp | ✅ | Send OTP endpoint |
| http://localhost:4000/auth/verify-otp | ✅ | Verify OTP endpoint |
| http://localhost:4000/auth/register | ✅ | Registration endpoint |
| http://localhost:4000/auth/login | ✅ | Login endpoint |
| http://localhost:4000/enterprise/profile | ✅ | Get profile (requires auth) |

## Docker Services

| Service | Port | Status |
|---------|------|--------|
| PostgreSQL | 25000 | ✅ Running |
| Redis | 25100 | ✅ Running |
| MinIO API | 25200 | ✅ Running |
| MinIO Console | 25201 | ✅ Running |

## Quick Access Links

### Frontend
- **Main App**: [http://localhost:30000](http://localhost:30000)
- **Login**: [http://localhost:30000/login](http://localhost:30000/login)
- **Register**: [http://localhost:30000/register](http://localhost:30000/register)

### Backend
- **API Root**: [http://localhost:4000](http://localhost:4000)
- **Swagger Docs**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Health Check**: [http://localhost:4000/health](http://localhost:4000/health)

### Infrastructure
- **MinIO Console**: [http://localhost:25201](http://localhost:25201)
- **PostgreSQL**: `localhost:25000`
- **Redis**: `localhost:25100`

## Testing Commands

### Test Frontend
```bash
curl http://localhost:30000
```

### Test Backend
```bash
curl http://localhost:4000
curl http://localhost:4000/health
```

### Test API Endpoint
```bash
curl -X POST http://localhost:4000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Check Ports
```bash
lsof -ti:30000  # Frontend
lsof -ti:4000    # Backend
```

## Notes

- All URLs use 6-digit port (30000) for frontend
- Backend uses standard port (4000)
- Docker services use 5-digit ports (25000, 25100, 25200, 25201)
- CORS is configured to allow requests from `http://localhost:30000`

