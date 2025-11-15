import { PrismaClient, Case } from '@prisma/client';
import { CaseAnalysis } from '../types';

export class CaseRepository {
  constructor(private prisma: PrismaClient) {}

  async upsertCase(
    externalId: string,
    rawText: string,
    analysis: CaseAnalysis,
    lawyerIdsBySide: {
      plaintiff: string[];
      defendant: string[];
      associated: string[];
    }
  ): Promise<Case> {
    const caseData = {
      title: analysis.title,
      specialty: analysis.specialty,
      result: analysis.result,
      judgeName: analysis.judgeName,
      openedAt: analysis.openedAt,
      closedAt: analysis.closedAt,
      complexityScore: analysis.complexityScore,
      rawText,
      plaintiffLawyerIds: lawyerIdsBySide.plaintiff,
      defendantLawyerIds: lawyerIdsBySide.defendant,
      associatedLawyerIds: lawyerIdsBySide.associated,
    };

    return this.prisma.case.upsert({
      where: { externalId },
      update: { ...caseData, updatedAt: new Date() },
      create: { externalId, ...caseData },
    });
  }
}
