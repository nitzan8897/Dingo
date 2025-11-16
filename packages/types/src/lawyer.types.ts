import { RatingVector } from './rating.types';
import { Specialty } from './specialty.types';

/**
 * Lawyer-related types and DTOs
 */

// Re-export Specialty enum for convenience
export { Specialty };

export interface Lawyer {
  id: string;
  fullNameEn: string;
  fullNameHe: string;
  city: string;
  specialties: string[];
  yearsOfExperience: number;
  ratingVector: RatingVector;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLawyerDTO {
  fullNameEn: string;
  fullNameHe: string;
  city: string;
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
