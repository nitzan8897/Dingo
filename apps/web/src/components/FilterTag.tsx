import React from 'react';

interface FilterTagProps {
  label: string;
  onClick: (value: string) => void;
  selected?: boolean;
  value: string;
}

/**
 * FilterTag component
 * Displays a larger, clickable filter tag for the search bar
 */
const FilterTag: React.FC<FilterTagProps> = ({
  label,
  onClick,
  selected = false,
  value,
}) => {
  const handleClick = () => {
    onClick(value);
  };

  return (
    <span
      onClick={handleClick}
      className={`px-3 py-1.5 text-sm rounded-full transition-colors font-medium cursor-pointer hover:opacity-80 ${
        selected
          ? 'bg-emerald-600 text-white'
          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      }`}
    >
      {label}
    </span>
  );
};

export default FilterTag;
