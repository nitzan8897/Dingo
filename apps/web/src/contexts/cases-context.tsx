'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Case } from '@dingo/types';

interface CasesContextType {
  cases: Case[];
  setCases: (cases: Case[]) => void;
}

const CasesContext = createContext<CasesContextType | undefined>(undefined);

export const CasesProvider = ({ children }: { children: ReactNode }) => {
  const [cases, setCases] = useState<Case[]>([]);

  return (
    <CasesContext.Provider value={{ cases, setCases }}>
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
