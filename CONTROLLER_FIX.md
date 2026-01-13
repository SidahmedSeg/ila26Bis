# NestJS Controller Registration Fix

## Problem
Only `AppController` (with `@Controller()` - empty path) works. Controllers with paths (`@Controller('test')`, `@Controller('auth')`) return 404.

## Root Cause
Based on NestJS documentation and investigation, the issue is likely related to:
1. **Controller instantiation order** - Controllers with paths may not be properly instantiated
2. **Module initialization** - Modules that depend on Prisma may fail silently during initialization
3. **Route registration** - Routes may not be registered if controller instantiation fails

## Solution

### Fix 1: Ensure Prisma Client is Generated Before App Starts

The Prisma client must be generated before NestJS tries to instantiate services that depend on it.

**Add to `package.json` scripts:**
```json
{
  "scripts": {
    "prebuild": "cd ../../packages/shared && bunx prisma generate --schema=./prisma/schema.prisma",
    "build": "nest build",
    "start": "node dist/main.js",
    "start:dev": "nest start --watch"
  }
}
```

### Fix 2: Ensure Controllers Are Properly Exported

All controllers must be properly exported and imported in modules.

**Verify in `app.module.ts`:**
```typescript
import { TestController } from './test.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  controllers: [AppController, TestController], // All controllers listed
  // ...
})
```

### Fix 3: Check Controller Decorator Order

According to NestJS docs, decorators should be applied in the correct order. The `@Controller()` decorator should come first.

**Correct pattern:**
```typescript
@Controller('test')  // Path decorator first
export class TestController {
  @Get()  // Method decorator
  test() {
    return { message: 'Test controller works!' };
  }
}
```

### Fix 4: Ensure No Circular Dependencies

Check for circular dependencies between modules that might prevent proper initialization.

### Fix 5: Add Explicit Route Registration Logging

Add logging to see which controllers are being registered:

**In `main.ts`:**
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Log registered routes
  const router = app.getHttpAdapter().getInstance()._router;
  console.log('Registered routes:', router?.stack?.length || 0);
  
  // ... rest of bootstrap
}
```

## Recommended Immediate Fix

1. **Regenerate Prisma Client:**
   ```bash
   cd packages/shared
   bunx prisma generate --schema=./prisma/schema.prisma
   ```

2. **Clean and Rebuild:**
   ```bash
   cd apps/api
   rm -rf dist node_modules/.cache
   bun run build
   ```

3. **Verify Controller Registration:**
   - Check that all controllers are in the module's `controllers` array
   - Ensure no circular dependencies
   - Verify Prisma client is generated before app starts

4. **Test with Minimal Controller:**
   Create a controller that doesn't depend on any services to verify the pattern works.

## Next Steps

If the issue persists after these fixes, the problem may be:
- A bug in NestJS version 11.x with controller registration
- An issue with how Bun/Node.js handles decorators
- A problem with the build process

Consider:
- Updating NestJS to the latest version
- Testing with a fresh NestJS project to isolate the issue
- Checking NestJS GitHub issues for similar problems

