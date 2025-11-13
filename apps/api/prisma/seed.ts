import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.lawyer.deleteMany();

  // Seed lawyers
  const lawyers = await Promise.all([
    prisma.lawyer.create({
      data: {
        fullName: 'Sarah Johnson',
        city: 'New York',
        specialties: ['CRIMINAL', 'CIVIL'],
        yearsOfExperience: 15,
        ratingVector: {
          professionalism: 95,
          availability: 88,
          empathy: 92,
          cost: 75,
        },
      },
    }),
    prisma.lawyer.create({
      data: {
        fullName: 'Michael Chen',
        city: 'San Francisco',
        specialties: ['CORPORATE', 'INTELLECTUAL_PROPERTY'],
        yearsOfExperience: 12,
        ratingVector: {
          professionalism: 98,
          availability: 85,
          empathy: 78,
          cost: 65,
        },
      },
    }),
    prisma.lawyer.create({
      data: {
        fullName: 'Emily Rodriguez',
        city: 'Miami',
        specialties: ['FAMILY', 'IMMIGRATION'],
        yearsOfExperience: 8,
        ratingVector: {
          professionalism: 90,
          availability: 95,
          empathy: 98,
          cost: 85,
        },
      },
    }),
    prisma.lawyer.create({
      data: {
        fullName: 'David Thompson',
        city: 'Chicago',
        specialties: ['LABOR', 'CIVIL'],
        yearsOfExperience: 20,
        ratingVector: {
          professionalism: 92,
          availability: 80,
          empathy: 85,
          cost: 70,
        },
      },
    }),
    prisma.lawyer.create({
      data: {
        fullName: 'Jennifer Lee',
        city: 'Boston',
        specialties: ['TAX', 'CORPORATE'],
        yearsOfExperience: 10,
        ratingVector: {
          professionalism: 94,
          availability: 90,
          empathy: 82,
          cost: 72,
        },
      },
    }),
  ]);

  console.log(`✅ Seeded ${lawyers.length} lawyers`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
