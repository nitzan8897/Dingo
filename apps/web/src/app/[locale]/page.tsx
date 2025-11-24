import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import HomeHeader from '@/components/home/home-header';
import HomeClient from './home-client';
import { lawyerService } from '@/services/lawyer-service';
import { caseService } from '@/services/case-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CaseCard from '@/components/case/case-card';
import { ArrowRight } from 'lucide-react';

/**
 * Server Component - Home Page
 * Fetches initial lawyer data server-side for:
 * - SEO: Search engines see full content
 * - Performance: No loading spinner on initial load
 * - SSR/SSG: Pre-rendered HTML with data
 * Header with toggles is provided by parent layout
 */
const HomePage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations();
  const initialLawyers = await lawyerService.fetchLawyers();

  let recentCases = [];
  try {
    const allCases = await caseService.fetchCases();
    recentCases = allCases.slice(0, 3);
  } catch (error) {
    console.error('Failed to fetch cases:', error);
  }

  return (
    <>
      <HomeHeader title={t('home.title')} subtitle={t('home.subtitle')} />
      <HomeClient initialLawyers={initialLawyers} />

      {/* Recent Cases Section */}
      {recentCases.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">{t('home.recentCases')}</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${locale}/cases`} className="gap-2">
                  {t('home.viewAllCases')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentCases.map((case_) => (
                  <CaseCard key={case_.id} case_={case_} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default HomePage;
