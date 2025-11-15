import { PrismaClient, Case } from '@prisma/client';
import { CaseAnalysis } from '../types';

export class CaseRepository {
  constructor(private prisma: PrismaClient) {}

  async upsertCase(
    externalId: string,
    rawText: string,
    analysis: CaseAnalysis
  ): Promise<Case> {
    return this.prisma.case.upsert({
      where: { externalId },
      update: {
        title: analysis.title,
        specialty: analysis.specialty,
        result: analysis.result,
        judgeName: analysis.judgeName,
        openedAt: analysis.openedAt,
        closedAt: analysis.closedAt,
        complexityScore: analysis.complexityScore,
        rawText,
        updatedAt: new Date(),
      },
      create: {
        externalId,
        title: analysis.title,
        specialty: analysis.specialty,
        result: analysis.result,
        judgeName: analysis.judgeName,
        openedAt: analysis.openedAt,
        closedAt: analysis.closedAt,
        complexityScore: analysis.complexityScore,
        rawText,
      },
    });
  }
}
