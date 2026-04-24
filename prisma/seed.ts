import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const STAFF = [
  { username: 'rana',    displayName: 'Rana',    password: 'ChangeMe2025!' },
  { username: 'shondra', displayName: 'Shondra', password: 'ChangeMe2025!' },
  { username: 'cameron', displayName: 'Cameron', password: 'ChangeMe2025!' },
];

async function main() {
  for (const member of STAFF) {
    const passwordHash = await bcrypt.hash(member.password, 12);
    await prisma.staffUser.upsert({
      where: { username: member.username },
      update: {},
      create: { username: member.username, displayName: member.displayName, passwordHash },
    });
    console.log(`Seeded staff account: ${member.username}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
