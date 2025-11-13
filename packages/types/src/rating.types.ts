/**
 * Rating-related types for the Dingo platform
 */

export interface RatingVector {
  professionalism: number; // 0-100
  availability: number; // 0-100
  empathy: number; // 0-100
  cost: number; // 0-100
}

export interface RatingCriteria {
  name: keyof RatingVector;
  label: string;
  description: string;
  weight: number; // 0-1, used for overall score calculation
}

export const RATING_CRITERIA: RatingCriteria[] = [
  {
    name: 'professionalism',
    label: 'Professionalism',
    description: 'Quality of service and expertise',
    weight: 0.3,
  },
  {
    name: 'availability',
    label: 'Availability',
    description: 'Responsiveness and accessibility',
    weight: 0.25,
  },
  {
    name: 'empathy',
    label: 'Empathy',
    description: 'Understanding and communication',
    weight: 0.25,
  },
  {
    name: 'cost',
    label: 'Cost',
    description: 'Value for money',
    weight: 0.2,
  },
];

export function calculateOverallRating(ratings: RatingVector): number {
  return RATING_CRITERIA.reduce((total, criteria) => {
    return total + ratings[criteria.name] * criteria.weight;
  }, 0);
}
