'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LawyerSpecialty } from '@dingo/types';
import FilterTag from './filter-tag';

interface SpecialtyDropdownProps {
  selectedSpecialties: string[];
  onSpecialtiesChange: (specialties: string[]) => void;
}

/**
 * SpecialtyDropdown component
 * A searchable dropdown with multi-select specialty filtering using FilterTags
 */
const SpecialtyDropdown: React.FC<SpecialtyDropdownProps> = ({
  selectedSpecialties,
  onSpecialtiesChange,
}) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allSpecialties = Object.values(LawyerSpecialty);

  // Filter specialties based on search query
  const filteredSpecialties = allSpecialties.filter((specialty) =>
    t(`specialties.${specialty}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSpecialtyToggle = (specialty: string) => {
    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter((s) => s !== specialty)
      : [...selectedSpecialties, specialty];

    onSpecialtiesChange(newSpecialties);
  };

  const handleClearAll = () => {
    onSpecialtiesChange([]);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-left flex items-center justify-between transition-colors"
      >
        <span className="text-gray-700 dark:text-gray-200">
          {selectedSpecialties.length > 0
            ? `${selectedSpecialties.length} ${t('search.specialties')}`
            : t('search.chooseSpecialties')}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {/* Search input */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.searchSpecialties')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Filter tags */}
          <div className="p-3 max-h-64 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {filteredSpecialties.length > 0 ? (
                filteredSpecialties.map((specialty) => (
                  <FilterTag
                    key={specialty}
                    label={t(`specialties.${specialty}`)}
                    value={specialty}
                    onClick={handleSpecialtyToggle}
                    selected={selectedSpecialties.includes(specialty)}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.noResults')}</p>
              )}
            </div>
          </div>

          {/* Clear All button at bottom left */}
          {selectedSpecialties.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {t('search.clearAll')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpecialtyDropdown;
