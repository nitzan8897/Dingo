import { RatingVector } from './rating.types';
import { Specialty } from './specialty.types';
import { City } from './city.types';
import { ProfileCase, Review } from './case.types';

/**
 * Lawyer-related types and DTOs
 */

// Re-export for convenience
export { Specialty };

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
  caseIds?: string[]; // Array of court case IDs from differ app
  cases?: ProfileCase[]; // Profile showcase cases
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
