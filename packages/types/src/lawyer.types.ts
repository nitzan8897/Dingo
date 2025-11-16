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

export interface Lawyer {
  id: string;
  fullNameEn: string;
  fullNameHe: string;
  cityId: string;
  city: City;
  specialties: string[];
  yearsOfExperience: number;
  ratingVector: RatingVector;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLawyerDTO {
  fullNameEn: string;
  fullNameHe: string;
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
