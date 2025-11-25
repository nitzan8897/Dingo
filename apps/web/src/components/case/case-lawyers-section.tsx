'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedField } from '@dingo/i18n';
import { Lawyer } from '@dingo/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { DataPagination } from '@/components/ui/data-pagination';

interface CaseLawyersSectionProps {
  plaintiffLawyers: Lawyer[];
  defendantLawyers: Lawyer[];
  associatedLawyers: Lawyer[];
}

const CaseLawyersSection: React.FC<CaseLawyersSectionProps> = ({
  plaintiffLawyers,
  defendantLawyers,
  associatedLawyers,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const LawyerCard = ({ lawyer, type }: { lawyer: Lawyer; type: string }) => {
    const displayName = getLocalizedField(lawyer, 'fullName', locale);
    const city = getLocalizedField(lawyer.city, 'name', locale);

    return (
      <Link href={`/${locale}/lawyers/${lawyer.id}`}>
        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{displayName}</p>
                <p className="text-sm text-muted-foreground truncate">{city}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const hasLawyers =
    plaintiffLawyers.length > 0 ||
    defendantLawyers.length > 0 ||
    associatedLawyers.length > 0;

  if (!hasLawyers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('case.associatedLawyers')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {t('case.noLawyersAssociated')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {plaintiffLawyers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              {t('case.plaintiffLawyers')}
            </h2>
            <Badge variant="secondary">{plaintiffLawyers.length}</Badge>
          </div>
          <DataPagination
            data={plaintiffLawyers}
            itemsPerPage={3}
            renderItems={(items) => (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((lawyer) => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} type="plaintiff" />
                ))}
              </div>
            )}
          />
        </div>
      )}

      {defendantLawyers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              {t('case.defendantLawyers')}
            </h2>
            <Badge variant="secondary">{defendantLawyers.length}</Badge>
          </div>
          <DataPagination
            data={defendantLawyers}
            itemsPerPage={3}
            renderItems={(items) => (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((lawyer) => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} type="defendant" />
                ))}
              </div>
            )}
          />
        </div>
      )}

      {associatedLawyers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              {t('case.associatedLawyers')}
            </h2>
            <Badge variant="secondary">{associatedLawyers.length}</Badge>
          </div>
          <DataPagination
            data={associatedLawyers}
            itemsPerPage={3}
            renderItems={(items) => (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((lawyer) => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} type="associated" />
                ))}
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default CaseLawyersSection;
