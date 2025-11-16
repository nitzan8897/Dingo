import { CaseAnalysisService } from './services/case-analysis-service';
import { CaseAnalysis } from './types';

const analysisService = new CaseAnalysisService();

export async function analyzeCaseWithAI(caseText: string): Promise<CaseAnalysis> {
  return analysisService.analyze(caseText);
}
