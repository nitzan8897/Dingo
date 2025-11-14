'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LawyerSpecialty } from '@dingo/types';
import FilterTag from './FilterTag';

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
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white text-left flex items-center justify-between"
      >
        <span className="text-gray-700">
          {selectedSpecialties.length > 0
            ? `${selectedSpecialties.length} ${t('search.specialties')}`
            : t('search.chooseSpecialties')}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* Search input */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Header with Clear All */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-700">
              {t('search.chooseSpecialties')}
            </span>
            {selectedSpecialties.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-sm text-gray-500">{t('common.noResults')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialtyDropdown;
