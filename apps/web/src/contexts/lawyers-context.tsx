'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
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

// Storage key for persisting lawyers across language switches
const STORAGE_KEY = 'dingo_lawyers_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  lawyers: Lawyer[];
  timestamp: number;
}

/**
 * LawyersProvider - Smart context with progressive loading
 * Persists data across language switches using sessionStorage
 */
export const LawyersProvider = ({ children }: { children: ReactNode }) => {
  const [lawyers, setLawyers] = useState<Lawyer[]>(() => {
    // Initialize from sessionStorage if available and not expired
    if (typeof window === 'undefined') return [];

    try {
      const cached = sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const { lawyers: cachedLawyers, timestamp }: CachedData = JSON.parse(cached);
        const age = Date.now() - timestamp;

        // Return cached data if less than 5 minutes old
        if (age < CACHE_DURATION && cachedLawyers.length > 0) {
          return cachedLawyers;
        }
      }
    } catch (error) {
      // Ignore errors, just start fresh
      console.warn('Failed to load cached lawyers:', error);
    }

    return [];
  });
  const [isLoading, setLoading] = useState(false);

  // Persist to sessionStorage whenever lawyers change
  useEffect(() => {
    if (typeof window === 'undefined' || lawyers.length === 0) return;

    try {
      const cacheData: CachedData = {
        lawyers,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      // Ignore quota errors or other storage issues
      console.warn('Failed to cache lawyers:', error);
    }
  }, [lawyers]);

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
