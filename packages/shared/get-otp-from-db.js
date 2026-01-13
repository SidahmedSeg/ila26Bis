// Quick script to get OTP from database for testing
// Run: cd packages/shared && bun get-otp-from-db.js test@example.com

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getOTP(email) {
  try {
    const otp = await prisma.oTP.findFirst({
      where: {
        email: email,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
      orderBy: {
        createdAt: 'desc', // Most recent
      },
    });

    if (otp) {
      console.log('✅ OTP Found:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Email: ${otp.email}`);
      console.log(`   Code: ${otp.code}`);
      console.log(`   Expires: ${otp.expiresAt}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return otp.code;
    } else {
      console.log('❌ No valid OTP found for:', email);
      console.log('');
      console.log('💡 To generate an OTP:');
      console.log('   1. Use the frontend: http://localhost:30000/register');
      console.log('   2. Or check Mailtrap: https://mailtrap.io/inboxes');
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2] || 'test@example.com';
getOTP(email);

