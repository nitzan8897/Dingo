'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Lawyer } from '@dingo/types';
import { Card, CardContent } from '@/components/ui/card';
import LawyerCardHeader from './lawyer-card-header';
import LawyerCardRatings from './lawyer-card-ratings';
import SpecialtyTag from './specialty-tag';

interface LawyerCardProps {
  lawyer: Lawyer;
  onSpecialtyClick?: (specialty: string) => void;
}

/**
 * LawyerCard component - Web implementation
 * Displays lawyer information with FIFA-style ratings
 * Now using shadcn/ui Card component
 * Clickable - navigates to lawyer profile page
 */
const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer, onSpecialtyClick }) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Link href={`/${locale}/lawyers/${lawyer.id}`}>
      <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer">
        <CardContent className="p-6">
          <LawyerCardHeader
            fullNameEn={lawyer.fullNameEn}
            fullNameHe={lawyer.fullNameHe}
            cityNameEn={lawyer.city.nameEn}
            cityNameHe={lawyer.city.nameHe}
          />

          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {lawyer.specialties.map((specialty) => (
                <SpecialtyTag
                  key={specialty}
                  specialty={t(`specialties.${specialty}`)}
                  onClick={onSpecialtyClick ? () => onSpecialtyClick(specialty) : undefined}
                />
              ))}
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold">{lawyer.yearsOfExperience}</span>{' '}
            {t('lawyer.yearsOfExperience')}
          </div>

          <LawyerCardRatings
            ratings={lawyer.ratingVector}
            labels={{
              professionalism: t('ratings.professionalism'),
              availability: t('ratings.availability'),
              empathy: t('ratings.empathy'),
              cost: t('ratings.cost'),
            }}
          />
        </CardContent>
      </Card>
    </Link>
  );
};

export default LawyerCard;
