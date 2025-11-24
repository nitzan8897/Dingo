import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding court cases (expanded)...');

  // Clear existing court cases
  await prisma.case.deleteMany({});
  console.log('🗑️  Cleared existing court cases');

  // Get existing lawyers
  const lawyers = await prisma.lawyer.findMany();

  if (lawyers.length === 0) {
    console.log('❌ No lawyers found. Please run the main seed script first.');
    return;
  }

  console.log(`Found ${lawyers.length} lawyers`);

  // Helper function to get random lawyers excluding specific ones
  const getRandomLawyers = (count: number, exclude: string[] = []): string[] => {
    const available = lawyers.filter(l => !exclude.includes(l.id));
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(l => l.id);
  };

  // Create comprehensive court cases
  const courtCases = [
    // Labor Law Cases
    {
      externalId: 'LB-2023-001',
      title: 'State vs. Cohen - Employment Discrimination',
      specialty: 'LABOR',
      result: 'DEFENCE_WON',
      judgeName: 'Judge Sarah Goldstein',
      pdfUrl: 'https://example.com/cases/LB-2023-001.pdf',
      openedAt: new Date('2023-01-15'),
      closedAt: new Date('2023-06-20'),
      complexityScore: 0.75,
      rawText: 'Employment discrimination case where employee alleged wrongful termination based on age discrimination. Defense successfully argued termination was due to legitimate performance issues documented over 12-month period.',
      plaintiffLawyerIds: getRandomLawyers(1, [lawyers[0]?.id]),
      defendantLawyerIds: [lawyers[0]?.id], // Shachar Koren
      associatedLawyerIds: [],
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
      rawText: 'Labor rights case involving union-busting allegations. Court found Manufacturing Inc violated federal labor laws by threatening employees. Ordered reinstatement of 23 workers with $1.8M in back pay.',
      plaintiffLawyerIds: [lawyers[0]?.id, lawyers[1]?.id], // Shachar, Itay
      defendantLawyerIds: [],
      associatedLawyerIds: [],
    },

    // Criminal Law Cases
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
      rawText: 'Complex securities fraud case with multiple defendants. Defense successfully argued prosecution failed to prove criminal intent beyond reasonable doubt. Key evidence ruled inadmissible.',
      plaintiffLawyerIds: [],
      defendantLawyerIds: [lawyers[1]?.id].filter(Boolean), // Itay Levi
      associatedLawyerIds: [lawyers[10]?.id].filter(Boolean), // Amir Levi
    },
    {
      externalId: 'CR-2023-567',
      title: 'State vs. Martinez - White Collar Crime',
      specialty: 'CRIMINAL',
      result: 'settlement',
      judgeName: 'Judge Rebecca Stone',
      pdfUrl: 'https://example.com/cases/CR-2023-567.pdf',
      openedAt: new Date('2023-09-01'),
      closedAt: new Date('2024-03-15'),
      complexityScore: 0.85,
      rawText: 'White-collar crime case involving embezzlement from corporate accounts. Settled with defendant agreeing to restitution and cooperation with investigators.',
      plaintiffLawyerIds: [],
      defendantLawyerIds: [lawyers[10]?.id].filter(Boolean), // Amir Levi
      associatedLawyerIds: [],
    },

    // Intellectual Property Cases
    {
      externalId: 'IP-2024-042',
      title: 'Tech Corp vs. Startup Inc - Patent Infringement',
      specialty: 'INTELLECTUAL_PROPERTY',
      result: 'ATTACK_WON',
      judgeName: 'Judge Michael Levi',
      pdfUrl: 'https://example.com/cases/IP-2024-042.pdf',
      openedAt: new Date('2024-02-10'),
      closedAt: new Date('2024-09-15'),
      complexityScore: 0.92,
      rawText: 'Patent infringement involving AI recommendation algorithms. Tech Corp demonstrated willful copying after failed licensing negotiations. Court awarded $4.5M damages plus ongoing royalties.',
      plaintiffLawyerIds: [lawyers[2]?.id], // Nitzan Avargil
      defendantLawyerIds: [],
      associatedLawyerIds: [lawyers[4]?.id], // Ben Buchris
    },
    {
      externalId: 'IP-2023-789',
      title: 'Designer Fashion vs. Fast Retail Chain - Copyright',
      specialty: 'INTELLECTUAL_PROPERTY',
      result: 'settlement',
      judgeName: 'Judge Miriam Shapiro',
      pdfUrl: 'https://example.com/cases/IP-2023-789.pdf',
      openedAt: new Date('2023-04-15'),
      closedAt: new Date('2023-12-10'),
      complexityScore: 0.71,
      rawText: 'Copyright infringement case involving 15 dress designs. Settled for undisclosed damages, public apology, and 3-year monitoring agreement.',
      plaintiffLawyerIds: [lawyers[2]?.id], // Nitzan Avargil
      defendantLawyerIds: [lawyers[1]?.id], // Itay Levi
      associatedLawyerIds: [],
    },

    // Family Law Cases
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
      rawText: 'Child custody case settled through mediation after 6 months. Parents agreed to 50/50 shared custody arrangement with provisions for education and healthcare decisions.',
      plaintiffLawyerIds: [lawyers[3]?.id], // Nir Shakibi
      defendantLawyerIds: [],
      associatedLawyerIds: [],
    },
    {
      externalId: 'FC-2024-234',
      title: 'Divorce Settlement - Asset Division',
      specialty: 'FAMILY',
      result: 'settlement',
      judgeName: 'Judge Daniel Green',
      pdfUrl: 'https://example.com/cases/FC-2024-234.pdf',
      openedAt: new Date('2024-01-10'),
      closedAt: new Date('2024-07-22'),
      complexityScore: 0.78,
      rawText: 'High-net-worth divorce involving complex asset division including international properties and business holdings. Settled through mediation with equitable distribution agreement.',
      plaintiffLawyerIds: [lawyers[10]?.id].filter(Boolean), // Tzipi Levi
      defendantLawyerIds: [lawyers[3]?.id].filter(Boolean), // Nir Shakibi
      associatedLawyerIds: [],
    },

    // Tax Law Cases
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
      rawText: 'Tax evasion case settled with structured payment plan. Business agreed to $2.3M in back taxes plus penalties over 36 months with cooperation agreement.',
      plaintiffLawyerIds: [],
      defendantLawyerIds: [lawyers[4]?.id], // Ben Buchris
      associatedLawyerIds: [],
    },
    {
      externalId: 'TX-2024-456',
      title: 'Tax Authority vs. Global Corp - Transfer Pricing',
      specialty: 'TAX',
      result: 'DEFENCE_WON',
      judgeName: 'Judge Aaron Goldberg',
      pdfUrl: 'https://example.com/cases/TX-2024-456.pdf',
      openedAt: new Date('2024-01-05'),
      closedAt: new Date('2024-09-30'),
      complexityScore: 0.94,
      rawText: 'Complex transfer pricing dispute involving multinational operations. Defense successfully demonstrated compliance with arm\'s length principle. All tax authority claims dismissed.',
      plaintiffLawyerIds: [],
      defendantLawyerIds: [lawyers[4]?.id], // Ben Buchris
      associatedLawyerIds: [lawyers[2]?.id], // Nitzan Avargil
    },

    // Real Estate Cases
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
      rawText: 'Real estate development case challenging zoning restrictions on 45-acre commercial development. Court ruled Commission\'s denial was arbitrary. Development permits ordered within 30 days.',
      plaintiffLawyerIds: [lawyers[5]?.id, lawyers[2]?.id], // Ofri Hasson, Nitzan Avargil
      defendantLawyerIds: [],
      associatedLawyerIds: [],
    },
    {
      externalId: 'RE-2023-892',
      title: 'Landlord vs. Commercial Tenant - Lease Dispute',
      specialty: 'REAL_ESTATE',
      result: 'settlement',
      judgeName: 'Judge Ruth Silverman',
      pdfUrl: 'https://example.com/cases/RE-2023-892.pdf',
      openedAt: new Date('2023-06-15'),
      closedAt: new Date('2023-12-20'),
      complexityScore: 0.68,
      rawText: 'Commercial lease dispute over rent escalation and maintenance obligations. Settled with revised lease terms and payment schedule satisfactory to both parties.',
      plaintiffLawyerIds: [lawyers[5]?.id], // Ofri Hasson
      defendantLawyerIds: getRandomLawyers(1, [lawyers[5]?.id]),
      associatedLawyerIds: [],
    },

    // Environmental Cases
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
      rawText: 'Environmental lawsuit for illegal dumping into local waterways over 5 years. Court found Clean Water Act violations. Ordered $12M cleanup costs, $8M penalties, and 10-year monitoring.',
      plaintiffLawyerIds: [lawyers[6]?.id], // Tal Francis
      defendantLawyerIds: [lawyers[4]?.id], // Ben Buchris
      associatedLawyerIds: [lawyers[2]?.id], // Nitzan Avargil
    },
    {
      externalId: 'ENV-2024-345',
      title: 'Citizens Alliance vs. Chemical Plant - Air Quality',
      specialty: 'ENVIRONMENTAL',
      result: 'settlement',
      judgeName: 'Judge Noah Goldberg',
      pdfUrl: 'https://example.com/cases/ENV-2024-345.pdf',
      openedAt: new Date('2024-03-01'),
      closedAt: new Date('2024-10-15'),
      complexityScore: 0.86,
      rawText: 'Air quality lawsuit against chemical manufacturing facility. Settled with agreement to install $15M in pollution control equipment and quarterly emissions reporting for 5 years.',
      plaintiffLawyerIds: [lawyers[6]?.id], // Tal Francis
      defendantLawyerIds: [],
      associatedLawyerIds: [],
    },

    // Medical Malpractice Cases
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
      rawText: 'Medical malpractice case alleging negligent surgical procedure. Defense demonstrated doctor followed standard protocols and complications were due to undisclosed patient medical history. All charges dismissed.',
      plaintiffLawyerIds: [],
      defendantLawyerIds: [lawyers[7]?.id, lawyers[2]?.id], // Yuval Avargil, Nitzan Avargil
      associatedLawyerIds: [],
    },
    {
      externalId: 'MED-2023-567',
      title: 'Patient vs. Hospital - Wrongful Death',
      specialty: 'MEDICAL',
      result: 'settlement',
      judgeName: 'Judge Miriam Shapiro',
      pdfUrl: 'https://example.com/cases/MED-2023-567.pdf',
      openedAt: new Date('2023-07-10'),
      closedAt: new Date('2024-04-15'),
      complexityScore: 0.93,
      rawText: 'Wrongful death case involving post-operative complications. Settled for $3.2M compensation to family with hospital implementing new safety protocols and staff training requirements.',
      plaintiffLawyerIds: [lawyers[7]?.id], // Yuval Avargil
      defendantLawyerIds: [],
      associatedLawyerIds: [],
    },

    // Bankruptcy Cases
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
      rawText: 'Chapter 11 bankruptcy for regional retail chain with 87 locations. Court approved reorganization allowing closure of 25 underperforming stores and $145M debt restructuring. Preserved 2,800 jobs.',
      plaintiffLawyerIds: [],
      defendantLawyerIds: [lawyers[8]?.id, lawyers[4]?.id], // Liam Avargil, Ben Buchris
      associatedLawyerIds: [lawyers[2]?.id], // Nitzan Avargil
    },
    {
      externalId: 'BK-2023-789',
      title: 'Personal Bankruptcy - Debt Relief',
      specialty: 'BANKRUPTCY',
      result: 'ATTACK_WON',
      judgeName: 'Judge Samuel Cohen',
      pdfUrl: 'https://example.com/cases/BK-2023-789.pdf',
      openedAt: new Date('2023-11-05'),
      closedAt: new Date('2024-05-20'),
      complexityScore: 0.72,
      rawText: 'Chapter 7 bankruptcy petition successfully granted discharge of $450K in unsecured debt. Allowed debtor fresh start while preserving primary residence through homestead exemption.',
      plaintiffLawyerIds: [lawyers[8]?.id], // Liam Avargil
      defendantLawyerIds: [],
      associatedLawyerIds: [],
    },

    // Corporate Cases
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
      rawText: 'Class action over data breach affecting 2.3M customers. $45M settlement fund, enhanced security measures, and 3 years free credit monitoring. Requires independent security audits quarterly for 5 years.',
      plaintiffLawyerIds: [lawyers[3]?.id, lawyers[0]?.id], // Nir Shakibi, Shachar Koren
      defendantLawyerIds: [lawyers[2]?.id], // Nitzan Avargil
      associatedLawyerIds: [lawyers[10]?.id], // Amir Levi
    },
    {
      externalId: 'CC-2023-456',
      title: 'Shareholders vs. Board - Breach of Fiduciary Duty',
      specialty: 'CORPORATE',
      result: 'ATTACK_WON',
      judgeName: 'Judge Michael Levi',
      pdfUrl: 'https://example.com/cases/CC-2023-456.pdf',
      openedAt: new Date('2023-08-15'),
      closedAt: new Date('2024-06-30'),
      complexityScore: 0.88,
      rawText: 'Derivative action alleging breach of fiduciary duty in M&A transaction. Court found board failed to maximize shareholder value. Awarded $8.5M damages and ordered governance reforms.',
      plaintiffLawyerIds: [lawyers[2]?.id], // Nitzan Avargil
      defendantLawyerIds: [],
      associatedLawyerIds: [lawyers[4]?.id], // Ben Buchris
    },

    // Immigration Cases
    {
      externalId: 'IMG-2024-123',
      title: 'Asylum Application - Political Persecution',
      specialty: 'IMMIGRATION',
      result: 'ATTACK_WON',
      judgeName: 'Judge Elizabeth Warren',
      pdfUrl: 'https://example.com/cases/IMG-2024-123.pdf',
      openedAt: new Date('2024-02-15'),
      closedAt: new Date('2024-09-10'),
      complexityScore: 0.85,
      rawText: 'Asylum application based on political persecution. Successfully demonstrated credible fear and well-founded fear of persecution. Asylum granted with path to permanent residency.',
      plaintiffLawyerIds: [lawyers[10]?.id].filter(Boolean), // Tzipi Levi
      defendantLawyerIds: [],
      associatedLawyerIds: [],
    },
    {
      externalId: 'IMG-2023-456',
      title: 'Family Reunification - Visa Petition',
      specialty: 'IMMIGRATION',
      result: 'ATTACK_WON',
      judgeName: 'Judge Robert Martinez',
      pdfUrl: 'https://example.com/cases/IMG-2023-456.pdf',
      openedAt: new Date('2023-10-01'),
      closedAt: new Date('2024-04-15'),
      complexityScore: 0.68,
      rawText: 'I-130 family reunification petition for spouse and children from Ukraine. Successfully obtained approved petition with expedited processing due to humanitarian circumstances.',
      plaintiffLawyerIds: [lawyers[3]?.id], // Nir Shakibi
      defendantLawyerIds: [],
      associatedLawyerIds: [lawyers[10]?.id].filter(Boolean), // Tzipi Levi
    },

    // Additional Cases for comprehensive coverage
    {
      externalId: 'CV-2024-789',
      title: 'Personal Injury - Auto Accident',
      specialty: 'CIVIL',
      result: 'settlement',
      judgeName: 'Judge Thomas Reed',
      pdfUrl: 'https://example.com/cases/CV-2024-789.pdf',
      openedAt: new Date('2024-01-20'),
      closedAt: new Date('2024-08-05'),
      complexityScore: 0.72,
      rawText: 'Multi-vehicle accident resulting in serious injuries. Settled for $2.1M covering medical expenses, lost wages, pain and suffering. Insurance companies agreed to payment within 60 days.',
      plaintiffLawyerIds: [lawyers[7]?.id], // Yuval Avargil
      defendantLawyerIds: [],
      associatedLawyerIds: [],
    },
    {
      externalId: 'CR-2024-234',
      title: 'State vs. Thompson - Drug Trafficking',
      specialty: 'CRIMINAL',
      result: 'ATTACK_WON',
      judgeName: 'Judge Maria Garcia',
      pdfUrl: 'https://example.com/cases/CR-2024-234.pdf',
      openedAt: new Date('2024-06-01'),
      closedAt: new Date('2024-11-20'),
      complexityScore: 0.91,
      rawText: 'Drug trafficking prosecution with multiple defendants. Prosecution proved conspiracy and distribution across state lines. Convicted with 15-year sentence upheld on appeal.',
      plaintiffLawyerIds: [],
      defendantLawyerIds: [lawyers[10]?.id].filter(Boolean), // Amir Levi (lost)
      associatedLawyerIds: [],
    },
  ];

  console.log(`Creating ${courtCases.length} court cases...`);

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
    console.log(`   ${lawyer}: ${caseCount} case(s)`);
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
