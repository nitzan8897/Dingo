'use client';

import { Review } from '@dingo/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';

interface ReviewsStatsProps {
  reviews: Review[];
}

/**
 * ReviewsStats component
 * Displays review statistics including average rating and distribution
 */
const ReviewsStats = ({ reviews }: ReviewsStatsProps): JSX.Element => {
  const t = useTranslations();

  if (reviews.length === 0) {
    return <></>;
  }

  // Calculate average rating
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t('lawyer.reviews')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Average Rating */}
          <div className="text-center pb-4 border-b">
            <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center gap-1 my-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {reviews.length} {t('lawyer.reviewsCount')}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {distribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsStats;
