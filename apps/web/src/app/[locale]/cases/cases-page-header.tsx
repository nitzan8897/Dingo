'use client';

import { useTranslations } from 'next-intl';
import { useCases } from '@/contexts/cases-context';

/**
 * Client Component - Cases Page Header
 * Uses cases context to show dynamic count
 * No fetching needed - reads from global context
 */
const CasesPageHeader = () => {
  const t = useTranslations();
  const { cases } = useCases();

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2">{t('case.title')}</h1>
      <p className="text-muted-foreground">
        {t('case.allCases')} ({cases.length})
      </p>
    </div>
  );
};

export default CasesPageHeader;
