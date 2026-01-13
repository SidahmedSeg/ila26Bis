#!/usr/bin/env node
/**
 * Fix Prisma client path resolution for Bun
 * Creates necessary symlinks so Bun can find .prisma/client/default
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const prismaClientDirs = [
  path.join(rootDir, 'node_modules/.bun/@prisma+client@5.22.0+f01948e2630c7aba/node_modules/@prisma/client'),
  path.join(rootDir, 'node_modules/.bun/@prisma+client@5.22.0/node_modules/@prisma/client'),
];

function fixPrismaPaths(clientDir) {
  if (!fs.existsSync(clientDir)) {
    return false;
  }

  const prismaDir = path.join(clientDir, '.prisma');
  const prismaClientDir = path.join(prismaDir, 'client');
  
  // Try multiple possible locations for .prisma
  const possibleSourceDirs = [
    path.join(clientDir, '../../.prisma'),  // @prisma/client -> ../ -> node_modules -> ../ -> .prisma
    path.join(clientDir, '../.prisma'),     // @prisma/client -> ../ -> .prisma
    path.join(rootDir, 'node_modules/.bun/@prisma+client@5.22.0+f01948e2630c7aba/node_modules/.prisma'),
    path.join(rootDir, 'node_modules/.bun/@prisma+client@5.22.0/node_modules/.prisma'),
  ];
  
  let sourcePrismaDir = null;
  for (const possibleDir of possibleSourceDirs) {
    if (fs.existsSync(possibleDir) && fs.existsSync(path.join(possibleDir, 'client'))) {
      sourcePrismaDir = possibleDir;
      break;
    }
  }

  try {
    // Check if source .prisma/client exists
    if (!sourcePrismaDir || !fs.existsSync(path.join(sourcePrismaDir, 'client'))) {
      console.log(`⚠️  Source .prisma/client not found. Checked: ${possibleSourceDirs.join(', ')}`);
      return false;
    }

    // Use absolute path for symlink to ensure it works from any location
    const absoluteSourcePath = path.resolve(sourcePrismaDir);
    
    // Remove existing .prisma if it's not a symlink or points to wrong location
    if (fs.existsSync(prismaDir)) {
      const stats = fs.lstatSync(prismaDir);
      if (stats.isSymbolicLink()) {
        // Already a symlink, check if it points to the right place
        const target = fs.readlinkSync(prismaDir);
        const resolvedTarget = path.resolve(path.dirname(prismaDir), target);
        if (resolvedTarget === absoluteSourcePath) {
          console.log(`✅ Symlink already correct: ${prismaDir} -> ${absoluteSourcePath}`);
          return true;
        }
        // Remove incorrect symlink
        fs.unlinkSync(prismaDir);
      } else if (stats.isDirectory()) {
        // Remove directory if it exists
        fs.rmSync(prismaDir, { recursive: true, force: true });
      }
    }

    // Use copy instead of symlink - Bun's module resolver has issues with symlinks
    // Copy the entire .prisma directory to ensure Bun can resolve it
    if (fs.existsSync(prismaDir)) {
      fs.rmSync(prismaDir, { recursive: true, force: true });
    }
    fs.cpSync(absoluteSourcePath, prismaDir, { recursive: true });
    console.log(`✅ Copied .prisma directory: ${prismaDir} <- ${absoluteSourcePath}`);
    
    // Fix default.js require path for Bun compatibility
    const defaultJsPath = path.join(clientDir, 'default.js');
    if (fs.existsSync(defaultJsPath)) {
      let content = fs.readFileSync(defaultJsPath, 'utf8');
      // Fix relative require path - Bun needs explicit ./ prefix
      if (content.includes("require('.prisma/client/default')") && !content.includes("require('./.prisma/client/default')")) {
        content = content.replace(/require\('\.prisma\/client\/default'\)/g, "require('./.prisma/client/default')");
        fs.writeFileSync(defaultJsPath, content, 'utf8');
        console.log(`✅ Fixed require path in ${defaultJsPath}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error fixing paths for ${clientDir}:`, error.message);
    return false;
  }
}

// Fix paths for all Prisma client installations
let fixed = 0;
for (const clientDir of prismaClientDirs) {
  if (fixPrismaPaths(clientDir)) {
    fixed++;
  }
}

if (fixed > 0) {
  console.log(`✅ Fixed Prisma paths for ${fixed} installation(s)`);
} else {
  console.log('ℹ️  No Prisma client paths needed fixing');
}

process.exit(0);

