'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Case, CaseResult } from '@dingo/types';
import CaseFilterBar from '@/components/case/case-filter-bar';
import CasesGrid from '@/components/case/cases-grid';
import CasesEmptyState from '@/components/case/cases-empty-state';

interface CasesClientProps {
  cases: Case[];
}

/**
 * Client Component for cases page
 * Receives cases as props from Server Component
 * No context needed - data flows via props (React best practice)
 */
const CasesClient: React.FC<CasesClientProps> = ({ cases: initialCases }) => {
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>(
    searchParams.get('specialty') || undefined
  );
  const [selectedStatus, setSelectedStatus] = useState<CaseResult | undefined>();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();

  // Update filter when URL params change
  useEffect(() => {
    const specialtyParam = searchParams.get('specialty');
    if (specialtyParam) {
      setSelectedSpecialty(specialtyParam);
    }
  }, [searchParams]);

  const availableYears = useMemo(() => {
    const years = initialCases
      .filter((c) => c.closedAt)
      .map((c) => new Date(c.closedAt!).getFullYear());
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
    return uniqueYears;
  }, [initialCases]);

  const availableSpecialties = useMemo(() => {
    const specialties = initialCases
      .map((c) => c.specialty)
      .filter((s): s is string => s !== null && s !== undefined);
    return Array.from(new Set(specialties)).sort();
  }, [initialCases]);

  const availableStatuses = useMemo(() => {
    const statuses = initialCases.map((c) => c.result);
    return Array.from(new Set(statuses)).sort() as CaseResult[];
  }, [initialCases]);

  const filteredCases = useMemo(() => {
    return initialCases.filter((case_) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        case_.title.toLowerCase().includes(searchLower) ||
        case_.judgeName?.toLowerCase().includes(searchLower) ||
        false;

      const matchesSpecialty =
        !selectedSpecialty || case_.specialty === selectedSpecialty;

      const matchesStatus = !selectedStatus || case_.result === selectedStatus;

      const matchesYear =
        !selectedYear ||
        (case_.closedAt &&
          new Date(case_.closedAt).getFullYear() === selectedYear);

      return matchesSearch && matchesSpecialty && matchesStatus && matchesYear;
    });
  }, [initialCases, searchQuery, selectedSpecialty, selectedStatus, selectedYear]);

  return (
    <div>
      <CaseFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={setSelectedSpecialty}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        availableYears={availableYears}
        availableSpecialties={availableSpecialties}
        availableStatuses={availableStatuses}
      />

      {filteredCases.length > 0 ? (
        <CasesGrid cases={filteredCases} />
      ) : (
        <CasesEmptyState />
      )}
    </div>
  );
};

export default CasesClient;
