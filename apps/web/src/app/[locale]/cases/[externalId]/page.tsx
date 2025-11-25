import { getTranslations } from 'next-intl/server';
import { Locale } from '@dingo/i18n';
import PageHeader from '@/components/lawyer/page-header';
import { BackButton } from '@/components/ui/back-button';
import CaseDetailClient from './case-detail-client';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    locale: string;
    externalId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: `${t('case.caseDetails')} | ${t('common.appName')}`,
    description: t('metadata.description'),
  };
}

/**
 * Server Component - Case Detail Page
 * Uses global contexts for case and lawyers data
 * No fetching needed - data flows from context
 */
const CaseDetailPage = async ({ params }: PageProps) => {
  const { locale, externalId } = await params;
  const t = await getTranslations({ locale });

  return (
    <>
      <PageHeader locale={locale as Locale} />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <BackButton fallbackUrl={`/${locale}/cases`} label={t('notFound.backHome')} />
        <CaseDetailClient externalId={externalId} />
      </div>
    </>
  );
};

export default CaseDetailPage;
