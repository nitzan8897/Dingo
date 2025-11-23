import { useState, useMemo } from 'react';
import { Lawyer } from '@dingo/types';

/**
 * Hook for client-side lawyer search
 * Handles instant search filtering
 */
export function useLawyerSearch(lawyers: Lawyer[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLawyers = useMemo(() => {
    if (!searchQuery.trim()) {
      return lawyers;
    }

    const query = searchQuery.toLowerCase();

    return lawyers.filter(
      (lawyer) =>
        lawyer.fullNameEn.toLowerCase().includes(query) ||
        lawyer.fullNameHe.toLowerCase().includes(query) ||
        lawyer.city.nameEn.toLowerCase().includes(query) ||
        lawyer.city.nameHe.toLowerCase().includes(query) ||
        lawyer.specialties.some((s) => s.toLowerCase().includes(query))
    );
  }, [lawyers, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredLawyers,
  };
}
