import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create test account
  const account = await prisma.account.upsert({
    where: { id: 'account_1' },
    update: {},
    create: {
      id: 'account_1',
      name: 'Test Account',
      apiKey: 'test_api_key',
    },
  });

  // Create test user
  const user = await prisma.user.upsert({
    where: { id: 'user_1' },
    update: {},
    create: {
      id: 'user_1',
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  // Create account-user relationship
  await prisma.accountUser.upsert({
    where: { id: 'account_user_1' },
    update: {},
    create: {
      id: 'account_user_1',
      accountId: account.id,
      userId: user.id,
      role: 'owner',
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
