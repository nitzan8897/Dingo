'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Lawyer } from '@dingo/types';

interface LawyersContextType {
  lawyers: Lawyer[];
  setLawyers: (lawyers: Lawyer[]) => void;
}

const LawyersContext = createContext<LawyersContextType | undefined>(undefined);

export const LawyersProvider = ({ children }: { children: ReactNode }) => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);

  return (
    <LawyersContext.Provider value={{ lawyers, setLawyers }}>
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
