'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLawyers } from '@/contexts/lawyers-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReviewCard from '@/components/lawyer/review-card';
import { ArrowRight } from 'lucide-react';
import { Review } from '@dingo/types';

interface RecentReviewsSectionProps {
  locale: string;
}

/**
 * Client Component - Recent Reviews Section
 * Displays recent reviews from all lawyers
 * Uses lawyers context to aggregate reviews
 */
const RecentReviewsSection = ({ locale }: RecentReviewsSectionProps) => {
  const t = useTranslations();
  const { lawyers } = useLawyers();

  // Aggregate all reviews from all lawyers and sort by date
  const allReviews: Array<Review & { lawyerId: string; lawyerName: string }> = lawyers
    .flatMap((lawyer) =>
      (lawyer.reviews || []).map((review) => ({
        ...review,
        lawyerId: lawyer.id,
        lawyerName: locale === 'en' ? lawyer.fullNameEn : lawyer.fullNameHe,
      }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6); // Show 6 most recent reviews

  if (allReviews.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">{t('lawyers.recentReviews')}</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/lawyers`} className="gap-2">
              {t('lawyers.viewAllLawyers')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allReviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <Link
                  href={`/${locale}/lawyers/${review.lawyerId}`}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {review.lawyerName}
                </Link>
                <ReviewCard review={review} locale={locale} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentReviewsSection;
