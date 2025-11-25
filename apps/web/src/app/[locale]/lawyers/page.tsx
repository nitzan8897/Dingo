import { Locale } from '@dingo/i18n';
import PageHeader from '@/components/lawyer/page-header';
import LawyersClient from './lawyers-client';
import RecentCasesSection from './recent-cases-section';
import RecentReviewsSection from './recent-reviews-section';
import { lawyerService } from '@/services/lawyer-service';
import { caseService } from '@/services/case-service';

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Server Component - Lawyers Search Page
 * Fetches only the data needed for this page
 * No context needed - Next.js caching handles performance
 */
const LawyersPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  // Fetch lawyers and cases for this page
  const [allLawyers, allCases] = await Promise.all([
    lawyerService.fetchLawyers(),
    caseService.fetchCases(),
  ]);

  // Extract unique specialties from actual lawyer data
  const uniqueSpecialties = Array.from(
    new Set(allLawyers.flatMap((lawyer) => lawyer.specialties))
  ).sort();

  return (
    <>
      <PageHeader locale={locale as Locale} />
      <LawyersClient lawyers={allLawyers} availableSpecialties={uniqueSpecialties} />
      <RecentCasesSection locale={locale} cases={allCases} />
      <RecentReviewsSection locale={locale} />
    </>
  );
};

export default LawyersPage;
