# Docker Setup Notes

## Port Configuration

The following 5-digit ports are used:

- **PostgreSQL**: Port `25000` (mapped to container port 5432)
- **Redis**: Port `25100` (mapped to container port 6379)
- **MinIO**: Ports `25200` and `25201` (mapped to container ports 9000 and 9001)

## Environment Variables

When using these services, update your DATABASE_URL:

```env
DATABASE_URL="postgresql://ila26:ila26_dev_password@localhost:25000/ila26_dev?schema=public"
REDIS_HOST=localhost
REDIS_PORT=25100
MINIO_ENDPOINT=localhost
MINIO_PORT=25200
```

## Starting Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgres

# Check status
docker-compose ps

# View logs
docker-compose logs -f postgres
```

## Troubleshooting

If you need to use different ports, update `docker-compose.yml` and change the host ports (left side of the colon).

