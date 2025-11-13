'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterSpecialty?: (specialty: string) => void;
  onFilterCity?: (city: string) => void;
}

/**
 * SearchBar component - Web implementation
 * Search and filter interface
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilterSpecialty,
  onFilterCity,
}) => {
  const t = useTranslations();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        {onFilterSpecialty && (
          <select
            onChange={(e) => onFilterSpecialty(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
          >
            <option value="">{t('search.allSpecialties')}</option>
            <option value="CRIMINAL">{t('specialties.CRIMINAL')}</option>
            <option value="CIVIL">{t('specialties.CIVIL')}</option>
            <option value="CORPORATE">{t('specialties.CORPORATE')}</option>
            <option value="FAMILY">{t('specialties.FAMILY')}</option>
            <option value="LABOR">{t('specialties.LABOR')}</option>
            <option value="TAX">{t('specialties.TAX')}</option>
            <option value="IMMIGRATION">{t('specialties.IMMIGRATION')}</option>
            <option value="REAL_ESTATE">{t('specialties.REAL_ESTATE')}</option>
            <option value="INTELLECTUAL_PROPERTY">{t('specialties.INTELLECTUAL_PROPERTY')}</option>
          </select>
        )}

        {onFilterCity && (
          <input
            type="text"
            onChange={(e) => onFilterCity(e.target.value)}
            placeholder={t('search.filterByCity')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
