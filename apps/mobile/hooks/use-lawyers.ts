import { useState, useCallback } from 'react';
import { Lawyer } from '@dingo/types';
import { lawyerService } from '@/services/lawyer-service';

interface FetchLawyersParams {
  specialties?: string[];
  city?: string;
}

interface UseLawyersReturn {
  lawyers: Lawyer[];
  loading: boolean;
  error: Error | null;
  fetchLawyers: (params?: FetchLawyersParams) => Promise<void>;
}

export const useLawyers = (): UseLawyersReturn => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLawyers = useCallback(async (params?: FetchLawyersParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await lawyerService.fetchLawyers(params);
      setLawyers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch'));
    } finally {
      setLoading(false);
    }
  }, []);

  return { lawyers, loading, error, fetchLawyers };
};
