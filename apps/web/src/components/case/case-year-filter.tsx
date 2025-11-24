'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const t = useTranslations('case');
  const locale = useLocale();
  const isRTL = locale === 'he';

  const handleYearChange = (value: string) => {
    if (value === 'all') {
      onYearChange(undefined);
    } else {
      onYearChange(parseInt(value, 10));
    }
  };

  if (availableYears.length === 0) {
    return null;
  }

  return (
    <Select
      value={selectedYear ? selectedYear.toString() : 'all'}
      onValueChange={handleYearChange}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('filterByYear')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('allYears')}</SelectItem>
        {availableYears.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CaseYearFilter;
