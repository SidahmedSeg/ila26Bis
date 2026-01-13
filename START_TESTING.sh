#!/bin/bash

# Script to start all services for testing

set -e

echo "🚀 Starting ila26 Testing Environment"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start Docker services
echo -e "${YELLOW}📦 Starting Docker services (PostgreSQL, Redis, MinIO)...${NC}"
cd "$(dirname "$0")"
docker-compose up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Docker services are running${NC}"
else
    echo -e "${RED}❌ Some Docker services failed to start${NC}"
    docker-compose ps
    exit 1
fi

# Check environment files
echo ""
echo -e "${YELLOW}🔍 Checking environment files...${NC}"

if [ ! -f "apps/api/.env" ]; then
    echo -e "${RED}❌ apps/api/.env is missing${NC}"
    echo -e "${YELLOW}   Please create it from apps/api/.env.example${NC}"
    exit 1
else
    echo -e "${GREEN}✅ apps/api/.env exists${NC}"
fi

if [ ! -f "apps/ila26/.env.local" ]; then
    echo -e "${YELLOW}⚠️  apps/ila26/.env.local is missing${NC}"
    echo -e "${YELLOW}   Creating from template...${NC}"
    cat > apps/ila26/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000
EOF
    echo -e "${GREEN}✅ Created apps/ila26/.env.local${NC}"
else
    echo -e "${GREEN}✅ apps/ila26/.env.local exists${NC}"
fi

# Check if database migrations are needed
echo ""
echo -e "${YELLOW}📊 Checking database migrations...${NC}"
cd packages/shared
if bunx prisma migrate status 2>&1 | grep -q "Database schema is up to date"; then
    echo -e "${GREEN}✅ Database is up to date${NC}"
else
    echo -e "${YELLOW}⚠️  Database migrations may be needed${NC}"
    echo -e "${YELLOW}   Run: cd packages/shared && bunx prisma migrate dev${NC}"
fi

cd - > /dev/null

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Start Backend API:"
echo "   ${GREEN}cd apps/api && bun run start:dev${NC}"
echo ""
echo "2. Start Frontend (in another terminal):"
echo "   ${GREEN}cd apps/ila26 && bun run dev${NC}"
echo ""
echo "3. Access:"
echo "   - Frontend: ${GREEN}http://localhost:30000${NC}"
echo "   - Backend API: ${GREEN}http://localhost:4000${NC}"
echo "   - Swagger Docs: ${GREEN}http://localhost:4000/api/docs${NC}"
echo "   - MinIO Console: ${GREEN}http://localhost:25201${NC}"
echo ""
echo "See TESTING_GUIDE.md for detailed testing instructions."

