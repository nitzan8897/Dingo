'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Case } from '@dingo/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Scale, FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CaseDetailHeaderProps {
  case_: Case;
}

const CaseDetailHeader: React.FC<CaseDetailHeaderProps> = ({ case_ }) => {
  const t = useTranslations();
  const locale = useLocale();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'win':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'lose':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'settlement':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString(locale === 'en' ? 'en-US' : 'he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const year = case_.closedAt ? new Date(case_.closedAt).getFullYear() : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{case_.title}</h1>
        <div className="flex flex-wrap gap-3">
          <Badge className={cn('text-sm px-3 py-1', getStatusColor(case_.result))}>
            {t(`caseResult.${case_.result}`)}
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {t(`specialties.${case_.specialty}`)}
          </Badge>
          {year && (
            <Badge variant="outline" className="text-sm px-3 py-1">
              {year}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {case_.judgeName && (
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t('case.judge')}
              </p>
              <p className="text-base">{case_.judgeName}</p>
            </div>
          </div>
        )}

        {(case_.openedAt || case_.closedAt) && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {case_.openedAt && t('case.openedDate')}
                {case_.openedAt && case_.closedAt && ' / '}
                {case_.closedAt && t('case.closedDate')}
              </p>
              <p className="text-base">
                {case_.openedAt && formatDate(case_.openedAt)}
                {case_.openedAt && case_.closedAt && ' - '}
                {case_.closedAt && formatDate(case_.closedAt)}
              </p>
            </div>
          </div>
        )}
      </div>

      {case_.pdfUrl && (
        <div>
          <Button
            asChild
            variant="default"
            size="lg"
            className="gap-2"
          >
            <a href={case_.pdfUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="h-5 w-5" />
              {t('case.viewPDF')}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CaseDetailHeader;
