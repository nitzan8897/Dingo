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
  await prisma.profileCase.deleteMany();
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

  // Seed cases for each lawyer
  const cases = [];

  // Itay Levi - Criminal and Civil cases
  cases.push(
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[0].id,
        titleEn: 'State vs. Cohen - Fraud Case',
        titleHe: 'מדינת ישראל נ\' כהן - תיק הונאה',
        descriptionEn: 'Successfully defended client against fraud charges, resulting in full acquittal after demonstrating lack of criminal intent.',
        descriptionHe: 'הגנה מוצלחת על לקוח נגד אישומי הונאה, שהסתיימה בזיכוי מלא לאחר הוכחת היעדר כוונה פלילית.',
        outcome: 'WON',
        year: 2023,
        isFeatured: true,
      },
    }),
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[0].id,
        titleEn: 'Civil Dispute - Property Rights',
        titleHe: 'סכסוך אזרחי - זכויות קניין',
        descriptionEn: 'Represented plaintiff in complex property dispute. Case settled favorably before trial.',
        descriptionHe: 'ייצגתי תובע בסכסוך קניין מורכב. התיק הוסדר לטובת הלקוח לפני המשפט.',
        outcome: 'SETTLED',
        year: 2022,
        isFeatured: true,
      },
    }),
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[0].id,
        titleEn: 'Criminal Defense - Assault Charges',
        titleHe: 'הגנה פלילית - אישומי תקיפה',
        descriptionEn: 'Ongoing defense case for assault charges. Currently in pre-trial proceedings.',
        descriptionHe: 'תיק הגנה מתמשך באישומי תקיפה. כעת בהליכי קדם משפט.',
        outcome: 'ONGOING',
        year: 2024,
        isFeatured: false,
      },
    }),
  );

  // Nitzan Avargil - Corporate and IP cases
  cases.push(
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[1].id,
        titleEn: 'Tech Startup M&A Transaction',
        titleHe: 'עסקת מיזוג ורכישה לסטארט-אפ טכנולוגי',
        descriptionEn: 'Led $50M acquisition deal for cybersecurity startup. Negotiated favorable terms and structured tax-efficient transaction.',
        descriptionHe: 'הובלתי עסקת רכישה של 50 מיליון דולר לסטארט-אפ בתחום אבטחת מידע. משא ומתן על תנאים נוחים ומבנה עסקה יעיל ממס.',
        outcome: 'WON',
        year: 2023,
        isFeatured: true,
      },
    }),
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[1].id,
        titleEn: 'Patent Infringement Litigation',
        titleHe: 'תביעת הפרת פטנט',
        descriptionEn: 'Defended client against patent infringement claims. Won dismissal of all claims with prejudice.',
        descriptionHe: 'הגנתי על לקוח מפני תביעות הפרת פטנט. זכיתי בדחיית כל התביעות באופן סופי.',
        outcome: 'WON',
        year: 2022,
        isFeatured: true,
      },
    }),
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[1].id,
        titleEn: 'International IP Licensing Agreement',
        titleHe: 'הסכם רישוי קניין רוחני בינלאומי',
        descriptionEn: 'Structured complex cross-border IP licensing deal for AI technology across 15 countries.',
        descriptionHe: 'מבנה עסקת רישוי קניין רוחני חוצת גבולות מורכבת עבור טכנולוגיית AI ב-15 מדינות.',
        outcome: 'WON',
        year: 2024,
        isFeatured: true,
      },
    }),
  );

  // Nir Shakibi - Family and Immigration cases
  cases.push(
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[2].id,
        titleEn: 'Child Custody Agreement',
        titleHe: 'הסכם משמורת ילדים',
        descriptionEn: 'Mediated successful custody arrangement prioritizing children\'s wellbeing. Both parties satisfied with outcome.',
        descriptionHe: 'תיווך מוצלח להסדר משמורת שמעדיף את רווחת הילדים. שני הצדדים מרוצים מהתוצאה.',
        outcome: 'SETTLED',
        year: 2023,
        isFeatured: true,
      },
    }),
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[2].id,
        titleEn: 'Family Reunification Visa',
        titleHe: 'ויזת איחוד משפחות',
        descriptionEn: 'Successfully obtained family reunification visa for client\'s spouse and children from Ukraine.',
        descriptionHe: 'קבלת ויזת איחוד משפחות מוצלחת עבור בן/בת הזוג והילדים של הלקוח מאוקראינה.',
        outcome: 'WON',
        year: 2024,
        isFeatured: true,
      },
    }),
  );

  // Shachar Koren - Labor and Civil cases
  cases.push(
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[3].id,
        titleEn: 'Wrongful Termination Lawsuit',
        titleHe: 'תביעת פיטורים שלא כדין',
        descriptionEn: 'Won significant damages for client wrongfully terminated. Secured 18 months severance and compensation.',
        descriptionHe: 'זכיתי בפיצויים משמעותיים עבור לקוח שפוטר שלא כדין. הבטחתי 18 חודשי פיצויי פיטורים ופיצויים.',
        outcome: 'WON',
        year: 2023,
        isFeatured: true,
      },
    }),
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[3].id,
        titleEn: 'Workplace Discrimination Case',
        titleHe: 'תיק אפליה במקום העבודה',
        descriptionEn: 'Currently representing employee in discrimination case. Settlement negotiations underway.',
        descriptionHe: 'כעת מייצג עובד בתיק אפליה. מו"מ להסדר בעיצומו.',
        outcome: 'ONGOING',
        year: 2024,
        isFeatured: false,
      },
    }),
  );

  // Ben Buchris - Tax and Corporate cases
  cases.push(
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[4].id,
        titleEn: 'Tax Authority Audit Defense',
        titleHe: 'הגנה בפני ביקורת רשות המסים',
        descriptionEn: 'Successfully defended corporation in major tax audit. Saved client over ₪2M in disputed assessments.',
        descriptionHe: 'הגנה מוצלחת על תאגיד בביקורת מס מרכזית. חסכתי ללקוח מעל 2 מיליון ₪ בשומות שנויות במחלוקת.',
        outcome: 'WON',
        year: 2023,
        isFeatured: true,
      },
    }),
    await prisma.profileCase.create({
      data: {
        lawyerId: lawyers[4].id,
        titleEn: 'Corporate Restructuring',
        titleHe: 'ארגון מחדש של חברה',
        descriptionEn: 'Led tax-efficient corporate restructuring for family business with international operations.',
        descriptionHe: 'הובלתי ארגון מחדש יעיל ממבחינת מס עבור עסק משפחתי עם פעילות בינלאומית.',
        outcome: 'WON',
        year: 2022,
        isFeatured: true,
      },
    }),
  );

  console.log(`✅ Seeded ${cases.length} cases`);

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
