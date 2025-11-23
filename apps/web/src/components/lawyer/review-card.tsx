'use client';

import { Review } from '@dingo/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  locale: string;
}

/**
 * ReviewCard component
 * Displays individual review with star rating and bilingual support
 */
const ReviewCard = ({ review, locale }: ReviewCardProps): JSX.Element => {
  const t = useTranslations();
  const comment = locale === 'en' ? review.commentEn : review.commentHe;

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
        }`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-lg">{review.reviewerName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(review.createdAt).toLocaleDateString(
                locale === 'en' ? 'en-US' : 'he-IL',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )}
            </p>
          </div>
          <div className="flex gap-0.5">{renderStars(review.rating)}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
          &ldquo;{comment}&rdquo;
        </p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
