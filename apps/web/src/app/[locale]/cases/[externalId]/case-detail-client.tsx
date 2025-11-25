'use client';

import { useCases } from '@/contexts/cases-context';
import { useLawyers } from '@/contexts/lawyers-context';
import { notFound } from 'next/navigation';
import CaseDetailHeader from '@/components/case/case-detail-header';
import CaseLawyersSection from '@/components/case/case-lawyers-section';
import { Separator } from '@/components/ui/separator';

interface CaseDetailClientProps {
  externalId: string;
}

/**
 * Client Component - Case Detail
 * Uses global contexts for case and lawyers data
 * No fetching needed - reads from global context
 */
const CaseDetailClient = ({ externalId }: CaseDetailClientProps) => {
  const { getCaseByExternalId } = useCases();
  const { lawyers: allLawyers } = useLawyers();

  const case_ = getCaseByExternalId(externalId);

  // If case not found in context, show 404
  if (!case_) {
    notFound();
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
      <CaseDetailHeader case_={case_} winningSideLawyers={winningSideLawyers} />

      <Separator className="my-8" />

      <CaseLawyersSection
        plaintiffLawyers={plaintiffLawyers}
        defendantLawyers={defendantLawyers}
        associatedLawyers={associatedLawyers}
      />
    </>
  );
};

export default CaseDetailClient;
