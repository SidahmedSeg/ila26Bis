# Bun Runtime - Setup and Benefits

## Overview

Bun is a fast, all-in-one JavaScript runtime, bundler, test runner, and package manager designed as a drop-in replacement for Node.js.

---

## Why Bun?

### Performance Benefits
- **3-4x faster** than Node.js
- **Faster startup** times
- **Lower memory** usage
- **Native speed** JavaScript execution

### Built-in Tools
- **Package Manager**: `bun install` (faster than npm)
- **Bundler**: Built-in bundler (faster than webpack/rollup)
- **Test Runner**: Built-in test runner (faster than Jest)
- **Runtime**: Direct execution (no need for `node`)

### Developer Experience
- **Native TypeScript**: No compilation needed
- **Node.js Compatible**: Works with most npm packages
- **Better Error Messages**: More helpful stack traces
- **Hot Reload**: Built-in development server

---

## Installation

### macOS/Linux
```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows
- Use WSL (Windows Subsystem for Linux)
- Or download from: https://bun.sh

### Verify Installation
```bash
bun --version
# Should output: 1.0.x or higher
```

---

## Bun vs Node.js Commands

| Task | Node.js/npm | Bun |
|------|-------------|-----|
| Install dependencies | `npm install` | `bun install` |
| Run script | `npm run dev` | `bun run dev` |
| Run file | `node index.js` | `bun index.js` |
| Run TypeScript | `tsx index.ts` | `bun index.ts` |
| Test | `npm test` | `bun test` |
| Build | `npm run build` | `bun build` |
| Package manager | npm/pnpm/yarn | bun |

---

## Project Setup with Bun

### package.json
```json
{
  "name": "ila26-api",
  "version": "1.0.0",
  "scripts": {
    "dev": "bun run src/main.ts",
    "build": "bun build src/main.ts --outdir ./dist",
    "start": "bun run dist/main.js",
    "test": "bun test",
    "prisma:migrate": "bunx prisma migrate dev",
    "prisma:generate": "bunx prisma generate",
    "prisma:seed": "bunx prisma db seed"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "prisma": "^5.0.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@prisma/client": "^5.0.0",
    "stripe": "^14.0.0"
  }
}
```

### Installing Dependencies
```bash
# Install all dependencies (faster than npm!)
bun install

# Add a new package
bun add stripe

# Add dev dependency
bun add -d @types/node
```

---

## Framework Compatibility

### NestJS with Bun
NestJS works with Bun! You can use NestJS normally:

```bash
# Install NestJS CLI
bun add -g @nestjs/cli

# Create new project (if needed)
nest new project-name

# Run with Bun
bun run start:dev
```

**Note**: Most NestJS features work, but verify compatibility for:
- File watching (works with Bun)
- Hot reload (built-in with Bun)
- Custom decorators (works)

### Elysia (Bun-native Alternative)
If you want a Bun-optimized framework:

```bash
# Install Elysia
bun add elysia

# Example:
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => 'Hello from ila26!')
  .listen(3000)
```

---

## Native TypeScript Support

Bun has native TypeScript support - no compilation needed!

```typescript
// src/main.ts (TypeScript)
export function hello(name: string): string {
  return `Hello, ${name}!`
}

// Run directly
bun src/main.ts
```

---

## Built-in Password Hashing

Bun includes built-in password hashing:

```typescript
import { password } from 'bun'

// Hash password
const hash = await Bun.password.hash('mySecurePassword')

// Verify password
const isValid = await Bun.password.verify('mySecurePassword', hash)
```

This is faster than bcrypt and uses scrypt/bcrypt algorithms.

---

## Built-in Test Runner

Bun has a built-in test runner (faster than Jest):

```typescript
// src/test.ts
import { test, expect } from 'bun:test'

test('user creation', async () => {
  const user = await createUser({ email: 'test@example.com' })
  expect(user.email).toBe('test@example.com')
})

// Run tests
bun test
```

---

## Prisma with Bun

Prisma works perfectly with Bun:

```bash
# Install Prisma
bun add prisma @prisma/client
bun add -d prisma

# Initialize Prisma
bunx prisma init

# Generate client
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# Seed database
bunx prisma db seed
```

**Note**: Use `bunx` instead of `npx` - it's faster!

---

## Environment Variables

Bun supports `.env` files automatically:

```bash
# .env
DATABASE_URL="postgresql://..."
STRIPE_SECRET_KEY="sk_..."
JWT_SECRET="your-secret"

# Access in code
const dbUrl = process.env.DATABASE_URL
```

---

## Performance Comparison

### Installation Speed
- **npm**: ~30-60 seconds
- **Bun**: ~5-10 seconds ⚡

### Runtime Speed
- **Node.js**: Baseline
- **Bun**: 3-4x faster ⚡

### Test Execution
- **Jest**: ~10 seconds
- **Bun test**: ~2-3 seconds ⚡

---

## Migration from Node.js

### Easy Migration
1. Install Bun
2. Replace `npm` commands with `bun`
3. Replace `node` commands with `bun`
4. Most npm packages work without changes

### Example Migration
```bash
# Before (Node.js)
npm install
npm run dev
node src/index.js
npm test

# After (Bun)
bun install
bun run dev
bun src/index.js
bun test
```

---

## Limitations & Considerations

### Compatibility
- **Most npm packages work** with Bun
- Some packages with native dependencies may need verification
- NestJS: Most features work, verify custom modules
- Next.js: Can use Bun runtime, but typically uses Node.js

### Production Deployment
- Bun is production-ready
- Works in Docker containers
- Compatible with most deployment platforms
- Consider using Bun runtime in production for better performance

---

## Recommended Setup for ila26

### Backend API (Bun + NestJS)
```bash
# Install dependencies
bun install

# Development
bun run start:dev

# Production build
bun run build

# Production start
bun run start
```

### Frontend (Next.js)
- Can use Bun for faster package installation
- Runtime: Node.js (Next.js default) or Bun
- `bun install` works for frontend too!

### Database Migrations
```bash
# Use bunx instead of npx
bunx prisma migrate dev
bunx prisma generate
```

---

## Benefits for ila26 Project

1. **Faster Development**: Quicker installs and builds
2. **Better Performance**: Faster API responses
3. **Simplified Toolchain**: One tool instead of multiple
4. **Native TypeScript**: No compilation step
5. **Built-in Testing**: Faster test execution
6. **Modern Runtime**: Optimized for modern JavaScript

---

## Resources

- **Official Website**: https://bun.sh
- **Documentation**: https://bun.sh/docs
- **GitHub**: https://github.com/oven-sh/bun
- **Discord**: https://bun.sh/discord

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]

