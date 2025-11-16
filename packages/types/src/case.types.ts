export type CaseResult = 'win' | 'lose' | 'settlement' | 'dismissed' | 'other';

export interface Case {
  id: string;
  externalId: string;
  title: string;
  specialty: string;
  result: CaseResult;
  judgeName?: string;
  openedAt?: Date;
  closedAt?: Date;
  complexityScore: number;
  rawText: string;
  plaintiffLawyerIds: string[];
  defendantLawyerIds: string[];
  associatedLawyerIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCaseDTO {
  externalId: string;
  title: string;
  specialty: string;
  result: CaseResult;
  judgeName?: string;
  openedAt?: string;
  closedAt?: string;
  complexityScore: number;
  rawText: string;
  plaintiffLawyerIds: string[];
  defendantLawyerIds: string[];
  associatedLawyerIds: string[];
}

export type LawyerSide = 'plaintiff' | 'defendant' | 'other';

export interface AnalyzedLawyer {
  lawyerName: string;
  lawyerId?: string;
  side: LawyerSide;
}

export interface CaseAnalysis {
  title: string;
  specialty: string;
  result: CaseResult;
  judgeName?: string;
  openedAt: Date;
  closedAt: Date;
  complexityScore: number;
  lawyers: AnalyzedLawyer[];
}
