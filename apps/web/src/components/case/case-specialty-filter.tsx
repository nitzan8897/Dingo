'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Specialty } from '@dingo/types';
import FilterTag from '@/components/search/filter-tag';

interface CaseSpecialtyFilterProps {
  selectedSpecialty?: string;
  onSpecialtyChange: (specialty?: string) => void;
}

const CaseSpecialtyFilter: React.FC<CaseSpecialtyFilterProps> = ({
  selectedSpecialty,
  onSpecialtyChange,
}) => {
  const t = useTranslations();
  const allSpecialties = Object.values(Specialty);

  const handleSpecialtyClick = (specialty: string): void => {
    if (selectedSpecialty === specialty) {
      onSpecialtyChange(undefined);
    } else {
      onSpecialtyChange(specialty);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allSpecialties.map((specialty) => (
        <FilterTag
          key={specialty}
          label={t(`specialties.${specialty}`)}
          value={specialty}
          selected={selectedSpecialty === specialty}
          onClick={handleSpecialtyClick}
        />
      ))}
    </div>
  );
};

export default CaseSpecialtyFilter;
