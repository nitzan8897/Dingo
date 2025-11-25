import { getTranslations } from 'next-intl/server';
import { Locale } from '@dingo/i18n';
import PageHeader from '@/components/lawyer/page-header';
import { BackButton } from '@/components/ui/back-button';
import LawyerProfileClient from './lawyer-profile-client';
import { lawyerService } from '@/services/lawyer-service';
import { caseService } from '@/services/case-service';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

/**
 * Revalidate static pages every hour to ensure data freshness
 * This provides a balance between performance and up-to-date content
 */
export const revalidate = 3600;

/**
 * Lawyer Profile Page - Server Component
 * Fetches lawyer with reviews and court cases
 * No context needed - props-based data flow
 */
const LawyerProfilePage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { id, locale } = resolvedParams;

  try {
    // Fetch lawyer and all court cases (to filter lawyer's cases)
    const [lawyer, allCases] = await Promise.all([
      lawyerService.fetchLawyerById(id),
      caseService.fetchCases(),
    ]);

    return (
      <>
        <PageHeader locale={locale as Locale} />
        <BackButton fallbackUrl={`/${locale}`} />
        <LawyerProfileClient lawyer={lawyer} cases={allCases} locale={locale} />
      </>
    );
  } catch (error) {
    // If lawyer not found, show 404
    notFound();
  }
};

export default LawyerProfilePage;
