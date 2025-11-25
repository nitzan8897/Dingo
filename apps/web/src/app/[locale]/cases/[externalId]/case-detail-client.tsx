'use client';

import { Case, Lawyer } from '@dingo/types';
import CaseDetailHeader from '@/components/case/case-detail-header';
import CaseLawyersSection from '@/components/case/case-lawyers-section';
import { Separator } from '@/components/ui/separator';

interface CaseDetailClientProps {
  case_: Case;
  lawyers: Lawyer[];
}

/**
 * Client Component - Case Detail
 * Receives case and lawyers as props from Server Component
 * No context needed - props-based data flow
 */
const CaseDetailClient = ({ case_, lawyers: allLawyers }: CaseDetailClientProps) => {

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
