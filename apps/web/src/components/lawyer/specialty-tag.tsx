import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SpecialtyTagProps {
  specialty: string;
  onClick?: (specialty: string) => void;
  selected?: boolean;
}

/**
 * SpecialtyTag component
 * Displays a small specialty badge with optional click handler
 * Used on lawyer cards
 * Now using shadcn/ui Badge component with custom emerald/primary styling
 */
const SpecialtyTag: React.FC<SpecialtyTagProps> = ({
  specialty,
  onClick,
  selected = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick(specialty);
    }
  };

  return (
    <Badge
      onClick={handleClick}
      className={cn(
        'px-2 py-1 text-xs rounded-full transition-colors',
        onClick && 'cursor-pointer hover:opacity-80',
        selected
          ? 'bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-600 dark:hover:bg-primary-500'
          : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
      )}
    >
      {specialty}
    </Badge>
  );
};

export default SpecialtyTag;
