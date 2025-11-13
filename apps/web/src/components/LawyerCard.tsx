import React from 'react';
import { Lawyer, calculateOverallRating } from '@dingo/types';
import RatingBar from './RatingBar';

interface LawyerCardProps {
  lawyer: Lawyer;
}

/**
 * LawyerCard component - Web implementation
 * Displays lawyer information with FIFA-style ratings
 */
const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer }) => {
  const overallRating = Math.round(calculateOverallRating(lawyer.ratingVector));

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{lawyer.fullName}</h3>
          <p className="text-sm text-gray-600">{lawyer.city}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary-600">{overallRating}</div>
          <div className="text-xs text-gray-500">Overall</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {lawyer.specialties.map((specialty) => (
            <span
              key={specialty}
              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <span className="font-semibold">{lawyer.yearsOfExperience}</span> years of experience
      </div>

      <div className="space-y-2">
        <RatingBar
          label="Professionalism"
          value={lawyer.ratingVector.professionalism}
          color="#10b981"
        />
        <RatingBar
          label="Availability"
          value={lawyer.ratingVector.availability}
          color="#3b82f6"
        />
        <RatingBar
          label="Empathy"
          value={lawyer.ratingVector.empathy}
          color="#8b5cf6"
        />
        <RatingBar
          label="Cost"
          value={lawyer.ratingVector.cost}
          color="#f59e0b"
        />
      </div>
    </div>
  );
};

export default LawyerCard;
