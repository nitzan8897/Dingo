import { getTranslations } from 'next-intl/server';
import { Case } from '@dingo/types';
import { caseService } from '@/services/case-service';
import CasesClient from './cases-client';

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

const CasesPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  let cases: Case[];
  try {
    cases = await caseService.fetchCases();
  } catch (error) {
    console.error('Failed to fetch cases:', error);
    cases = [];
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('case.title')}</h1>
        <p className="text-muted-foreground">
          {t('case.allCases')} ({cases.length})
        </p>
      </div>

      <CasesClient initialCases={cases} />
    </div>
  );
};

export default CasesPage;
