'use client';

import { Case, CaseOutcome } from '@dingo/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface CaseCardProps {
  case_: Case;
  locale: string;
}

/**
 * CaseCard component
 * Displays individual case information with bilingual support
 */
const CaseCard = ({ case_, locale }: CaseCardProps): JSX.Element => {
  const t = useTranslations();

  const title = locale === 'en' ? case_.titleEn : case_.titleHe;
  const description = locale === 'en' ? case_.descriptionEn : case_.descriptionHe;

  const getOutcomeColor = (outcome: CaseOutcome): string => {
    switch (outcome) {
      case 'WON':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'LOST':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'SETTLED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ONGOING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="flex gap-2 items-center">
            <Badge variant="outline" className="text-sm">
              {case_.year}
            </Badge>
            <Badge className={getOutcomeColor(case_.outcome)}>
              {t(`caseOutcome.${case_.outcome}`)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default CaseCard;
