'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LawyerSpecialty } from '@dingo/types';
import FilterTag from './FilterTag';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterSpecialties?: (specialties: string[]) => void;
  onFilterCity?: (city: string) => void;
  selectedSpecialties?: string[];
}

/**
 * SearchBar component - Web implementation
 * Search and filter interface with multi-select specialty filtering
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilterSpecialties,
  onFilterCity,
  selectedSpecialties = [],
}) => {
  const t = useTranslations();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleSpecialtyToggle = (specialty: string) => {
    if (!onFilterSpecialties) return;

    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter((s) => s !== specialty)
      : [...selectedSpecialties, specialty];

    onFilterSpecialties(newSpecialties);
  };

  const handleClearAll = () => {
    if (!onFilterSpecialties) return;
    onFilterSpecialties([]);
  };

  const allSpecialties = Object.values(LawyerSpecialty);

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder={t('search.placeholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {onFilterCity && (
            <input
              type="text"
              onChange={(e) => onFilterCity(e.target.value)}
              placeholder={t('search.filterByCity')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          )}
        </div>

        {onFilterSpecialties && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-base font-semibold text-gray-700">
                {t('search.chooseSpecialties')}
              </label>
              {selectedSpecialties.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {t('search.clearAll')}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allSpecialties.map((specialty) => (
                <FilterTag
                  key={specialty}
                  label={t(`specialties.${specialty}`)}
                  value={specialty}
                  onClick={handleSpecialtyToggle}
                  selected={selectedSpecialties.includes(specialty)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
