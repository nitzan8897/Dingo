import React from 'react';
import { useLocale } from 'next-intl';

interface LawyerCardHeaderProps {
  fullNameEn: string;
  fullNameHe: string;
  city: string;
}

/**
 * Lawyer card header with name and city
 * Displays lawyer name in the appropriate language based on current locale
 * Defaults to Hebrew for unsupported locales (e.g., Russian, French, etc.)
 */
const LawyerCardHeader: React.FC<LawyerCardHeaderProps> = ({
  fullNameEn,
  fullNameHe,
  city
}) => {
  const locale = useLocale();

  // Use English only if locale is explicitly 'en', otherwise default to Hebrew
  // This ensures unsupported locales (Russian, French, etc.) show Hebrew names
  const displayName = locale === 'en' ? fullNameEn : fullNameHe;

  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{displayName}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{city}</p>
      </div>
    </div>
  );
};

export default LawyerCardHeader;
