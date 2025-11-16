import { ClaudeClient } from '../ai/claude-client';
import { buildAnalysisPrompt } from '../ai/prompt-builder';
import { parseAIResponse } from '../ai/response-parser';
import { CaseAnalysis } from '../types';

export class CaseAnalysisService {
  private claudeClient: ClaudeClient;

  constructor() {
    this.claudeClient = new ClaudeClient();
  }

  async analyze(caseText: string): Promise<CaseAnalysis> {
    const prompt = buildAnalysisPrompt(caseText);
    const responseText = await this.claudeClient.analyze(prompt);
    return parseAIResponse(responseText);
  }
}
