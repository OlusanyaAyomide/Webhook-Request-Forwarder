import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.project.create({
    data: {
      name: 'Test Project',
      slug: 'test-project',
      suffix: '123456',
      pathSegment: 'test-project-123456',
      forwarderBaseUrl: 'https://example.com',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
