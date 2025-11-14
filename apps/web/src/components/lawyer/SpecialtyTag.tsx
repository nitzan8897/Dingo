import React from 'react';

interface SpecialtyTagProps {
  specialty: string;
  onClick?: (specialty: string) => void;
  selected?: boolean;
}

/**
 * SpecialtyTag component
 * Displays a small specialty badge with optional click handler
 * Used on lawyer cards
 */
const SpecialtyTag: React.FC<SpecialtyTagProps> = ({
  specialty,
  onClick,
  selected = false,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(specialty);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`px-2 py-1 text-xs rounded-full transition-colors ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      } ${
        selected
          ? 'bg-primary-600 text-white'
          : 'bg-primary-100 text-primary-700'
      }`}
    >
      {specialty}
    </span>
  );
};

export default SpecialtyTag;
