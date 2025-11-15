import React from 'react';
import { RatingVector } from '@dingo/types';
import RatingBar from '../rating/rating-bar';
import CostRating from '../rating/cost-rating';

interface LawyerCardRatingsProps {
  ratings: RatingVector;
  labels: {
    professionalism: string;
    availability: string;
    empathy: string;
    cost: string;
  };
}

/**
 * Lawyer card ratings display with FIFA-style bars
 */
const LawyerCardRatings: React.FC<LawyerCardRatingsProps> = ({ ratings, labels }) => {
  return (
    <div className="space-y-2">
      <RatingBar
        label={labels.professionalism}
        value={ratings.professionalism}
        color="#10b981"
      />
      <RatingBar
        label={labels.availability}
        value={ratings.availability}
        color="#3b82f6"
      />
      <RatingBar
        label={labels.empathy}
        value={ratings.empathy}
        color="#8b5cf6"
      />
      <CostRating
        label={labels.cost}
        value={ratings.cost}
        color="#f59e0b"
        showValue={false}
      />
    </div>
  );
};

export default LawyerCardRatings;
