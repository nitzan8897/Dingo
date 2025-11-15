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
        fullNameEn: 'Itay Levi',
        fullNameHe: 'איתי לוי',
        city: 'יבנה',
        specialties: ['CRIMINAL', 'CIVIL'],
        yearsOfExperience: 15,
        ratingVector: {
          professionalism: 69,
          availability: 99,
          empathy: 3,
          cost: 2,
        },
      },
    }),
    prisma.lawyer.create({
      data: {
        fullNameEn: 'Nitzan Avargil',
        fullNameHe: 'ניצן אברגיל',
        city: 'יבנה',
        specialties: ['CORPORATE', 'INTELLECTUAL_PROPERTY'],
        yearsOfExperience: 300,
        ratingVector: {
          professionalism: 99,
          availability: 56,
          empathy: 90,
          cost: 100,
        },
      },
    }),
    prisma.lawyer.create({
      data: {
        fullNameEn: 'Nir Shakibi',
        fullNameHe: 'ניר שקיבי',
        city: 'יבנה',
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
        fullNameEn: 'Shachar Koren',
        fullNameHe: 'שחר קורן',
        city: 'הרצליה',
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
        fullNameEn: 'Ben Buchris',
        fullNameHe: 'בן בוכריס',
        city: 'נוקדים',
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
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
