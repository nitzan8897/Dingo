import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding court cases...');

  // Clear existing court cases
  await prisma.case.deleteMany({});
  console.log('🗑️  Cleared existing court cases');

  // Get existing lawyers
  const lawyers = await prisma.lawyer.findMany();

  if (lawyers.length === 0) {
    console.log('❌ No lawyers found. Please run the main seed script first.');
    return;
  }

  // Create sample court cases with lawyer associations
  const courtCases = [
    {
      externalId: 'HCJ-2023-001',
      title: 'State vs. Cohen - Employment Discrimination',
      specialty: 'LABOR',
      result: 'DEFENCE_WON',
      judgeName: 'Judge Sarah Goldstein',
      pdfUrl: 'https://example.com/cases/HCJ-2023-001.pdf',
      openedAt: new Date('2023-01-15'),
      closedAt: new Date('2023-06-20'),
      complexityScore: 0.75,
      rawText: 'Case involving employment discrimination claim where employee alleged wrongful termination based on age discrimination. The defense successfully argued that the termination was due to legitimate performance issues documented over a 12-month period. Multiple witnesses testified to the employee\'s declining performance metrics.',
      plaintiffLawyerIds: lawyers[0]?.id ? [lawyers[0].id] : [],
      defendantLawyerIds: lawyers[1]?.id ? [lawyers[1].id] : [],
      associatedLawyerIds: [],
    },
    {
      externalId: 'CC-2024-042',
      title: 'Tech Corp vs. Startup Inc - Patent Infringement',
      specialty: 'INTELLECTUAL_PROPERTY',
      result: 'ATTACK_WON',
      judgeName: 'Judge Michael Levi',
      pdfUrl: 'https://example.com/cases/CC-2024-042.pdf',
      openedAt: new Date('2024-02-10'),
      closedAt: new Date('2024-09-15'),
      complexityScore: 0.92,
      rawText: 'Patent infringement case in technology sector involving AI-driven recommendation algorithms. Tech Corp successfully demonstrated that Startup Inc had willfully copied their patented technology after failed licensing negotiations. Court awarded $4.5M in damages plus ongoing royalties.',
      plaintiffLawyerIds: lawyers[3]?.id ? [lawyers[3].id] : [],
      defendantLawyerIds: [],
      associatedLawyerIds: lawyers[2]?.id ? [lawyers[2].id] : [],
    },
    {
      externalId: 'FC-2023-156',
      title: 'Johnson Family Custody Dispute',
      specialty: 'FAMILY',
      result: 'settlement',
      judgeName: 'Judge Rachel Cohen',
      pdfUrl: 'https://example.com/cases/FC-2023-156.pdf',
      openedAt: new Date('2023-05-01'),
      closedAt: new Date('2023-11-30'),
      complexityScore: 0.65,
      rawText: 'Child custody case settled through mediation after 6 months of negotiation. Both parents agreed to shared custody arrangement with 50/50 time split. Settlement includes provisions for children\'s education, healthcare decisions, and holiday scheduling. Court appointed child psychologist recommended this arrangement as being in the best interests of the children.',
      plaintiffLawyerIds: lawyers[4]?.id ? [lawyers[4].id] : [],
      defendantLawyerIds: [],
      associatedLawyerIds: [],
    },
    {
      externalId: 'CR-2024-089',
      title: 'State vs. Defendant - Fraud Charges',
      specialty: 'CRIMINAL',
      result: 'DEFENCE_WON',
      judgeName: 'Judge David Ben-David',
      pdfUrl: 'https://example.com/cases/CR-2024-089.pdf',
      openedAt: new Date('2024-03-12'),
      closedAt: new Date('2024-10-05'),
      complexityScore: 0.88,
      rawText: 'Complex fraud case with multiple defendants involving alleged securities fraud. Defense successfully argued that the prosecution failed to prove criminal intent beyond reasonable doubt. Key evidence regarding electronic communications was ruled inadmissible due to improper warrant execution. All charges dismissed with prejudice.',
      plaintiffLawyerIds: [],
      defendantLawyerIds: lawyers[1]?.id ? [lawyers[1].id] : [],
      associatedLawyerIds: lawyers[0]?.id ? [lawyers[0].id] : [],
    },
    {
      externalId: 'TX-2023-234',
      title: 'IRS vs. Business Group - Tax Evasion',
      specialty: 'TAX',
      result: 'settlement',
      judgeName: 'Judge Yael Katz',
      pdfUrl: 'https://example.com/cases/TX-2023-234.pdf',
      openedAt: new Date('2023-08-20'),
      closedAt: new Date('2024-02-28'),
      complexityScore: 0.81,
      rawText: 'Tax evasion case settled with structured payment plan. Business Group agreed to pay $2.3M in back taxes plus penalties over 36 months. Settlement avoided criminal charges and included cooperation agreement for full disclosure of offshore accounts. IRS agreed to waive additional interest charges in exchange for timely payments.',
      plaintiffLawyerIds: [],
      defendantLawyerIds: lawyers[2]?.id ? [lawyers[2].id] : [],
      associatedLawyerIds: [],
    },
    {
      externalId: 'RE-2024-155',
      title: 'Green Properties vs. City Planning Commission',
      specialty: 'REAL_ESTATE',
      result: 'ATTACK_WON',
      judgeName: 'Judge Abraham Klein',
      pdfUrl: 'https://example.com/cases/RE-2024-155.pdf',
      openedAt: new Date('2024-01-05'),
      closedAt: new Date('2024-08-22'),
      complexityScore: 0.78,
      rawText: 'Real estate development case where Green Properties challenged zoning restrictions on a 45-acre commercial development. Court ruled that the Commission\'s denial was arbitrary and not supported by environmental impact findings. Development permits were ordered to be issued within 30 days.',
      plaintiffLawyerIds: lawyers[0]?.id && lawyers[3]?.id ? [lawyers[0].id, lawyers[3].id] : [],
      defendantLawyerIds: [],
      associatedLawyerIds: [],
    },
    {
      externalId: 'IP-2023-789',
      title: 'Designer Fashion vs. Fast Retail Chain - Copyright Infringement',
      specialty: 'INTELLECTUAL_PROPERTY',
      result: 'settlement',
      judgeName: 'Judge Miriam Shapiro',
      pdfUrl: 'https://example.com/cases/IP-2023-789.pdf',
      openedAt: new Date('2023-04-15'),
      closedAt: new Date('2023-12-10'),
      complexityScore: 0.71,
      rawText: 'Copyright infringement case involving fashion designs. Designer Fashion alleged that Fast Retail Chain copied 15 original dress designs without authorization. Settled for undisclosed monetary damages, public apology, and immediate removal of infringing items from all retail locations. Settlement also includes 3-year monitoring agreement.',
      plaintiffLawyerIds: lawyers[2]?.id ? [lawyers[2].id] : [],
      defendantLawyerIds: lawyers[1]?.id ? [lawyers[1].id] : [],
      associatedLawyerIds: [],
    },
    {
      externalId: 'CC-2024-201',
      title: 'DataCorp Breach - Class Action Lawsuit',
      specialty: 'CORPORATE',
      result: 'settlement',
      judgeName: 'Judge Benjamin Rosenberg',
      pdfUrl: 'https://example.com/cases/CC-2024-201.pdf',
      openedAt: new Date('2024-03-01'),
      closedAt: new Date('2024-11-15'),
      complexityScore: 0.95,
      rawText: 'Class action lawsuit involving data breach affecting 2.3 million customers. DataCorp agreed to $45M settlement fund, implementation of enhanced security measures, and 3 years of free credit monitoring for affected individuals. Settlement also requires independent security audits quarterly for 5 years.',
      plaintiffLawyerIds: lawyers[4]?.id && lawyers[0]?.id ? [lawyers[4].id, lawyers[0].id] : [],
      defendantLawyerIds: lawyers[3]?.id ? [lawyers[3].id] : [],
      associatedLawyerIds: lawyers[1]?.id ? [lawyers[1].id] : [],
    },
    {
      externalId: 'LB-2023-445',
      title: 'Union Workers vs. Manufacturing Inc - Labor Rights',
      specialty: 'LABOR',
      result: 'ATTACK_WON',
      judgeName: 'Judge Tamar Friedman',
      pdfUrl: 'https://example.com/cases/LB-2023-445.pdf',
      openedAt: new Date('2023-06-12'),
      closedAt: new Date('2024-01-30'),
      complexityScore: 0.82,
      rawText: 'Labor rights case involving allegations of union-busting activities and unfair labor practices. Court found that Manufacturing Inc violated federal labor laws by threatening employees with job loss for union activities. Ordered reinstatement of 23 terminated workers with back pay, totaling $1.8M, and mandatory labor relations training for all management.',
      plaintiffLawyerIds: lawyers[1]?.id && lawyers[2]?.id ? [lawyers[1].id, lawyers[2].id] : [],
      defendantLawyerIds: [],
      associatedLawyerIds: [],
    },
    {
      externalId: 'MED-2024-333',
      title: 'State Medical Board vs. Dr. Williams - Malpractice',
      specialty: 'MEDICAL',
      result: 'DEFENCE_WON',
      judgeName: 'Judge Noah Goldberg',
      pdfUrl: 'https://example.com/cases/MED-2024-333.pdf',
      openedAt: new Date('2024-05-20'),
      closedAt: new Date('2024-11-08'),
      complexityScore: 0.89,
      rawText: 'Medical malpractice case where Dr. Williams was accused of negligent surgical procedure resulting in patient complications. Defense presented expert testimony demonstrating that the doctor followed standard protocols and complications were due to undisclosed patient medical history. All charges dismissed and medical license fully reinstated.',
      plaintiffLawyerIds: [],
      defendantLawyerIds: lawyers[4]?.id && lawyers[3]?.id ? [lawyers[4].id, lawyers[3].id] : [],
      associatedLawyerIds: [],
    },
    {
      externalId: 'ENV-2023-678',
      title: 'Environmental Group vs. Industrial Waste Corp',
      specialty: 'ENVIRONMENTAL',
      result: 'ATTACK_WON',
      judgeName: 'Judge Leah Hoffman',
      pdfUrl: 'https://example.com/cases/ENV-2023-678.pdf',
      openedAt: new Date('2023-09-05'),
      closedAt: new Date('2024-06-18'),
      complexityScore: 0.91,
      rawText: 'Environmental lawsuit alleging illegal dumping of hazardous waste into local waterways over 5-year period. Court found Industrial Waste Corp in violation of Clean Water Act. Ordered $12M in cleanup costs, $8M in civil penalties, and implementation of comprehensive environmental compliance program with 10 years of monitoring.',
      plaintiffLawyerIds: lawyers[0]?.id ? [lawyers[0].id] : [],
      defendantLawyerIds: lawyers[2]?.id ? [lawyers[2].id] : [],
      associatedLawyerIds: lawyers[4]?.id ? [lawyers[4].id] : [],
    },
    {
      externalId: 'BK-2024-567',
      title: 'RetailMart Chapter 11 Bankruptcy Restructuring',
      specialty: 'BANKRUPTCY',
      result: 'settlement',
      judgeName: 'Judge Ruth Silverman',
      pdfUrl: 'https://example.com/cases/BK-2024-567.pdf',
      openedAt: new Date('2024-04-10'),
      closedAt: new Date('2024-10-25'),
      complexityScore: 0.87,
      rawText: 'Chapter 11 bankruptcy restructuring for regional retail chain with 87 locations and 3,400 employees. Court approved reorganization plan allowing company to close 25 underperforming stores, renegotiate supplier contracts, and restructure $145M in debt. Plan preserves 2,800 jobs and provides 60% recovery for unsecured creditors.',
      plaintiffLawyerIds: [],
      defendantLawyerIds: lawyers[3]?.id && lawyers[1]?.id ? [lawyers[3].id, lawyers[1].id] : [],
      associatedLawyerIds: lawyers[0]?.id ? [lawyers[0].id] : [],
    },
  ];

  for (const caseData of courtCases) {
    await prisma.case.create({
      data: caseData,
    });
  }

  console.log(`✅ Seeded ${courtCases.length} court cases`);

  // Show which lawyers have court cases
  const lawyersWithCases = await Promise.all(
    lawyers.map(async (lawyer) => {
      const cases = await prisma.case.findMany({
        where: {
          OR: [
            { plaintiffLawyerIds: { has: lawyer.id } },
            { defendantLawyerIds: { has: lawyer.id } },
            { associatedLawyerIds: { has: lawyer.id } },
          ],
        },
      });
      return { lawyer: lawyer.fullNameEn, caseCount: cases.length };
    })
  );

  console.log('\n📊 Court cases per lawyer:');
  lawyersWithCases.forEach(({ lawyer, caseCount }) => {
    if (caseCount > 0) {
      console.log(`   ${lawyer}: ${caseCount} case(s)`);
    }
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding court cases:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
