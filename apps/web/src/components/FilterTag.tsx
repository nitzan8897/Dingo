import React from 'react';

interface FilterTagProps {
  label: string;
  onClick: (value: string) => void;
  selected?: boolean;
  value: string;
}

/**
 * FilterTag component
 * Displays a larger, clickable filter tag for the search bar with X button when selected
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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors font-medium cursor-pointer hover:opacity-80 ${
        selected
          ? 'bg-emerald-600 text-white'
          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      }`}
    >
      {label}
      {selected && (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </span>
  );
};

export default FilterTag;
