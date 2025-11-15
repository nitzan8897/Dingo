import { PrismaClient } from '@prisma/client';
import { CaseAnalysis, RawCase } from '../types';
import { CaseRepository } from '../repositories/case-repository';
import { LawyerRepository } from '../repositories/lawyer-repository';

export class CaseSaveService {
  private caseRepo: CaseRepository;
  private lawyerRepo: LawyerRepository;

  constructor(private prisma: PrismaClient) {
    this.caseRepo = new CaseRepository(prisma);
    this.lawyerRepo = new LawyerRepository(prisma);
  }

  async save(rawCase: RawCase, analysis: CaseAnalysis): Promise<void> {
    const lawyerIdsBySide = {
      plaintiff: [] as string[],
      defendant: [] as string[],
      associated: [] as string[],
    };

    for (const analyzedLawyer of analysis.lawyers) {
      let lawyer = await this.lawyerRepo.findByName(analyzedLawyer.lawyerName);

      if (!lawyer) {
        lawyer = await this.lawyerRepo.createPendingVerification(
          analyzedLawyer.lawyerName
        );
        console.log(`  ✨ Created pending lawyer: ${analyzedLawyer.lawyerName}`);
      }

      if (analyzedLawyer.side === 'plaintiff') {
        lawyerIdsBySide.plaintiff.push(lawyer.id);
      } else if (analyzedLawyer.side === 'defendant') {
        lawyerIdsBySide.defendant.push(lawyer.id);
      } else {
        lawyerIdsBySide.associated.push(lawyer.id);
      }
    }

    const savedCase = await this.caseRepo.upsertCase(
      rawCase.id,
      rawCase.text,
      analysis,
      lawyerIdsBySide
    );

    for (const analyzedLawyer of analysis.lawyers) {
      const lawyer = await this.lawyerRepo.findByName(analyzedLawyer.lawyerName);
      if (lawyer && !lawyer.caseIds.includes(savedCase.id)) {
        await this.lawyerRepo.addCaseToLawyer(lawyer.id, savedCase.id);
      }
    }

    console.log(`  💾 Saved case: ${savedCase.title}`);
  }
}
