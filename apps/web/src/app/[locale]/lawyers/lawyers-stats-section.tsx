'use client';

import { useLawyers } from '@/contexts/lawyers-context';
import { useCases } from '@/contexts/cases-context';
import CaseStatsChart from '@/components/lawyer/case-stats-chart';
import ReviewsStats from '@/components/lawyer/reviews-stats';
import { Review } from '@dingo/types';

/**
 * Client Component - Lawyers Stats Section
 * Displays aggregated case statistics and reviews statistics
 * Uses data from global contexts
 */
const LawyersStatsSection = () => {
  const { lawyers } = useLawyers();
  const { cases } = useCases();

  // Aggregate all reviews from all lawyers
  const allReviews: Review[] = lawyers.flatMap((lawyer) => lawyer.reviews || []);

  if (cases.length === 0 && allReviews.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        {cases.length > 0 && <CaseStatsChart cases={cases} />}
        {allReviews.length > 0 && <ReviewsStats reviews={allReviews} />}
      </div>
    </div>
  );
};

export default LawyersStatsSection;
