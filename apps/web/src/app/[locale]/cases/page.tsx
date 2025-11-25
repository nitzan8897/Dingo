import { getTranslations } from 'next-intl/server';
import { Locale } from '@dingo/i18n';
import { BackButton } from '@/components/ui/back-button';
import PageHeader from '@/components/lawyer/page-header';
import CasesClient from './cases-client';
import CasesPageHeader from './cases-page-header';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: `${t('case.title')} | ${t('common.appName')}`,
    description: t('metadata.description'),
  };
}

/**
 * Server Component - Cases Page
 * Uses global context for data (populated from landing page)
 * No fetching needed - data flows from context
 */
const CasesPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <>
      <PageHeader locale={locale as Locale} />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BackButton fallbackUrl={`/${locale}`} label={t('notFound.backHome')} />
        <CasesPageHeader />
        <CasesClient />
      </div>
    </>
  );
};

export default CasesPage;
