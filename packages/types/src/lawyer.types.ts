import { RatingVector } from './rating.types';

/**
 * Lawyer-related types and DTOs
 */

export enum LawyerSpecialty {
  CRIMINAL = 'CRIMINAL',
  CIVIL = 'CIVIL',
  CORPORATE = 'CORPORATE',
  FAMILY = 'FAMILY',
  LABOR = 'LABOR',
  TAX = 'TAX',
  IMMIGRATION = 'IMMIGRATION',
  REAL_ESTATE = 'REAL_ESTATE',
  INTELLECTUAL_PROPERTY = 'INTELLECTUAL_PROPERTY',
}

export interface City {
  id: string;
  nameEn: string;
  nameHe: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CaseOutcome {
  WON = 'WON',
  LOST = 'LOST',
  SETTLED = 'SETTLED',
  ONGOING = 'ONGOING',
}

export interface Case {
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

export interface Lawyer {
  id: string;
  fullNameEn: string;
  fullNameHe: string;
  bioEn?: string;
  bioHe?: string;
  cityId: string;
  city: City;
  specialties: string[];
  yearsOfExperience: number;
  ratingVector: RatingVector;
  cases?: Case[];
  reviews?: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLawyerDTO {
  fullNameEn: string;
  fullNameHe: string;
  bioEn?: string;
  bioHe?: string;
  cityId: string;
  specialties: string[];
  yearsOfExperience: number;
  ratingVector: RatingVector;
}

export interface UpdateLawyerDTO extends Partial<CreateLawyerDTO> {}

export interface LawyerFilterDTO {
  specialty?: string;
  city?: string;
  minYearsOfExperience?: number;
  minRating?: number;
}
