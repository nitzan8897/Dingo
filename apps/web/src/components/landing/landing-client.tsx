'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Lawyer, Case } from '@dingo/types';
import { Button } from '@/components/ui/button';
import FloatingLawyerIcons from './floating-lawyer-icons';
import FloatingCaseIcons from './floating-case-icons';

type Mode = 'lawyers' | 'cases';

interface LandingClientProps {
  lawyers: Lawyer[];
  cases: Case[];
  locale: string;
}

/**
 * LandingClient component
 * Client-side landing page with mode switching between lawyers and cases
 * Populates global context with all lawyers and cases for app-wide use
 */
const LandingClient = ({ lawyers, cases, locale }: LandingClientProps): JSX.Element => {
  const t = useTranslations();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('lawyers');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Lawyers and cases are already limited to 5 from server
  // No need to randomize or filter again

  // Switch mode every 10 seconds with fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setMode((prevMode) => (prevMode === 'lawyers' ? 'cases' : 'lawyers'));
        setIsTransitioning(false);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (): void => {
    if (mode === 'lawyers') {
      router.push('/lawyers');
    } else {
      router.push('/cases');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center py-12">
      <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        {t('landing.title')}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        {t('landing.subtitle')}
      </p>

      <Button
        size="lg"
        className="text-lg px-8 py-6 transition-all duration-700 mb-16"
        onClick={handleSearch}
      >
        <span className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {mode === 'lawyers' ? t('landing.searchLawyers') : t('landing.searchCases')}
        </span>
      </Button>

      <div className={`w-full max-w-7xl px-4 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {mode === 'lawyers' ? (
          <FloatingLawyerIcons lawyers={lawyers} locale={locale} />
        ) : (
          <FloatingCaseIcons cases={cases} />
        )}
      </div>
    </div>
  );
};

export default LandingClient;
