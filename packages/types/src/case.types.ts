export type CaseResult = 'win' | 'lose' | 'settlement' | 'dismissed' | 'other';

export enum CaseOutcome {
  WON = 'WON',
  LOST = 'LOST',
  SETTLED = 'SETTLED',
  ONGOING = 'ONGOING',
}

export interface Case {
  id: string;
  externalId: string;
  title: string;
  specialty: string;
  result: CaseResult;
  judgeName?: string;
  pdfUrl?: string;
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

export interface ProfileCase {
  id: string;
  lawyerId: string;
  titleEn: string;
  titleHe: string;
  descriptionEn: string;
  descriptionHe: string;
  outcome: CaseOutcome;
  year: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  lawyerId: string;
  reviewerName: string;
  rating: number;
  commentEn: string;
  commentHe: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCaseDTO {
  externalId: string;
  title: string;
  specialty: string;
  result: CaseResult;
  judgeName?: string;
  pdfUrl?: string;
  openedAt?: Date;
  closedAt?: Date;
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

export interface CaseFilterParams {
  search?: string;
  specialty?: string;
  name?: string;
  year?: number;
  status?: CaseResult;
}
