'use client';

import { useLawyers } from '@/contexts/lawyers-context';
import { useCases } from '@/contexts/cases-context';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LawyerCardRatings from '@/components/lawyer/lawyer-card-ratings';
import ProfileAnimatedSections from '@/components/lawyer/profile-animated-sections';
import CaseCard from '@/components/case/case-card';
import ReviewCard from '@/components/lawyer/review-card';
import CaseStatsChart from '@/components/lawyer/case-stats-chart';
import ReviewsStats from '@/components/lawyer/reviews-stats';

interface LawyerProfileClientProps {
  lawyerId: string;
  locale: string;
}

/**
 * Client Component - Lawyer Profile
 * Uses global contexts for lawyer and cases data
 * No fetching needed - reads from global context
 */
const LawyerProfileClient = ({ lawyerId, locale }: LawyerProfileClientProps) => {
  const t = useTranslations();
  const { getLawyerById } = useLawyers();
  const { cases: allCases } = useCases();

  const lawyer = getLawyerById(lawyerId);

  // If lawyer not found in context, show 404
  if (!lawyer) {
    notFound();
  }

  // Use locale-aware name display (same logic as LawyerCardHeader)
  const displayName = locale === 'en' ? lawyer.fullNameEn : lawyer.fullNameHe;
  const cityName = locale === 'en' ? lawyer.city.nameEn : lawyer.city.nameHe;

  // Get initials for avatar fallback
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const reviews = lawyer.reviews || [];

  // Filter court cases where this lawyer is involved
  const courtCases = allCases.filter(
    (c) =>
      c.plaintiffLawyerIds.includes(lawyer.id) ||
      c.defendantLawyerIds.includes(lawyer.id) ||
      c.associatedLawyerIds.includes(lawyer.id)
  );

  return (
    <ProfileAnimatedSections>
      {/* Header Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={undefined} alt={displayName} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-4xl mb-2">{displayName}</CardTitle>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {cityName} • {lawyer.yearsOfExperience} {t('lawyer.yearsOfExperience')}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Bio Card */}
      {(lawyer.bioEn || lawyer.bioHe) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{t('lawyer.about')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {locale === 'en' ? lawyer.bioEn : lawyer.bioHe}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Specialties Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{t('lawyer.specialties')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {lawyer.specialties.map((specialty) => (
              <Badge key={specialty} variant="outline" className="text-base px-3 py-1">
                {t(`specialties.${specialty}`)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ratings Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{t('lawyer.ratings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <LawyerCardRatings
            ratings={lawyer.ratingVector}
            labels={{
              professionalism: t('ratings.professionalism'),
              availability: t('ratings.availability'),
              empathy: t('ratings.empathy'),
              cost: t('ratings.cost'),
            }}
          />
        </CardContent>
      </Card>

      {/* Stats Grid - Cases and Reviews */}
      {(courtCases.length > 0 || reviews.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {courtCases.length > 0 && <CaseStatsChart cases={courtCases} />}
          {reviews.length > 0 && <ReviewsStats reviews={reviews} />}
        </div>
      )}

      {/* Cases Section */}
      {courtCases.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{t('lawyer.cases')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courtCases.map((case_) => (
                <CaseCard key={case_.id} case_={case_} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{t('lawyer.reviews')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} locale={locale} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {courtCases.length === 0 && reviews.length === 0 && (
        <Card className="mb-6">
          <CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">
            <p>{t('lawyer.noCases')}</p>
            <p className="mt-2">{t('lawyer.noReviews')}</p>
          </CardContent>
        </Card>
      )}
    </ProfileAnimatedSections>
  );
};

export default LawyerProfileClient;
