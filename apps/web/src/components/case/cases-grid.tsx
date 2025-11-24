'use client';

import React from 'react';
import { Case } from '@dingo/types';
import CaseCard from './case-card';

interface CasesGridProps {
  cases: Case[];
}

const CasesGrid: React.FC<CasesGridProps> = ({ cases }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases.map((case_) => (
        <CaseCard key={case_.id} case_={case_} />
      ))}
    </div>
  );
};

export default CasesGrid;
