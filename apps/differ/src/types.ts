import { Specialty } from '@dingo/types';

/**
 * Raw case data fetched from external source
 */
export type RawCase = {
  id: string; // external case identifier from the source system
  text: string; // full plain-text of the judgment
};

/**
 * Lawyer information extracted from case analysis
 */
export type AnalyzedLawyer = {
  lawyerName: string;
  lawyerId?: string; // optional, if we match existing DB record
  side: 'plaintiff' | 'defendant' | 'other';
};

/**
 * Case result types
 */
export type CaseResult = 'win' | 'lose' | 'settlement' | 'dismissed' | 'other';

/**
 * Structured analysis result from AI processing
 */
export type CaseAnalysis = {
  title: string;
  specialty: Specialty;
  result: CaseResult;
  judgeName?: string;
  openedAt: Date;
  closedAt: Date;
  complexityScore: number; // 0–1
  lawyers: AnalyzedLawyer[];
};

/**
 * AI prompt context for case analysis
 */
export type AnalysisPromptContext = {
  caseText: string;
  requestedFields: string[];
};
