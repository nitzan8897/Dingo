'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Lawyer } from '@dingo/types';

interface LawyersContextType {
  lawyers: Lawyer[];
  isLoading: boolean;
  setLawyers: (lawyers: Lawyer[]) => void;
  addLawyers: (newLawyers: Lawyer[]) => void;
  setLoading: (loading: boolean) => void;
  getLawyerById: (id: string) => Lawyer | undefined;
}

const LawyersContext = createContext<LawyersContextType | undefined>(undefined);

/**
 * LawyersProvider - Smart context with progressive loading
 * Shows data as soon as it arrives, even if fetch isn't complete
 */
export const LawyersProvider = ({ children }: { children: ReactNode }) => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setLoading] = useState(false);

  // Add lawyers progressively (for streaming/chunked responses)
  const addLawyers = useCallback((newLawyers: Lawyer[]) => {
    setLawyers((prev) => {
      const existingIds = new Set(prev.map((l) => l.id));
      const uniqueNew = newLawyers.filter((l) => !existingIds.has(l.id));
      return [...prev, ...uniqueNew];
    });
  }, []);

  // Get lawyer by ID from context (no fetch needed)
  const getLawyerById = useCallback(
    (id: string) => lawyers.find((lawyer) => lawyer.id === id),
    [lawyers]
  );

  return (
    <LawyersContext.Provider
      value={{ lawyers, isLoading, setLawyers, addLawyers, setLoading, getLawyerById }}
    >
      {children}
    </LawyersContext.Provider>
  );
};

export const useLawyers = () => {
  const context = useContext(LawyersContext);
  if (context === undefined) {
    throw new Error('useLawyers must be used within a LawyersProvider');
  }
  return context;
};
