'use client';

import { Lawyer, Case } from '@dingo/types';
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
import { DataPagination } from '@/components/ui/data-pagination';

interface LawyerProfileClientProps {
  lawyer: Lawyer;
  cases: Case[];
  locale: string;
}

/**
 * Client Component - Lawyer Profile
 * Receives lawyer with reviews and filters court cases
 * No context needed - props-based data flow
 */
const LawyerProfileClient = ({ lawyer, cases: allCases, locale }: LawyerProfileClientProps) => {
  const t = useTranslations();

  // Use locale-aware name display
  const displayName = locale === 'en' ? lawyer.fullNameEn : lawyer.fullNameHe;
  const cityName = locale === 'en' ? lawyer.city.nameEn : lawyer.city.nameHe;

  // Get initials for avatar fallback
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Filter court cases where this lawyer is involved
  const courtCases = allCases.filter(
    (c) =>
      c.plaintiffLawyerIds.includes(lawyer.id) ||
      c.defendantLawyerIds.includes(lawyer.id) ||
      c.associatedLawyerIds.includes(lawyer.id)
  );

  const reviews = lawyer.reviews || [];

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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{t('lawyer.about')}</CardTitle>
        </CardHeader>
        <CardContent>
          {(lawyer.bioEn || lawyer.bioHe) ? (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {locale === 'en' ? lawyer.bioEn : lawyer.bioHe}
            </p>
          ) : (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('lawyer.noBio')}
            </p>
          )}
        </CardContent>
      </Card>

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
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {courtCases.length > 0 ? (
          <CaseStatsChart cases={courtCases} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('lawyer.caseStats')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('lawyer.noCaseStats')}
              </p>
            </CardContent>
          </Card>
        )}

        {reviews.length > 0 ? (
          <ReviewsStats reviews={reviews} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('lawyer.reviewStats')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('lawyer.noReviewStats')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cases Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{t('lawyer.cases')}</CardTitle>
        </CardHeader>
        <CardContent>
          {courtCases.length > 0 ? (
            <DataPagination
              data={courtCases}
              itemsPerPage={3}
              renderItems={(items) => (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((case_) => (
                    <CaseCard key={case_.id} case_={case_} />
                  ))}
                </div>
              )}
            />
          ) : (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('lawyer.noCases')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{t('lawyer.reviews')}</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <DataPagination
              data={reviews}
              itemsPerPage={3}
              renderItems={(items) => (
                <div className="space-y-4">
                  {items.map((review) => (
                    <ReviewCard key={review.id} review={review} locale={locale} />
                  ))}
                </div>
              )}
            />
          ) : (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('lawyer.noReviews')}
            </p>
          )}
        </CardContent>
      </Card>
    </ProfileAnimatedSections>
  );
};

export default LawyerProfileClient;
