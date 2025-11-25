'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import SpecialtyDropdown from './specialty-dropdown';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterSpecialties?: (specialties: string[]) => void;
  onFilterCity?: (city: string) => void;
  selectedSpecialties?: string[];
  availableSpecialties?: string[];
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
  availableSpecialties,
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
          <Input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder={t('search.placeholder')}
            className="w-full px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {onFilterSpecialties && (
          <div className="md:w-64">
            <SpecialtyDropdown
              selectedSpecialties={selectedSpecialties}
              onSpecialtiesChange={handleSpecialtiesChange}
              availableSpecialties={availableSpecialties}
            />
          </div>
        )}

        {onFilterCity && (
          <div className="flex-1 md:flex-initial md:w-48">
            <Input
              type="text"
              onChange={(e) => onFilterCity(e.target.value)}
              placeholder={t('search.filterByCity')}
              className="w-full px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
