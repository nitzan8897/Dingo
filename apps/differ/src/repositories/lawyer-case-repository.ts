import { PrismaClient, LawyerCase } from '@prisma/client';

export class LawyerCaseRepository {
  constructor(private prisma: PrismaClient) {}

  async createLawyerCase(
    lawyerId: string,
    caseId: string,
    side: 'plaintiff' | 'defendant' | 'other'
  ): Promise<LawyerCase> {
    return this.prisma.lawyerCase.create({
      data: {
        lawyerId,
        caseId,
        side,
      },
    });
  }

  async exists(lawyerId: string, caseId: string): Promise<boolean> {
    const count = await this.prisma.lawyerCase.count({
      where: {
        lawyerId,
        caseId,
      },
    });
    return count > 0;
  }
}
