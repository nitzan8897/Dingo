'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CaseResult } from '@dingo/types';
import CaseSpecialtyFilter from './case-specialty-filter';
import CaseStatusFilter from './case-status-filter';
import CaseYearFilter from './case-year-filter';

interface CaseFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSpecialty?: string;
  onSpecialtyChange: (specialty?: string) => void;
  selectedStatus?: CaseResult;
  onStatusChange: (status?: CaseResult) => void;
  selectedYear?: number;
  onYearChange: (year?: number) => void;
  availableYears: number[];
  availableSpecialties?: string[];
  availableStatuses?: CaseResult[];
}

const CaseFilterBar: React.FC<CaseFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSpecialty,
  onSpecialtyChange,
  selectedStatus,
  onStatusChange,
  selectedYear,
  onYearChange,
  availableYears,
  availableSpecialties,
  availableStatuses,
}) => {
  const t = useTranslations();

  return (
    <div className="space-y-6 mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 rtl:left-auto rtl:right-3" />
        <Input
          type="text"
          placeholder={t('case.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 rtl:pl-4 rtl:pr-10 h-11 text-base md:text-sm"
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('case.filterBySpecialty')}
          </Label>
          <CaseSpecialtyFilter
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={onSpecialtyChange}
            availableSpecialties={availableSpecialties}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('case.filterByStatus')}
          </Label>
          <CaseStatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={onStatusChange}
            availableStatuses={availableStatuses}
          />
        </div>

        {availableYears.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-3 block">
              {t('case.filterByYear')}
            </Label>
            <CaseYearFilter
              selectedYear={selectedYear}
              onYearChange={onYearChange}
              availableYears={availableYears}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseFilterBar;
