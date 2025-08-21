import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create default account
  const account = await prisma.account.upsert({
    where: { id: 'account_1' },
    update: {},
    create: {
      id: 'account_1',
      name: 'Default Account',
      apiKey: 'default_api_key',
    },
  });

  // Create default theme (this should not be deletable)
  const defaultTheme = await prisma.theme.upsert({
    where: { id: 'default_theme' },
    update: {},
    create: {
      id: 'default_theme',
      name: 'Default Theme',
      accountId: account.id,
      config: {
        modal: {
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          titleColor: '#1a1a1a',
        },
        button: {
          backgroundColor: '#007bff',
          textColor: '#ffffff',
          borderRadius: '8px',
        },
        secondaryButton: {
          backgroundColor: '#ffffff',
          textColor: '#6c757d',
          borderColor: '#6c757d',
          borderRadius: '8px',
        },
      },
    },
  });

  console.log('Seeded default account and theme');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
