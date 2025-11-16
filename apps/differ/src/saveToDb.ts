import { RawCase, CaseAnalysis } from './types';
import { CaseSaveService } from './services/case-save-service';

export async function saveCaseAnalysis(
  rawCase: RawCase,
  analysis: CaseAnalysis
): Promise<void> {
  const saveService = new CaseSaveService();
  await saveService.save(rawCase, analysis);
}
