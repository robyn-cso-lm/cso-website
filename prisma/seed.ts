/**
 * Seeds the admin user (Robyn) with the admin role.
 * Staff coordinators (Rana, Shondra, Cameron) don't need pre-seeding —
 * they'll be created automatically on their first magic-link sign-in.
 * Run: npx prisma db seed
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where:  { email: 'robyn@canadiansurrogacyoptions.com' },
    update: { role: 'admin' },
    create: {
      name:  'Robyn Price',
      email: 'robyn@canadiansurrogacyoptions.com',
      role:  'admin',
    },
  });
  console.log('Seeded admin: robyn@canadiansurrogacyoptions.com');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
