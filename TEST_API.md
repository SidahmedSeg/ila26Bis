# API Testing Guide

## Quick Test Commands

### 1. Start Infrastructure (if not running)
```bash
docker-compose up -d
```

### 2. Test User API

```bash
cd apps/api

# Start the API
bun run start:dev

# In another terminal, test endpoints:
curl http://localhost:4000
# Expected: "Hello World!"

curl http://localhost:4000/health
# Expected: {"status":"ok","database":"connected","timestamp":"..."}
```

### 3. Test Admin API

```bash
cd apps/admin-api

# Start the API
bun run start:dev

# In another terminal, test endpoints:
curl http://localhost:4001
# Expected: "Hello World!"

curl http://localhost:4001/health
# Expected: {"status":"ok","database":"connected","timestamp":"..."}
```

## Expected Results

### User API (http://localhost:4000)
- ✅ `GET /` → "Hello World!"
- ✅ `GET /health` → Database connection status

### Admin API (http://localhost:4001)
- ✅ `GET /` → "Hello World!"
- ✅ `GET /health` → Database connection status

## Troubleshooting

### API won't start
- Check if port is already in use: `lsof -i :4000` or `lsof -i :4001`
- Verify .env file exists: `ls apps/api/.env`
- Check database is running: `docker-compose ps postgres`

### Database connection error
- Verify PostgreSQL is running: `docker-compose ps postgres`
- Check DATABASE_URL in .env file
- Test connection: `docker-compose exec postgres psql -U ila26 -d ila26_dev -c "SELECT 1;"`

### Prisma errors
- Regenerate Prisma client: `cd packages/shared/prisma && bunx prisma generate --schema=./schema.prisma`
- Check Prisma module is imported in AppModule

---

**Ready to test!** Start both APIs and verify they connect to the database.

