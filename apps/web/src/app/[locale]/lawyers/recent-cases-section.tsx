'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Case } from '@dingo/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CaseCard from '@/components/case/case-card';
import { ArrowRight } from 'lucide-react';

interface RecentCasesSectionProps {
  locale: string;
  cases: Case[];
}

/**
 * Client Component - Recent Cases Section
 * Shows 3 most recent cases sorted by date
 * Receives cases as props from Server Component
 */
const RecentCasesSection = ({ locale, cases }: RecentCasesSectionProps) => {
  const t = useTranslations();

  // Sort by createdAt descending and take 3
  const recentCases = [...cases]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

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
