'use client';

import { useTranslations } from 'next-intl';
import SearchBar from '@/components/search/search-bar';
import EmptyState from '@/components/lawyers/empty-state';
import LawyersGrid from '@/components/lawyers/lawyers-grid';
import { useLawyerFilters } from '@/hooks/use-lawyer-filters';
import { useLawyerSearch } from '@/hooks/use-lawyer-search';
import { useLawyers } from '@/contexts/lawyers-context';

/**
 * Client Component for interactive lawyers search page features
 * Uses global context for lawyers data (no fetching needed)
 * Shows progressive data as it arrives from landing page
 * Single Responsibility: UI composition and coordination
 */
const LawyersClient = () => {
  const t = useTranslations();
  const { lawyers: contextLawyers, isLoading } = useLawyers();

  const {
    lawyers,
    selectedSpecialties,
    handleFilterSpecialties,
    handleFilterCity,
    handleSpecialtyClick,
  } = useLawyerFilters(contextLawyers);

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
