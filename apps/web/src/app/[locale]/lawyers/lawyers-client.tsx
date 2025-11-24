'use client';

import { useTranslations } from 'next-intl';
import { Lawyer } from '@dingo/types';
import SearchBar from '@/components/search/search-bar';
import EmptyState from '@/components/lawyers/empty-state';
import LawyersGrid from '@/components/lawyers/lawyers-grid';
import { useLawyerFilters } from '@/hooks/use-lawyer-filters';
import { useLawyerSearch } from '@/hooks/use-lawyer-search';

interface LawyersClientProps {
  initialLawyers: Lawyer[];
}

/**
 * Client Component for interactive lawyers search page features
 * Orchestrates search and filtering using custom hooks
 * Single Responsibility: UI composition and coordination
 */
const LawyersClient = ({ initialLawyers }: LawyersClientProps) => {
  const t = useTranslations();

  const {
    lawyers,
    selectedSpecialties,
    handleFilterSpecialties,
    handleFilterCity,
    handleSpecialtyClick,
  } = useLawyerFilters(initialLawyers);

  const { setSearchQuery, filteredLawyers } = useLawyerSearch(lawyers);

  return (
    <>
      <SearchBar
        onSearch={setSearchQuery}
        onFilterSpecialties={handleFilterSpecialties}
        onFilterCity={handleFilterCity}
        selectedSpecialties={selectedSpecialties}
      />

      <LawyersGrid
        lawyers={filteredLawyers}
        onSpecialtyClick={handleSpecialtyClick}
      />

      {filteredLawyers.length === 0 && (
        <EmptyState message={t('lawyers.noLawyersFound')} />
      )}
    </>
  );
};

export default LawyersClient;
