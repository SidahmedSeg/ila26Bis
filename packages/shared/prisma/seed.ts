import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin users
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const superAdminPassword = await bcrypt.hash('SuperAdmin123!', 10);

  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@ila26.com' },
    update: {},
    create: {
      email: 'admin@ila26.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const superAdminUser = await prisma.adminUser.upsert({
    where: { email: 'superadmin@ila26.com' },
    update: {},
    create: {
      email: 'superadmin@ila26.com',
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ Admin users created:', {
    admin: adminUser.email,
    superAdmin: superAdminUser.email,
  });

  // Create default roles (system roles)
  const adminRole = await prisma.role.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Admin',
      isDefault: true,
      isSystem: true,
      description: 'Full access to all features and settings',
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Member',
      isDefault: true,
      isSystem: true,
      description: 'Standard user access',
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Viewer',
      isDefault: true,
      isSystem: true,
      description: 'Read-only access',
    },
  });

  // Add permissions to default roles
  // Admin role - all permissions
  await prisma.rolePermission.upsert({
    where: {
      roleId_module_permission: {
        roleId: adminRole.id,
        module: 'enterprise_profile',
        permission: 'WRITE',
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      module: 'enterprise_profile',
      permission: 'WRITE',
    },
  });

  // Member role - read and write
  await prisma.rolePermission.upsert({
    where: {
      roleId_module_permission: {
        roleId: memberRole.id,
        module: 'enterprise_profile',
        permission: 'WRITE',
      },
    },
    update: {},
    create: {
      roleId: memberRole.id,
      module: 'enterprise_profile',
      permission: 'WRITE',
    },
  });

  // Viewer role - read only
  await prisma.rolePermission.upsert({
    where: {
      roleId_module_permission: {
        roleId: viewerRole.id,
        module: 'enterprise_profile',
        permission: 'READ',
      },
    },
    update: {},
    create: {
      roleId: viewerRole.id,
      module: 'enterprise_profile',
      permission: 'READ',
    },
  });

  // Create sample activity domains
  const activity1 = await prisma.activityDomain.upsert({
    where: { id: '00000000-0000-0000-0000-000000000010' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000010',
      name: 'Technology',
      code: 'TECH',
      description: 'Technology and software companies',
    },
  });

  const activity2 = await prisma.activityDomain.upsert({
    where: { id: '00000000-0000-0000-0000-000000000011' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000011',
      name: 'Consulting',
      code: 'CONSULT',
      description: 'Business consulting services',
    },
  });

  // Create sample specialities
  await prisma.speciality.upsert({
    where: { id: '00000000-0000-0000-0000-000000000020' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000020',
      activityDomainId: activity1.id,
      name: 'Software Development',
      description: 'Custom software development',
    },
  });

  await prisma.speciality.upsert({
    where: { id: '00000000-0000-0000-0000-000000000021' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000021',
      activityDomainId: activity1.id,
      name: 'Cloud Services',
      description: 'Cloud infrastructure and services',
    },
  });

  await prisma.speciality.upsert({
    where: { id: '00000000-0000-0000-0000-000000000022' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000022',
      activityDomainId: activity2.id,
      name: 'Management Consulting',
      description: 'Business management consulting',
    },
  });

  // Create document categories
  await prisma.documentCategory.upsert({
    where: { id: '00000000-0000-0000-0000-000000000030' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000030',
      name: 'Legal',
      description: 'Legal documents',
    },
  });

  await prisma.documentCategory.upsert({
    where: { id: '00000000-0000-0000-0000-000000000031' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000031',
      name: 'Financial',
      description: 'Financial documents',
    },
  });

  await prisma.documentCategory.upsert({
    where: { id: '00000000-0000-0000-0000-000000000032' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000032',
      name: 'Other',
      description: 'Other documents',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('   - Default roles created (Admin, Member, Viewer)');
  console.log('   - Sample activity domains created');
  console.log('   - Sample specialities created');
  console.log('   - Document categories created');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

