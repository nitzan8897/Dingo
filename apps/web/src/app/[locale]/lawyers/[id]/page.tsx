import { getTranslations } from 'next-intl/server';
import { lawyerService } from '@/services/lawyer-service';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

    // Get initials for avatar fallback
    const initials = displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="max-w-4xl mx-auto">
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
