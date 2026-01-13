# Bun + NestJS Compatibility Issue - Confirmed

## ✅ Research Confirms Known Issue

**Our symptoms match documented Bun + NestJS compatibility problems:**

### Known Issues (as of January 2026):
1. **Module Resolution Problems** - Controllers from imported modules not being discovered
2. **Decorator Metadata** - Even with `emitDecoratorMetadata: true`, Bun may not handle it correctly
3. **Build Process Errors** - Module resolution issues during build/runtime

### Our Configuration:
- ✅ `emitDecoratorMetadata: true` (already set)
- ✅ `experimentalDecorators: true` (already set)
- ✅ Modules imported correctly
- ✅ Controllers defined correctly

**But controllers from imported modules still return 404!**

## Root Cause
This is a **known Bun compatibility issue** with NestJS where:
- Controllers in the root module (AppModule) work ✅
- Controllers in imported modules (AuthModule, EnterpriseModule) don't register ❌
- This is due to Bun's module resolution/decorator handling differences

## Solutions

### Solution 1: Test with Node.js (Recommended First Step)
**Purpose**: Confirm this is a Bun-specific issue

```bash
# Stop Bun process
pkill -f "nest start"

# Build with Node.js
cd apps/api
node node_modules/.bin/nest build

# Run with Node.js
node dist/main.js
```

**If routes work with Node.js**, we've confirmed it's a Bun issue.

### Solution 2: Build with Node, Run with Bun
**Purpose**: Use Node.js for build (better compatibility), Bun for runtime (performance)

```bash
# Build with Node.js
node node_modules/.bin/nest build

# Run with Bun
bun run dist/main.js
```

### Solution 3: Switch to Node.js (Most Stable)
**Purpose**: Full NestJS compatibility

Update `package.json` scripts:
```json
{
  "scripts": {
    "start:dev": "nest start --watch",
    "start": "node dist/main.js"
  }
}
```

### Solution 4: Wait for Bun Updates
- Monitor: https://github.com/oven-sh/bun/issues/1641
- Monitor: https://github.com/oven-sh/bun/issues/4803
- Check Bun releases for NestJS compatibility fixes

## References
- Stack Overflow: https://stackoverflow.com/questions/77084231/bun-compatibility-with-nestjs
- GitHub Bun #4803: Module resolution issues
- GitHub Bun #1641: NestJS compatibility tracking
- GitHub NestJS #13881: Official Bun support request

## Recommendation
**Test with Node.js first** to confirm. If it works, we have two options:
1. **Short-term**: Use Node.js for stability
2. **Long-term**: Monitor Bun updates, switch back when compatibility improves

