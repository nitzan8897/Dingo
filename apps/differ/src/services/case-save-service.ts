import { PrismaClient } from '@prisma/client';
import { CaseAnalysis, RawCase } from '../types';
import { CaseRepository } from '../repositories/case-repository';
import { LawyerRepository } from '../repositories/lawyer-repository';
import { LawyerCaseRepository } from '../repositories/lawyer-case-repository';

export class CaseSaveService {
  private caseRepo: CaseRepository;
  private lawyerRepo: LawyerRepository;
  private lawyerCaseRepo: LawyerCaseRepository;

  constructor(private prisma: PrismaClient) {
    this.caseRepo = new CaseRepository(prisma);
    this.lawyerRepo = new LawyerRepository(prisma);
    this.lawyerCaseRepo = new LawyerCaseRepository(prisma);
  }

  async save(rawCase: RawCase, analysis: CaseAnalysis): Promise<void> {
    const savedCase = await this.caseRepo.upsertCase(
      rawCase.id,
      rawCase.text,
      analysis
    );

    for (const analyzedLawyer of analysis.lawyers) {
      let lawyer = await this.lawyerRepo.findByName(analyzedLawyer.lawyerName);

      if (!lawyer) {
        lawyer = await this.lawyerRepo.createPendingVerification(
          analyzedLawyer.lawyerName
        );
        console.log(`  ✨ Created pending lawyer: ${analyzedLawyer.lawyerName}`);
      }

      const alreadyLinked = await this.lawyerCaseRepo.exists(
        lawyer.id,
        savedCase.id
      );

      if (!alreadyLinked) {
        await this.lawyerCaseRepo.createLawyerCase(
          lawyer.id,
          savedCase.id,
          analyzedLawyer.side
        );
      }
    }

    console.log(`  💾 Saved case: ${savedCase.title}`);
  }
}
