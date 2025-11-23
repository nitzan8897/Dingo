'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Case } from '@dingo/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Scale, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CaseCardProps {
  case_: Case;
}

const CaseCard: React.FC<CaseCardProps> = ({ case_ }) => {
  const t = useTranslations();
  const locale = useLocale();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DEFENCE_WON':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'ATTACK_WON':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'settlement':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
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
      month: 'short',
      day: 'numeric',
    });
  };

  const year = case_.closedAt ? new Date(case_.closedAt).getFullYear() : null;

  return (
    <Link href={`/${locale}/cases/${case_.externalId}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200 h-full cursor-pointer">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1">
              {case_.title}
            </h3>
            {year && (
              <Badge variant="outline" className="shrink-0">
                {year}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className={cn('font-medium', getStatusColor(case_.result))}>
              {t(`caseResult.${case_.result}`)}
            </Badge>
            <Badge variant="secondary">
              {t(`specialties.${case_.specialty}`)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {case_.judgeName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Scale className="h-4 w-4 shrink-0" />
              <span className="truncate">{case_.judgeName}</span>
            </div>
          )}

          {(case_.openedAt || case_.closedAt) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>
                {case_.openedAt && formatDate(case_.openedAt)}
                {case_.openedAt && case_.closedAt && ' - '}
                {case_.closedAt && formatDate(case_.closedAt)}
              </span>
            </div>
          )}

          {case_.pdfUrl && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <FileText className="h-4 w-4 shrink-0" />
              <span>{t('case.viewPDF')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CaseCard;
