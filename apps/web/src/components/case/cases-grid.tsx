'use client';

import React from 'react';
import { Case } from '@dingo/types';
import CaseCard from './case-card';
import { DataPagination } from '@/components/ui/data-pagination';

interface CasesGridProps {
  cases: Case[];
}

const CasesGrid: React.FC<CasesGridProps> = ({ cases }) => {
  return (
    <DataPagination
      data={cases}
      itemsPerPage={6}
      renderItems={(items) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((case_) => (
            <CaseCard key={case_.id} case_={case_} />
          ))}
        </div>
      )}
    />
  );
};

export default CasesGrid;
