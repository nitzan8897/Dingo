import React from 'react';
import { Lawyer } from '@dingo/types';

export interface LawyerCardProps {
  lawyer: Lawyer;
  onPress?: () => void;
}

/**
 * LawyerCard component - displays lawyer information with FIFA-style ratings
 * This is a data component that returns structured data for rendering
 * Actual rendering is handled by platform-specific implementations
 */
export const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer, onPress }) => {
  return {
    id: lawyer.id,
    fullName: lawyer.fullName,
    city: lawyer.city,
    specialties: lawyer.specialties,
    yearsOfExperience: lawyer.yearsOfExperience,
    ratingVector: lawyer.ratingVector,
    onPress,
    type: 'LawyerCard' as const,
  } as any;
};

// Type for the lawyer card data
export type LawyerCardData = {
  id: string;
  fullName: string;
  city: string;
  specialties: string[];
  yearsOfExperience: number;
  ratingVector: {
    professionalism: number;
    availability: number;
    empathy: number;
    cost: number;
  };
  onPress?: () => void;
  type: 'LawyerCard';
};
