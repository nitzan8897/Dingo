import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface FilterTagProps {
  label: string;
  onClick: (value: string) => void;
  selected?: boolean;
  value: string;
}

/**
 * FilterTag component
 * Displays a larger, clickable filter tag for the search bar with X button when selected
 * Now using shadcn/ui Badge component with custom emerald styling
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
    <Badge
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors font-medium cursor-pointer hover:opacity-80',
        selected
          ? 'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-600 dark:hover:bg-emerald-500'
          : 'bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
      )}
    >
      {label}
      {selected && (
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-700 bg-opacity-30">
          <X className="w-2.5 h-2.5 text-emerald-100" strokeWidth={3} />
        </span>
      )}
    </Badge>
  );
};

export default FilterTag;
