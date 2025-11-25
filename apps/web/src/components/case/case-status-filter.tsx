'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CaseResult } from '@dingo/types';
import FilterTag from '@/components/search/filter-tag';

interface CaseStatusFilterProps {
  selectedStatus?: CaseResult;
  onStatusChange: (status?: CaseResult) => void;
  availableStatuses?: CaseResult[];
}

const CaseStatusFilter: React.FC<CaseStatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
  availableStatuses,
}) => {
  const t = useTranslations();
  const allStatuses: CaseResult[] = availableStatuses || ['DEFENCE_WON', 'ATTACK_WON', 'settlement', 'dismissed', 'other'];

  const handleStatusClick = (status: string): void => {
    const caseStatus = status as CaseResult;
    if (selectedStatus === caseStatus) {
      onStatusChange(undefined);
    } else {
      onStatusChange(caseStatus);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allStatuses.map((status) => (
        <FilterTag
          key={status}
          label={t(`caseResult.${status}`)}
          value={status}
          selected={selectedStatus === status}
          onClick={handleStatusClick}
        />
      ))}
    </div>
  );
};

export default CaseStatusFilter;
