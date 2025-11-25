'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Case } from '@dingo/types';

interface CasesContextType {
  cases: Case[];
  isLoading: boolean;
  setCases: (cases: Case[]) => void;
  addCases: (newCases: Case[]) => void;
  setLoading: (loading: boolean) => void;
  getCaseByExternalId: (externalId: string) => Case | undefined;
}

const CasesContext = createContext<CasesContextType | undefined>(undefined);

// Storage key for persisting cases across language switches
const STORAGE_KEY = 'dingo_cases_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  cases: Case[];
  timestamp: number;
}

/**
 * CasesProvider - Smart context with progressive loading
 * Persists data across language switches using sessionStorage
 */
export const CasesProvider = ({ children }: { children: ReactNode }) => {
  const [cases, setCases] = useState<Case[]>(() => {
    // Initialize from sessionStorage if available and not expired
    if (typeof window === 'undefined') return [];

    try {
      const cached = sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const { cases: cachedCases, timestamp }: CachedData = JSON.parse(cached);
        const age = Date.now() - timestamp;

        // Return cached data if less than 5 minutes old
        if (age < CACHE_DURATION && cachedCases.length > 0) {
          return cachedCases;
        }
      }
    } catch (error) {
      // Ignore errors, just start fresh
      console.warn('Failed to load cached cases:', error);
    }

    return [];
  });
  const [isLoading, setLoading] = useState(false);

  // Persist to sessionStorage whenever cases change
  useEffect(() => {
    if (typeof window === 'undefined' || cases.length === 0) return;

    try {
      const cacheData: CachedData = {
        cases,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      // Ignore quota errors or other storage issues
      console.warn('Failed to cache cases:', error);
    }
  }, [cases]);

  // Add cases progressively (for streaming/chunked responses)
  const addCases = useCallback((newCases: Case[]) => {
    setCases((prev) => {
      const existingIds = new Set(prev.map((c) => c.id));
      const uniqueNew = newCases.filter((c) => !existingIds.has(c.id));
      return [...prev, ...uniqueNew];
    });
  }, []);

  // Get case by external ID from context (no fetch needed)
  const getCaseByExternalId = useCallback(
    (externalId: string) => cases.find((c) => c.externalId === externalId),
    [cases]
  );

  return (
    <CasesContext.Provider
      value={{ cases, isLoading, setCases, addCases, setLoading, getCaseByExternalId }}
    >
      {children}
    </CasesContext.Provider>
  );
};

export const useCases = () => {
  const context = useContext(CasesContext);
  if (context === undefined) {
    throw new Error('useCases must be used within a CasesProvider');
  }
  return context;
};
