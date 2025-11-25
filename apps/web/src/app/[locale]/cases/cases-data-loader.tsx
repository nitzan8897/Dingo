'use client';

import { useEffect } from 'react';
import { Lawyer, Case } from '@dingo/types';
import { useLawyers } from '@/contexts/lawyers-context';
import { useCases } from '@/contexts/cases-context';

interface CasesDataLoaderProps {
  lawyers: Lawyer[];
  cases: Case[];
}

/**
 * Client component that loads data into global contexts
 * Always uses server-provided data to ensure fresh data on language switch
 * Used to populate contexts when navigating directly to cases page
 * or when switching languages
 */
const CasesDataLoader = ({ lawyers, cases }: CasesDataLoaderProps) => {
  const { setLawyers } = useLawyers();
  const { setCases } = useCases();

  useEffect(() => {
    // Always update context with server-provided data
    // SessionStorage will handle persistence across language switches
    setLawyers(lawyers);
    setCases(cases);
  }, [lawyers, cases, setLawyers, setCases]);

  return null;
};

export default CasesDataLoader;
