'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LawyerSpecialty } from '@dingo/types';
import SpecialtyDropdownButton from './specialty-dropdown-button';
import SpecialtyDropdownPanel from './specialty-dropdown-panel';

interface SpecialtyDropdownProps {
  selectedSpecialties: string[];
  onSpecialtiesChange: (specialties: string[]) => void;
}

/**
 * SpecialtyDropdown component
 * A searchable dropdown with multi-select specialty filtering
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

  const filteredSpecialties = allSpecialties.filter((specialty) =>
    t(`specialties.${specialty}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSpecialtyToggle = (specialty: string): void => {
    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter((s) => s !== specialty)
      : [...selectedSpecialties, specialty];

    onSpecialtiesChange(newSpecialties);
  };

  const handleClearAll = (): void => {
    onSpecialtiesChange([]);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <SpecialtyDropdownButton
        isOpen={isOpen}
        selectedCount={selectedSpecialties.length}
        onClick={() => setIsOpen(!isOpen)}
        chooseText={t('search.chooseSpecialties')}
        specialtiesText={t('search.specialties')}
      />

      {isOpen && (
        <SpecialtyDropdownPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredSpecialties={filteredSpecialties}
          selectedSpecialties={selectedSpecialties}
          onSpecialtyToggle={handleSpecialtyToggle}
          onClearAll={handleClearAll}
          getSpecialtyLabel={(specialty) => t(`specialties.${specialty}`)}
          searchPlaceholder={t('search.searchSpecialties')}
          noResultsText={t('common.noResults')}
          clearAllText={t('search.clearAll')}
        />
      )}
    </div>
  );
};

export default SpecialtyDropdown;
