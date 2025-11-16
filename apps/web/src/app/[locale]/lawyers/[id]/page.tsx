import { getTranslations } from 'next-intl/server';
import { lawyerService } from '@/services/lawyer-service';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LawyerCardRatings from '@/components/lawyer/lawyer-card-ratings';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

/**
 * Lawyer Profile Page - Server Component
 * Fetches lawyer data server-side for SEO and performance
 * Uses locale-aware name display and shadcn/ui components
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

    return (
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-4xl">{displayName}</CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {cityName} • {lawyer.yearsOfExperience} {t('lawyer.yearsOfExperience')}
            </p>
          </CardHeader>
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
        <Card>
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
      </div>
    );
  } catch (error) {
    // If lawyer not found, show 404
    notFound();
  }
};

export default LawyerProfilePage;
