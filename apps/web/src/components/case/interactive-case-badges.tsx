'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Case, Lawyer } from '@dingo/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface InteractiveCaseBadgesProps {
  case_: Case;
  winningSideLawyers: Lawyer[];
  className?: string;
}

export const InteractiveCaseBadges: React.FC<InteractiveCaseBadgesProps> = ({
  case_,
  winningSideLawyers,
  className,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [showSpecialtyDialog, setShowSpecialtyDialog] = useState(false);

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
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCaseIdCopy = async () => {
    try {
      await navigator.clipboard.writeText(case_.externalId);
      toast.success(t('case.copiedSuccessfully'));
    } catch (error) {
      toast.error(t('case.copyFailed'));
    }
  };

  const handleSpecialtyClick = () => {
    setShowSpecialtyDialog(true);
  };

  const handleSpecialtyConfirm = () => {
    router.push(`/${locale}/cases?specialty=${case_.specialty}`);
    setShowSpecialtyDialog(false);
  };

  const getResultDescription = () => {
    if (case_.result === 'DEFENCE_WON') {
      return t('case.defenseSuccessful');
    } else if (case_.result === 'ATTACK_WON') {
      return t('case.claimSuccessful');
    } else if (case_.result === 'settlement') {
      return t('case.settlementReached');
    } else if (case_.result === 'dismissed') {
      return t('case.caseDismissed');
    }
    return t(`caseResult.${case_.result}`);
  };

  const getYearTooltipContent = () => {
    const opened = case_.openedAt ? formatDate(case_.openedAt) : null;
    const closed = case_.closedAt ? formatDate(case_.closedAt) : null;

    if (opened && closed) {
      return (
        <div className="space-y-1">
          <p>
            <strong>{t('case.openedDate')}:</strong> {opened}
          </p>
          <p>
            <strong>{t('case.closedDate')}:</strong> {closed}
          </p>
        </div>
      );
    } else if (opened) {
      return (
        <p>
          <strong>{t('case.openedDate')}:</strong> {opened}
        </p>
      );
    }
    return null;
  };

  const year = case_.closedAt ? new Date(case_.closedAt).getFullYear() : null;

  return (
    <>
      <TooltipProvider>
        <div className={cn('flex flex-wrap gap-3', className)}>
          {/* Case ID Badge */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="font-mono text-sm px-3 py-1 cursor-pointer hover:bg-accent transition-colors"
                onClick={handleCaseIdCopy}
              >
                {case_.externalId}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('case.caseIdTooltip')}</p>
            </TooltipContent>
          </Tooltip>

          {/* Case Status Badge */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className={cn('text-sm px-3 py-1', getStatusColor(case_.result))}>
                {t(`caseResult.${case_.result}`)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-2">
                <p className="font-semibold">{getResultDescription()}</p>
                {winningSideLawyers.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm">
                      {case_.result === 'DEFENCE_WON'
                        ? t('case.representedBy')
                        : case_.result === 'ATTACK_WON'
                        ? t('case.representedBy')
                        : t('case.involvedLawyers')}
                      :
                    </p>
                    <div className="flex flex-col gap-1">
                      {winningSideLawyers.map((lawyer) => (
                        <Link
                          key={lawyer.id}
                          href={`/${locale}/lawyers/${lawyer.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {locale === 'en' ? lawyer.fullNameEn : lawyer.fullNameHe}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Specialty Badge */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className="text-sm px-3 py-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={handleSpecialtyClick}
              >
                {t(`specialties.${case_.specialty}`)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('case.filterBySpecialtyTooltip')}</p>
            </TooltipContent>
          </Tooltip>

          {/* Year Badge */}
          {year && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {year}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{getYearTooltipContent()}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>

      {/* Specialty Filter Confirmation Dialog */}
      <AlertDialog open={showSpecialtyDialog} onOpenChange={setShowSpecialtyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('case.filterConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('case.filterConfirmDescription', {
                specialty: t(`specialties.${case_.specialty}`),
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSpecialtyConfirm}>
              {t('common.continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
