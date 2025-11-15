import { PrismaClient } from '@prisma/client';
import { RawCase, CaseAnalysis } from './types';
import { CaseSaveService } from './services/case-save-service';

export async function saveCaseAnalysis(
  rawCase: RawCase,
  analysis: CaseAnalysis,
  prisma: PrismaClient
): Promise<void> {
  const saveService = new CaseSaveService(prisma);
  await saveService.save(rawCase, analysis);
}
