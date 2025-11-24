import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.lawyer.deleteMany();
  await prisma.city.deleteMany();

  // Seed cities (including Unknown for pending lawyers)
  const cities = await Promise.all([
    prisma.city.create({
      data: {
        nameEn: 'Unknown',
        nameHe: 'לא ידוע',
        slug: 'unknown',
      },
    }),
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
    prisma.city.create({
      data: {
        nameEn: 'Tel Aviv',
        nameHe: 'תל אביב',
        slug: 'tel-aviv',
      },
    }),
    prisma.city.create({
      data: {
        nameEn: 'Jerusalem',
        nameHe: 'ירושלים',
        slug: 'jerusalem',
      },
    }),
    prisma.city.create({
      data: {
        nameEn: 'Haifa',
        nameHe: 'חיפה',
        slug: 'haifa',
      },
    }),
  ]);

  console.log(`✅ Seeded ${cities.length} cities`);

  // Get city IDs
  const yavne = cities.find(c => c.slug === 'yavne')!;
  const herzliya = cities.find(c => c.slug === 'herzliya')!;
  const nokdim = cities.find(c => c.slug === 'nokdim')!;
  const telAviv = cities.find(c => c.slug === 'tel-aviv')!;
  const jerusalem = cities.find(c => c.slug === 'jerusalem')!;
  const haifa = cities.find(c => c.slug === 'haifa')!;

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
    prisma.lawyer.create({
      data: {
        fullNameEn: 'Ofri Hasson',
        fullNameHe: 'אופרי חסון',
        bioEn: 'Skilled real estate and contract attorney. Specializes in commercial real estate transactions and property law.',
        bioHe: 'עורך דין מיומן במקרקעין וחוזים. מתמחה בעסקאות נדל"ן מסחרי ודיני רכוש.',
        cityId: telAviv.id,
        specialties: ['REAL_ESTATE', 'CIVIL'],
        yearsOfExperience: 12,
        ratingVector: {
          professionalism: 88,
          availability: 85,
          empathy: 75,
          cost: 78,
        },
      },
    }),
    prisma.lawyer.create({
      data: {
        fullNameEn: 'Tal Francis',
        fullNameHe: 'טל פרנסיס',
        bioEn: 'Environmental and administrative law specialist. Dedicated to protecting environmental rights and public interest.',
        bioHe: 'מומחה לדיני סביבה ומשפט מינהלי. מוקדש להגנה על זכויות סביבתיות ואינטרס ציבורי.',
        cityId: haifa.id,
        specialties: ['ENVIRONMENTAL', 'CIVIL'],
        yearsOfExperience: 14,
        ratingVector: {
          professionalism: 91,
          availability: 88,
          empathy: 93,
          cost: 80,
        },
      },
    }),
    prisma.lawyer.create({
      data: {
        fullNameEn: 'Yuval Avargil',
        fullNameHe: 'יובל אברגיל',
        bioEn: 'Medical malpractice and personal injury attorney. Strong advocate for victims seeking justice and compensation.',
        bioHe: 'עורך דין ברשלנות רפואית ונזיקין. סנגור חזק לקורבנות המבקשים צדק ופיצויים.',
        cityId: jerusalem.id,
        specialties: ['MEDICAL', 'CIVIL'],
        yearsOfExperience: 18,
        ratingVector: {
          professionalism: 95,
          availability: 82,
          empathy: 96,
          cost: 68,
        },
      },
    }),
    prisma.lawyer.create({
      data: {
        fullNameEn: 'Liam Avargil',
        fullNameHe: 'ליאם אברגיל',
        bioEn: 'Bankruptcy and financial restructuring attorney. Helps businesses and individuals navigate complex insolvency proceedings.',
        bioHe: 'עורך דין פשיטת רגל וארגון מחדש פיננסי. עוזר לעסקים ויחידים לנווט בהליכי חדלות פירעון מורכבים.',
        cityId: telAviv.id,
        specialties: ['BANKRUPTCY', 'CORPORATE'],
        yearsOfExperience: 16,
        ratingVector: {
          professionalism: 89,
          availability: 91,
          empathy: 84,
          cost: 75,
        },
      },
    }),
    prisma.lawyer.create({
      data: {
        fullNameEn: 'Amir Levi',
        fullNameHe: 'אמיר לוי',
        bioEn: 'Criminal defense and white-collar crime attorney. Aggressive defender with proven track record in complex criminal cases.',
        bioHe: 'עורך דין הגנה פלילית ופשעי צווארון לבן. מגן אגרסיבי עם רקורד מוכח בתיקים פליליים מורכבים.',
        cityId: herzliya.id,
        specialties: ['CRIMINAL', 'CORPORATE'],
        yearsOfExperience: 22,
        ratingVector: {
          professionalism: 93,
          availability: 79,
          empathy: 71,
          cost: 65,
        },
      },
    }),
    prisma.lawyer.create({
      data: {
        fullNameEn: 'Tzippora Elek',
        fullNameHe: 'ציפורה אלק',
        bioEn: 'Immigration and asylum law expert. Compassionate advocate for refugees and immigrants seeking legal status.',
        bioHe: 'מומחית לדיני הגירה ומקלט. סנגורית רחומה לפליטים ומהגרים המבקשים מעמד חוקי.',
        cityId: jerusalem.id,
        specialties: ['IMMIGRATION', 'FAMILY'],
        yearsOfExperience: 13,
        ratingVector: {
          professionalism: 87,
          availability: 94,
          empathy: 98,
          cost: 88,
        },
      },
    }),
  ]);

  console.log(`✅ Seeded ${lawyers.length} lawyers`);

  // Note: Court cases (Case model) are seeded separately via seed-court-cases.ts
  // ProfileCases have been deprecated in favor of using only court cases

  // Seed reviews for each lawyer
  const reviews = [];

  // Reviews for Itay Levi
  reviews.push(
    await prisma.review.create({
      data: {
        lawyerId: lawyers[0].id,
        reviewerName: 'David Cohen',
        rating: 5,
        commentEn: 'Itay is an outstanding attorney. He fought tirelessly for my case and achieved a fantastic result. Highly recommend!',
        commentHe: 'איתי הוא עורך דין מצטיין. הוא נלחם ללא לאות עבור התיק שלי והשיג תוצאה פנטסטית. ממליץ בחום!',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[0].id,
        reviewerName: 'Sarah Miller',
        rating: 4,
        commentEn: 'Very professional and knowledgeable. Communication could be better but overall satisfied with the outcome.',
        commentHe: 'מאד מקצועי ובעל ידע. התקשורת יכולה להיות טובה יותר אבל בסך הכל מרוצה מהתוצאה.',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[0].id,
        reviewerName: 'Michael Green',
        rating: 5,
        commentEn: 'Best criminal lawyer in the area. Itay\'s expertise and dedication are unmatched. Worth every penny.',
        commentHe: 'עורך הדין הפלילי הטוב ביותר באזור. המומחיות והמסירות של איתי ללא תחרות. שווה כל שקל.',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[0].id,
        reviewerName: 'Rachel Stein',
        rating: 3,
        commentEn: 'Good lawyer but very expensive. Results were satisfactory but expected more for the price.',
        commentHe: 'עורך דין טוב אבל יקר מאד. התוצאות היו משביעות רצון אבל ציפיתי ליותר במחיר הזה.',
      },
    }),
  );

  // Reviews for Nitzan Avargil
  reviews.push(
    await prisma.review.create({
      data: {
        lawyerId: lawyers[1].id,
        reviewerName: 'Tech Founder',
        rating: 5,
        commentEn: 'Absolute genius in corporate law and IP. Nitzan saved our startup millions in the M&A deal. Can\'t recommend enough!',
        commentHe: 'גאון מוחלט בדיני חברות וקניין רוחני. ניצן חסך לסטארט-אפ שלנו מיליונים בעסקת המיזוג. לא יכול להמליץ מספיק!',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[1].id,
        reviewerName: 'Anna Levy',
        rating: 5,
        commentEn: 'Nitzan is simply the best. Professional, responsive, and incredibly knowledgeable. A true expert in his field.',
        commentHe: 'ניצן הוא פשוט הטוב ביותר. מקצועי, זמין ובעל ידע מדהים. מומחה אמיתי בתחום שלו.',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[1].id,
        reviewerName: 'CEO Global Corp',
        rating: 5,
        commentEn: 'Handled our international IP licensing with exceptional skill. Nitzan is worth every shekel and then some.',
        commentHe: 'טיפל ברישוי הקניין הרוחני הבינלאומי שלנו במיומנות יוצאת דופן. ניצן שווה כל שקל ועוד מעבר.',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[1].id,
        reviewerName: 'Mark Israeli',
        rating: 4,
        commentEn: 'Top-tier lawyer but availability can be limited due to high demand. Results speak for themselves though.',
        commentHe: 'עורך דין מהשורה הראשונה אבל הזמינות יכולה להיות מוגבלת בגלל ביקוש גבוה. התוצאות מדברות בעד עצמן.',
      },
    }),
  );

  // Reviews for Nir Shakibi
  reviews.push(
    await prisma.review.create({
      data: {
        lawyerId: lawyers[2].id,
        reviewerName: 'Julia Friedman',
        rating: 5,
        commentEn: 'Nir helped me through the most difficult time of my life with such compassion and professionalism. Forever grateful.',
        commentHe: 'ניר עזר לי לעבור את התקופה הקשה ביותר בחיי עם כל כך הרבה חמלה ומקצועיות. אסיר תודה לנצח.',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[2].id,
        reviewerName: 'Dmitri Volkov',
        rating: 5,
        commentEn: 'Excellent immigration lawyer! Nir brought my family to Israel smoothly and quickly. Highly recommended.',
        commentHe: 'עורך דין הגירה מעולה! ניר הביא את משפחתי לישראל בצורה חלקה ומהירה. ממליץ בחום.',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[2].id,
        reviewerName: 'Tom Shapiro',
        rating: 5,
        commentEn: 'Very empathetic and understanding. Nir made a difficult custody situation much easier to navigate. Great lawyer.',
        commentHe: 'מאד אמפתי ומבין. ניר הפך מצב משמורת קשה להרבה יותר קל לניווט. עורך דין מעולה.',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[2].id,
        reviewerName: 'Lisa Abraham',
        rating: 4,
        commentEn: 'Good family lawyer, fair pricing. Could be a bit more aggressive in negotiations but overall positive experience.',
        commentHe: 'עורך דין משפחה טוב, תמחור הוגן. יכול להיות קצת יותר אגרסיבי במשא ומתן אבל חוויה חיובית בסך הכל.',
      },
    }),
  );

  // Reviews for Shachar Koren
  reviews.push(
    await prisma.review.create({
      data: {
        lawyerId: lawyers[3].id,
        reviewerName: 'Employee Anonymous',
        rating: 5,
        commentEn: 'Shachar is a fierce advocate for workers\' rights. Won me a great settlement against my former employer.',
        commentHe: 'שחר הוא סנגור נלהב לזכויות עובדים. זכה לי בהסדר מצוין מול המעסיק הקודם שלי.',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[3].id,
        reviewerName: 'Karen Davis',
        rating: 4,
        commentEn: 'Strong labor attorney with lots of experience. Communication was good and results were favorable.',
        commentHe: 'עורך דין עבודה חזק עם הרבה ניסיון. התקשורת הייתה טובה והתוצאות היו חיוביות.',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[3].id,
        reviewerName: 'Alex Romano',
        rating: 5,
        commentEn: 'Shachar knows labor law inside and out. Highly professional and gets results. Couldn\'t be happier.',
        commentHe: 'שחר מכיר את דיני העבודה לעומק. מאד מקצועי ומשיג תוצאות. לא יכולתי להיות מרוצה יותר.',
      },
    }),
  );

  // Reviews for Ben Buchris
  reviews.push(
    await prisma.review.create({
      data: {
        lawyerId: lawyers[4].id,
        reviewerName: 'Business Owner',
        rating: 5,
        commentEn: 'Ben saved my company millions in tax disputes. Brilliant strategist and excellent communicator.',
        commentHe: 'בן חסך לחברה שלי מיליונים בסכסוכי מס. אסטרטג מבריק ומתקשר מעולה.',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[4].id,
        reviewerName: 'CFO Tech Co',
        rating: 5,
        commentEn: 'Outstanding tax attorney. Ben\'s expertise in corporate restructuring is unmatched. Highly recommend.',
        commentHe: 'עורך דין מסים מצטיין. המומחיות של בן בארגון מחדש תאגידי ללא תחרות. ממליץ בחום.',
      },
    }),
    await prisma.review.create({
      data: {
        lawyerId: lawyers[4].id,
        reviewerName: 'Rebecca Gold',
        rating: 4,
        commentEn: 'Very knowledgeable in tax law. Pricing is fair for the level of expertise. Would use again.',
        commentHe: 'בעל ידע רב בדיני מסים. התמחור הוגן ברמת המומחיות. הייתי משתמש שוב.',
      },
    }),
  );

  console.log(`✅ Seeded ${reviews.length} reviews`);
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
