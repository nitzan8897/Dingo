import { ApiClient } from '../api/api-client';
import { CaseAnalysis, RawCase } from '../types';

export class CaseSaveService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async save(rawCase: RawCase, analysis: CaseAnalysis): Promise<void> {
    const lawyerIdsBySide = {
      plaintiff: [] as string[],
      defendant: [] as string[],
      associated: [] as string[],
    };

    for (const analyzedLawyer of analysis.lawyers) {
      let lawyer = await this.apiClient.findLawyerByName(analyzedLawyer.lawyerName);

      if (!lawyer) {
        lawyer = await this.apiClient.createPendingLawyer(analyzedLawyer.lawyerName);
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

    const savedCase = await this.apiClient.upsertCase({
      externalId: rawCase.id,
      title: analysis.title,
      specialty: analysis.specialty,
      result: analysis.result,
      judgeName: analysis.judgeName,
      openedAt: analysis.openedAt.toISOString(),
      closedAt: analysis.closedAt.toISOString(),
      complexityScore: analysis.complexityScore,
      rawText: rawCase.text,
      plaintiffLawyerIds: lawyerIdsBySide.plaintiff,
      defendantLawyerIds: lawyerIdsBySide.defendant,
      associatedLawyerIds: lawyerIdsBySide.associated,
    });

    for (const analyzedLawyer of analysis.lawyers) {
      const lawyer = await this.apiClient.findLawyerByName(analyzedLawyer.lawyerName);
      if (lawyer && !lawyer.caseIds?.includes(savedCase.id)) {
        await this.apiClient.addCaseToLawyer(lawyer.id, savedCase.id);
      }
    }

    console.log(`  💾 Saved case: ${savedCase.title}`);
  }
}
