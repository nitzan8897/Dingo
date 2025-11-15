import React from 'react';
import FilterTag from './filter-tag';

interface SpecialtyDropdownPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredSpecialties: string[];
  selectedSpecialties: string[];
  onSpecialtyToggle: (specialty: string) => void;
  onClearAll: () => void;
  getSpecialtyLabel: (specialty: string) => string;
  searchPlaceholder: string;
  noResultsText: string;
  clearAllText: string;
}

/**
 * Dropdown panel with search, specialty tags, and clear all button
 */
const SpecialtyDropdownPanel: React.FC<SpecialtyDropdownPanelProps> = ({
  searchQuery,
  onSearchChange,
  filteredSpecialties,
  selectedSpecialties,
  onSpecialtyToggle,
  onClearAll,
  getSpecialtyLabel,
  searchPlaceholder,
  noResultsText,
  clearAllText,
}) => {
  return (
    <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
      {/* Search input */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
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
                label={getSpecialtyLabel(specialty)}
                value={specialty}
                onClick={onSpecialtyToggle}
                selected={selectedSpecialties.includes(specialty)}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{noResultsText}</p>
          )}
        </div>
      </div>

      {/* Clear All button */}
      {selectedSpecialties.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <button
            onClick={onClearAll}
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
            {clearAllText}
          </button>
        </div>
      )}
    </div>
  );
};

export default SpecialtyDropdownPanel;
