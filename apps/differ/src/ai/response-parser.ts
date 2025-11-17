import { Specialty } from '@dingo/types';
import { CaseAnalysis } from '../types';

export function parseAIResponse(responseText: string): CaseAnalysis {
  try {
    const parsed = JSON.parse(responseText);

    const specialty = parsed.specialty?.toUpperCase() as Specialty;
    if (!Object.values(Specialty).includes(specialty)) {
      throw new Error(`Invalid specialty: ${parsed.specialty}`);
    }

    const validResults = ['win', 'lose', 'settlement', 'dismissed', 'other'];
    if (!validResults.includes(parsed.result)) {
      throw new Error(`Invalid result: ${parsed.result}`);
    }

    return {
      title: parsed.title || 'Unknown Case',
      specialty,
      result: parsed.result,
      judgeName: parsed.judgeName,
      openedAt: new Date(parsed.openedAt),
      closedAt: new Date(parsed.closedAt),
      complexityScore: Math.max(0, Math.min(1, parsed.complexityScore || 0.5)),
      lawyers: (parsed.lawyers || []).map((l: any) => ({
        lawyerName: l.lawyerName,
        lawyerId: l.lawyerId,
        side: l.side || 'other',
      })),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`AI response parsing failed: ${message}`);
  }
}
