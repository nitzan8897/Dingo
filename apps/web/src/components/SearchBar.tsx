import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterSpecialty?: (specialty: string) => void;
  onFilterCity?: (city: string) => void;
  placeholder?: string;
}

/**
 * SearchBar component - Web implementation
 * Search and filter interface
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilterSpecialty,
  onFilterCity,
  placeholder = 'Search lawyers...',
}) => {
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
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        {onFilterSpecialty && (
          <select
            onChange={(e) => onFilterSpecialty(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
          >
            <option value="">All Specialties</option>
            <option value="CRIMINAL">Criminal Law</option>
            <option value="CIVIL">Civil Law</option>
            <option value="CORPORATE">Corporate Law</option>
            <option value="FAMILY">Family Law</option>
            <option value="LABOR">Labor Law</option>
            <option value="TAX">Tax Law</option>
            <option value="IMMIGRATION">Immigration Law</option>
            <option value="REAL_ESTATE">Real Estate Law</option>
            <option value="INTELLECTUAL_PROPERTY">Intellectual Property</option>
          </select>
        )}

        {onFilterCity && (
          <input
            type="text"
            onChange={(e) => onFilterCity(e.target.value)}
            placeholder="Filter by city..."
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
