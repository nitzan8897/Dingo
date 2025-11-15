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

    return lawyers.filter(
      (lawyer) =>
        lawyer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lawyer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lawyer.specialties.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [lawyers, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredLawyers,
  };
}
