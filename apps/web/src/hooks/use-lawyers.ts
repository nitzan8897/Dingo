import { useState, useEffect, useCallback } from 'react';
import { Lawyer } from '@dingo/types';
import { lawyerService, FetchLawyersParams } from '@/services/lawyer-service';

/**
 * Custom hook for managing lawyer data
 * Follows Single Responsibility Principle - handles lawyer state management
 * Follows Dependency Inversion Principle - depends on LawyerService abstraction
 */
export function useLawyers() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch lawyers from API
   * @param params - Optional filter parameters
   */
  const fetchLawyers = useCallback(async (params?: FetchLawyersParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await lawyerService.fetchLawyers(params);
      setLawyers(data);
      setFilteredLawyers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch lawyers'));
      console.error('Error fetching lawyers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search/filter lawyers by query
   * @param query - Search query string
   */
  const searchLawyers = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setFilteredLawyers(lawyers);
        return;
      }

      const filtered = lawyers.filter(
        (lawyer) =>
          lawyer.fullName.toLowerCase().includes(query.toLowerCase()) ||
          lawyer.city.toLowerCase().includes(query.toLowerCase()) ||
          lawyer.specialties.some((s) => s.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredLawyers(filtered);
    },
    [lawyers]
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  return {
    lawyers,
    filteredLawyers,
    loading,
    error,
    fetchLawyers,
    searchLawyers,
  };
}
