import { PrismaClient } from '@prisma/client';
import { RawCase, CaseAnalysis } from './types';

/**
 * Saves analyzed case data to the database
 *
 * This function:
 * 1. Upserts the Case record (creates new or updates existing)
 * 2. Looks up or creates Lawyer records based on lawyer names
 * 3. Creates LawyerCase junction records linking lawyers to cases
 *
 * @param rawCase - The original raw case data
 * @param analysis - The structured analysis result from AI
 * @param prisma - Prisma client instance
 *
 * IMPORTANT NOTES:
 * - This implementation assumes the schema extensions have been merged
 * - Adjust table/column names to match your actual schema
 * - The lawyer lookup logic is simplified - enhance as needed
 * - This function is idempotent: running it multiple times won't create duplicates
 */
export async function saveCaseAnalysis(
  rawCase: RawCase,
  analysis: CaseAnalysis,
  prisma: PrismaClient
): Promise<void> {
  console.log(`💾 Saving case ${rawCase.id} to database...`);

  try {
    // ========================================================================
    // STEP 1: Upsert the Case
    // ========================================================================
    const savedCase = await prisma.case.upsert({
      where: {
        externalId: rawCase.id,
      },
      update: {
        title: analysis.title,
        specialty: analysis.specialty,
        result: analysis.result,
        judgeName: analysis.judgeName,
        openedAt: analysis.openedAt,
        closedAt: analysis.closedAt,
        complexityScore: analysis.complexityScore,
        rawText: rawCase.text,
        updatedAt: new Date(),
      },
      create: {
        externalId: rawCase.id,
        title: analysis.title,
        specialty: analysis.specialty,
        result: analysis.result,
        judgeName: analysis.judgeName,
        openedAt: analysis.openedAt,
        closedAt: analysis.closedAt,
        complexityScore: analysis.complexityScore,
        rawText: rawCase.text,
      },
    });

    console.log(`  ✓ Case saved with ID: ${savedCase.id}`);

    // ========================================================================
    // STEP 2: Process each lawyer mentioned in the case
    // ========================================================================
    for (const analyzedLawyer of analysis.lawyers) {
      // Try to find existing lawyer by name
      // NOTE: This is a simplified matching strategy
      // TODO: Enhance with fuzzy matching, license number lookup, etc.
      let lawyer = await findLawyerByName(
        prisma,
        analyzedLawyer.lawyerName
      );

      if (!lawyer) {
        // Lawyer not found in database
        // TODO: Decide how to handle this:
        // Option A: Create a new lawyer record (current implementation)
        // Option B: Skip this lawyer and log a warning
        // Option C: Create a "pending verification" record
        //
        // For now, we'll create a basic lawyer record
        console.log(`  ⚠ Lawyer "${analyzedLawyer.lawyerName}" not found, creating new record...`);

        lawyer = await prisma.lawyer.create({
          data: {
            // NOTE: Adjust these fields to match your Lawyer schema
            fullNameEn: analyzedLawyer.lawyerName,
            fullNameHe: analyzedLawyer.lawyerName,
            // Add other required fields with sensible defaults:
            // city: 'Unknown',
            // specialties: [analysis.specialty],
            // yearsOfExperience: 0,
            // ratingVector: { professionalism: 50, availability: 50, empathy: 50, cost: 50 },
          },
        });

        console.log(`  ✓ Created new lawyer: ${lawyer.id}`);
      } else {
        console.log(`  ✓ Found existing lawyer: ${lawyer.id}`);
      }

      // ========================================================================
      // STEP 3: Create LawyerCase link (if it doesn't exist)
      // ========================================================================
      const existingLink = await prisma.lawyerCase.findUnique({
        where: {
          caseId_lawyerId: {
            caseId: savedCase.id,
            lawyerId: lawyer.id,
          },
        },
      });

      if (!existingLink) {
        await prisma.lawyerCase.create({
          data: {
            caseId: savedCase.id,
            lawyerId: lawyer.id,
            side: analyzedLawyer.side,
          },
        });
        console.log(`  ✓ Linked lawyer ${lawyer.id} (${analyzedLawyer.side})`);
      } else {
        console.log(`  - Link already exists for lawyer ${lawyer.id}`);
      }
    }

    console.log(`✅ Successfully saved case ${rawCase.id}`);
  } catch (error) {
    console.error(`❌ Error saving case ${rawCase.id}:`, error);
    throw error;
  }
}

/**
 * Finds a lawyer in the database by name
 *
 * This uses a simple exact match strategy. In production, you might want to:
 * - Normalize names (remove extra spaces, handle different spellings)
 * - Use fuzzy matching for similar names
 * - Search by license number if available
 * - Check both English and Hebrew name fields
 */
async function findLawyerByName(
  prisma: PrismaClient,
  name: string
): Promise<any | null> {
  // Normalize the search name
  const normalizedName = name.trim();

  // Search in both English and Hebrew name fields
  // NOTE: Adjust field names to match your schema
  const lawyer = await prisma.lawyer.findFirst({
    where: {
      OR: [
        { fullNameEn: { equals: normalizedName, mode: 'insensitive' } },
        { fullNameHe: { equals: normalizedName, mode: 'insensitive' } },
        // Add more fuzzy matching conditions here if needed:
        // { fullNameEn: { contains: normalizedName, mode: 'insensitive' } },
      ],
    },
  });

  return lawyer;
}

/**
 * Helper function to calculate updated lawyer statistics based on cases
 * Call this periodically to refresh lawyer ratings
 *
 * Example usage:
 * await updateLawyerStatistics(prisma, lawyerId);
 */
export async function updateLawyerStatistics(
  prisma: PrismaClient,
  lawyerId: string
): Promise<void> {
  // Fetch all cases for this lawyer
  const lawyerCases = await prisma.lawyerCase.findMany({
    where: { lawyerId },
    include: {
      case: {
        select: {
          result: true,
          complexityScore: true,
          specialty: true,
          closedAt: true,
        },
      },
    },
  });

  if (lawyerCases.length === 0) {
    return; // No cases to analyze
  }

  // Calculate statistics
  const totalCases = lawyerCases.length;
  const wins = lawyerCases.filter((lc) => lc.case.result === 'win').length;
  const winRate = wins / totalCases;

  const avgComplexity =
    lawyerCases.reduce((sum, lc) => sum + (lc.case.complexityScore || 0), 0) /
    totalCases;

  // Get unique specialties
  const specialties = Array.from(
    new Set(lawyerCases.map((lc) => lc.case.specialty))
  );

  console.log(`
📊 Lawyer ${lawyerId} Statistics:
   Total Cases: ${totalCases}
   Win Rate: ${(winRate * 100).toFixed(1)}%
   Avg Complexity: ${avgComplexity.toFixed(2)}
   Specialties: ${specialties.join(', ')}
  `);

  // TODO: Update the lawyer's rating based on these statistics
  // This is where you'd implement the "smart ratings" algorithm
  //
  // Example (adjust to match your schema):
  // await prisma.lawyer.update({
  //   where: { id: lawyerId },
  //   data: {
  //     ratingVector: {
  //       professionalism: calculateProfessionalismScore(winRate, avgComplexity),
  //       ... other ratings
  //     },
  //     specialties: specialties,
  //   },
  // });
}
