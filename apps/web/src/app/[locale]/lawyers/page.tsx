import { Locale } from '@dingo/i18n';
import PageHeader from '@/components/lawyer/page-header';
import LawyersClient from './lawyers-client';
import LawyersStatsSection from './lawyers-stats-section';
import RecentCasesSection from './recent-cases-section';
import RecentReviewsSection from './recent-reviews-section';

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Server Component - Lawyers Search Page
 * Uses global context for data (populated from landing page)
 * No fetching needed - data flows from context
 * Header with toggles is provided by parent layout
 */
const LawyersPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  return (
    <>
      <PageHeader locale={locale as Locale} />
      <LawyersClient />
      <LawyersStatsSection />
      <RecentCasesSection locale={locale} />
      <RecentReviewsSection locale={locale} />
    </>
  );
};

export default LawyersPage;
