'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCases } from '@/contexts/cases-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CaseCard from '@/components/case/case-card';
import { ArrowRight } from 'lucide-react';

interface RecentCasesSectionProps {
  locale: string;
}

/**
 * Client Component - Recent Cases Section
 * Uses cases context to show 3 most recent cases
 * No fetching needed - reads from global context
 */
const RecentCasesSection = ({ locale }: RecentCasesSectionProps) => {
  const t = useTranslations();
  const { cases } = useCases();

  const recentCases = cases.slice(0, 3);

  if (recentCases.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">{t('lawyers.recentCases')}</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/cases`} className="gap-2">
              {t('lawyers.viewAllCases')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentCases.map((case_) => (
              <CaseCard key={case_.id} case_={case_} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentCasesSection;
