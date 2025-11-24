import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Locale } from '@dingo/i18n';
import { caseService } from '@/services/case-service';
import { lawyerService } from '@/services/lawyer-service';
import { Lawyer } from '@dingo/types';
import PageHeader from '@/components/lawyer/page-header';
import CaseDetailHeader from '@/components/case/case-detail-header';
import CaseLawyersSection from '@/components/case/case-lawyers-section';
import { Separator } from '@/components/ui/separator';
import { BackButton } from '@/components/ui/back-button';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    locale: string;
    externalId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, externalId } = await params;
  const t = await getTranslations({ locale });

  try {
    const case_ = await caseService.fetchCaseByExternalId(externalId);

    return {
      title: `${case_.title} | ${t('case.title')} | ${t('common.appName')}`,
      description: `${t('case.caseDetails')}: ${case_.title}`,
    };
  } catch {
    return {
      title: `${t('case.caseDetails')} | ${t('common.appName')}`,
    };
  }
}

const CaseDetailPage = async ({ params }: PageProps) => {
  const { locale, externalId } = await params;

  let case_;
  try {
    case_ = await caseService.fetchCaseByExternalId(externalId);
  } catch (error) {
    console.error(`Case not found: ${externalId}`, error);
    notFound();
  }

  let allLawyers: Lawyer[] = [];
  try {
    allLawyers = await lawyerService.fetchLawyers();
  } catch (error) {
    console.error('Failed to fetch lawyers:', error);
  }

  const plaintiffLawyers = allLawyers.filter((l) =>
    case_.plaintiffLawyerIds.includes(l.id)
  );
  const defendantLawyers = allLawyers.filter((l) =>
    case_.defendantLawyerIds.includes(l.id)
  );
  const associatedLawyers = allLawyers.filter((l) =>
    case_.associatedLawyerIds.includes(l.id)
  );

  // Determine winning side lawyers based on result
  const winningSideLawyers =
    case_.result === 'ATTACK_WON'
      ? plaintiffLawyers
      : case_.result === 'DEFENCE_WON'
      ? defendantLawyers
      : [];

  return (
    <>
      <PageHeader locale={locale as Locale} />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <BackButton fallbackUrl={`/${locale}/cases`} />

        <CaseDetailHeader case_={case_} winningSideLawyers={winningSideLawyers} />

        <Separator className="my-8" />

        <CaseLawyersSection
          plaintiffLawyers={plaintiffLawyers}
          defendantLawyers={defendantLawyers}
          associatedLawyers={associatedLawyers}
        />
      </div>
    </>
  );
};

export default CaseDetailPage;
