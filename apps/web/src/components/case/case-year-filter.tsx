'use client';

import React from 'react';
import FilterTag from '@/components/search/filter-tag';

interface CaseYearFilterProps {
  selectedYear?: number;
  onYearChange: (year?: number) => void;
  availableYears: number[];
}

const CaseYearFilter: React.FC<CaseYearFilterProps> = ({
  selectedYear,
  onYearChange,
  availableYears,
}) => {
  const handleYearClick = (yearStr: string): void => {
    const year = parseInt(yearStr, 10);
    if (selectedYear === year) {
      onYearChange(undefined);
    } else {
      onYearChange(year);
    }
  };

  if (availableYears.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {availableYears.map((year) => (
        <FilterTag
          key={year}
          label={year.toString()}
          value={year.toString()}
          selected={selectedYear === year}
          onClick={handleYearClick}
        />
      ))}
    </div>
  );
};

export default CaseYearFilter;
