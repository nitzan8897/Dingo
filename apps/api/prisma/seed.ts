import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.lawyer.deleteMany();
  await prisma.city.deleteMany();

  // Seed cities
  const cities = await Promise.all([
    prisma.city.create({
      data: {
        nameEn: 'Yavne',
        nameHe: 'יבנה',
        slug: 'yavne',
      },
    }),
    prisma.city.create({
      data: {
        nameEn: 'Herzliya',
        nameHe: 'הרצליה',
        slug: 'herzliya',
      },
    }),
    prisma.city.create({
      data: {
        nameEn: 'Nokdim',
        nameHe: 'נוקדים',
        slug: 'nokdim',
      },
    }),
  ]);

  console.log(`✅ Seeded ${cities.length} cities`);

  // Get city IDs
  const yavne = cities.find(c => c.slug === 'yavne')!;
  const herzliya = cities.find(c => c.slug === 'herzliya')!;
  const nokdim = cities.find(c => c.slug === 'nokdim')!;

  // Seed lawyers
  const lawyers = await Promise.all([
    prisma.lawyer.create({
      data: {
        fullNameEn: 'Itay Levi',
        fullNameHe: 'איתי לוי',
        bioEn: 'Experienced criminal and civil law attorney with 15 years of practice. Specializes in complex litigation and dispute resolution.',
        bioHe: 'עורך דין מנוסה במשפט פלילי ואזרחי עם 15 שנות ניסיון. מתמחה בתביעות מורכבות ופתרון סכסוכים.',
        cityId: yavne.id,
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
        bioEn: 'Highly experienced corporate and IP attorney with exceptional expertise. Specializes in tech startups, patent law, and international business transactions.',
        bioHe: 'עורך דין מנוסה במיוחד בדיני חברות וקניין רוחני. מתמחה בסטארט-אפים טכנולוגיים, דיני פטנטים ועסקאות בינלאומיות.',
        cityId: yavne.id,
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
        bioEn: 'Compassionate family and immigration law specialist. Dedicated to helping families navigate complex legal processes with empathy and professionalism.',
        bioHe: 'מומחה אמפתי לדיני משפחה והגירה. מוקדש לסייע למשפחות לנווט בתהליכים משפטיים מורכבים עם אמפתיה ומקצועיות.',
        cityId: yavne.id,
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
        bioEn: 'Veteran labor and civil rights attorney with 20 years of experience. Known for strong advocacy and successful outcomes in employment disputes.',
        bioHe: 'עורך דין ותיק בדיני עבודה וזכויות אזרחיות עם 20 שנות ניסיון. ידוע בסנגור חזק ובתוצאות מוצלחות בסכסוכי עבודה.',
        cityId: herzliya.id,
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
        bioEn: 'Expert tax and corporate attorney. Provides strategic tax planning and corporate structuring services for businesses of all sizes.',
        bioHe: 'עורך דין מומחה במיסים ודיני חברות. מספק שירותי תכנון מס אסטרטגי ומבנה תאגידי לעסקים בכל הגדלים.',
        cityId: nokdim.id,
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
