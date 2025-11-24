'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Case, Lawyer } from '@dingo/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar, Scale, Download, Eye } from 'lucide-react';
import { InteractiveCaseBadges } from './interactive-case-badges';

interface CaseDetailHeaderProps {
  case_: Case;
  winningSideLawyers: Lawyer[];
}

const CaseDetailHeader: React.FC<CaseDetailHeaderProps> = ({
  case_,
  winningSideLawyers,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const formatDate = (date?: Date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString(locale === 'en' ? 'en-US' : 'he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{case_.title}</h1>
        <InteractiveCaseBadges
          case_={case_}
          winningSideLawyers={winningSideLawyers}
        />
      </div>

      {/* Case Description */}
      {case_.rawText && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3">{t('case.description')}</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {case_.rawText}
            </p>
          </CardContent>
        </Card>
      )}

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
        <div className="flex flex-wrap gap-3">
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="lg" className="gap-2">
                <Eye className="h-5 w-5" />
                {t('case.previewPDF')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>{t('case.pdfPreview')}</DialogTitle>
                <DialogDescription>
                  {case_.title} - {case_.externalId}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 min-h-0">
                <iframe
                  src={case_.pdfUrl}
                  className="w-full h-full rounded-md border"
                  title={t('case.pdfPreview')}
                />
              </div>
            </DialogContent>
          </Dialog>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <a
              href={case_.pdfUrl}
              download={`${case_.externalId}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="h-5 w-5" />
              {t('case.downloadPDF')}
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CaseDetailHeader;
