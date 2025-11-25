'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
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

/**
 * CasesProvider - Smart context with progressive loading
 * Shows data as soon as it arrives, even if fetch isn't complete
 */
export const CasesProvider = ({ children }: { children: ReactNode }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setLoading] = useState(false);

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
