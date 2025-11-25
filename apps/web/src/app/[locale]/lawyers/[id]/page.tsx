import { getTranslations } from 'next-intl/server';
import { Locale } from '@dingo/i18n';
import PageHeader from '@/components/lawyer/page-header';
import { BackButton } from '@/components/ui/back-button';
import LawyerProfileClient from './lawyer-profile-client';

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
 * Uses global contexts for lawyer and cases data
 * No fetching needed - data flows from context
 */
const LawyerProfilePage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { id, locale } = resolvedParams;

  return (
    <>
      <PageHeader locale={locale as Locale} />
      <BackButton fallbackUrl={`/${locale}`} />
      <LawyerProfileClient lawyerId={id} locale={locale} />
    </>
  );
};

export default LawyerProfilePage;
