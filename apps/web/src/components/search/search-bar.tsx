'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import SpecialtyDropdown from './specialty-dropdown';

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

  const handleSpecialtiesChange = (specialties: string[]) => {
    if (onFilterSpecialties) {
      onFilterSpecialties(specialties);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder={t('search.placeholder')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {onFilterSpecialties && (
          <div className="md:w-64">
            <SpecialtyDropdown
              selectedSpecialties={selectedSpecialties}
              onSpecialtiesChange={handleSpecialtiesChange}
            />
          </div>
        )}

        {onFilterCity && (
          <input
            type="text"
            onChange={(e) => onFilterCity(e.target.value)}
            placeholder={t('search.filterByCity')}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500"
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
