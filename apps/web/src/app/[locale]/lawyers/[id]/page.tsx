import { getTranslations } from 'next-intl/server';
import { lawyerService } from '@/services/lawyer-service';
import { caseService } from '@/services/case-service';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LawyerCardRatings from '@/components/lawyer/lawyer-card-ratings';
import ProfileAnimatedSections from '@/components/lawyer/profile-animated-sections';
import ProfileHeader from '@/components/lawyer/profile-header';
import CaseCard from '@/components/lawyer/case-card';
import CourtCaseCard from '@/components/case/case-card';
import ReviewCard from '@/components/lawyer/review-card';
import CaseStatsChart from '@/components/lawyer/case-stats-chart';
import ReviewsStats from '@/components/lawyer/reviews-stats';
import { BackButton } from '@/components/ui/back-button';
import { type Locale } from '@dingo/i18n';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

/**
 * Generate static params for pre-rendering lawyer pages
 * This significantly improves first-load performance
 * Falls back gracefully if API is unavailable during build
 */
export async function generateStaticParams() {
  try {
    const lawyers = await lawyerService.fetchLawyers();
    return lawyers.map((lawyer) => ({
      id: lawyer.id,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    // Return empty array to allow dynamic rendering as fallback
    return [];
  }
}

/**
 * Revalidate static pages every hour to ensure data freshness
 * This provides a balance between performance and up-to-date content
 */
export const revalidate = 3600;

/**
 * Lawyer Profile Page - Server Component
 * Fetches lawyer data server-side for SEO and performance
 * Uses locale-aware name display and shadcn/ui components
 * Uses ISR (Incremental Static Regeneration) for optimal performance
 */
const LawyerProfilePage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { id, locale } = resolvedParams;
  const t = await getTranslations();

  try {
    const lawyer = await lawyerService.fetchLawyerById(id);

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

    // Get featured and all profile cases
    const featuredCases = lawyer.cases?.filter((c) => c.isFeatured) || [];
    const allCases = lawyer.cases || [];
    const reviews = lawyer.reviews || [];

    // Fetch court cases where this lawyer is involved
    let courtCases: any[] = [];
    try {
      const allCourtCases = await caseService.fetchCases();
      courtCases = allCourtCases.filter(
        (c) =>
          c.plaintiffLawyerIds.includes(lawyer.id) ||
          c.defendantLawyerIds.includes(lawyer.id) ||
          c.associatedLawyerIds.includes(lawyer.id)
      );
    } catch (error) {
      console.error('Failed to fetch court cases:', error);
    }

    return (
      <>
        <ProfileHeader locale={locale as Locale} />
        <BackButton fallbackUrl={`/${locale}`} />

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
        {(allCases.length > 0 || reviews.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {allCases.length > 0 && <CaseStatsChart cases={allCases} />}
            {reviews.length > 0 && <ReviewsStats reviews={reviews} />}
          </div>
        )}

        {/* Featured Cases Section */}
        {featuredCases.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{t('lawyer.featuredCases')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featuredCases.map((case_) => (
                  <CaseCard key={case_.id} case_={case_} locale={locale} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Cases Section */}
        {allCases.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{t('lawyer.cases')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allCases.map((case_) => (
                  <CaseCard key={case_.id} case_={case_} locale={locale} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Court Cases Section */}
        {courtCases.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{t('lawyer.courtCases')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courtCases.map((case_) => (
                  <CourtCaseCard key={case_.id} case_={case_} />
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
        {allCases.length === 0 && reviews.length === 0 && (
          <Card className="mb-6">
            <CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">
              <p>{t('lawyer.noCases')}</p>
              <p className="mt-2">{t('lawyer.noReviews')}</p>
            </CardContent>
          </Card>
        )}
        </ProfileAnimatedSections>
      </>
    );
  } catch (error) {
    // If lawyer not found, show 404
    notFound();
  }
};

export default LawyerProfilePage;
