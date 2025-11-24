'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { FileX } from 'lucide-react';

const CasesEmptyState: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <FileX className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{t('case.noCasesFound')}</h3>
      <p className="text-muted-foreground text-center max-w-md">
        {t('common.noResults')}
      </p>
    </div>
  );
};

export default CasesEmptyState;
