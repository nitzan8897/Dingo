import React from 'react';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterSpecialty?: (specialty: string) => void;
  onFilterCity?: (city: string) => void;
  placeholder?: string;
}

/**
 * SearchBar component - search and filter interface
 * Returns structured data for platform-specific rendering
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilterSpecialty,
  onFilterCity,
  placeholder = 'Search lawyers...',
}) => {
  return {
    onSearch,
    onFilterSpecialty,
    onFilterCity,
    placeholder,
    type: 'SearchBar' as const,
  } as any;
};

// Type for the search bar data
export type SearchBarData = {
  onSearch: (query: string) => void;
  onFilterSpecialty?: (specialty: string) => void;
  onFilterCity?: (city: string) => void;
  placeholder: string;
  type: 'SearchBar';
};
