import { getTranslations } from 'next-intl/server';
import { Locale } from '@dingo/i18n';
import PageHeader from '@/components/lawyer/page-header';
import { BackButton } from '@/components/ui/back-button';
import CaseDetailClient from './case-detail-client';
import { caseService } from '@/services/case-service';
import { lawyerService } from '@/services/lawyer-service';
import { notFound } from 'next/navigation';

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
 * Fetches case and lawyers directly
 * No context needed - props-based data flow
 */
const CaseDetailPage = async ({ params }: PageProps) => {
  const { locale, externalId } = await params;
  const t = await getTranslations({ locale });

  try {
    // Fetch case and all lawyers (to find associated lawyers)
    const [caseData, allLawyers] = await Promise.all([
      caseService.fetchCaseByExternalId(externalId),
      lawyerService.fetchLawyers(),
    ]);

    return (
      <>
        <PageHeader locale={locale as Locale} />
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <BackButton fallbackUrl={`/${locale}/cases`} label={t('notFound.backHome')} />
          <CaseDetailClient case_={caseData} lawyers={allLawyers} />
        </div>
      </>
    );
  } catch (error) {
    // If case not found, show 404
    notFound();
  }
};

export default CaseDetailPage;
