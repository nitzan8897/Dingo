'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Lawyer } from '@dingo/types';
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
 */
const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer, onSpecialtyClick }) => {
  const t = useTranslations();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
      <LawyerCardHeader fullName={lawyer.fullName} city={lawyer.city} />

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
    </div>
  );
};

export default LawyerCard;
