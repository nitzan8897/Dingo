import React from 'react';

interface RatingBarProps {
  label: string;
  value: number; // 0-100
  color?: string;
  showValue?: boolean;
}

/**
 * RatingBar component - Web implementation
 * Displays a horizontal rating bar (FIFA-style)
 */
const RatingBar: React.FC<RatingBarProps> = ({
  label,
  value,
  color = '#10b981',
  showValue = true,
}) => {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-sm text-gray-700 dark:text-gray-200 font-medium">{label}</div>
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showValue && (
        <div className="w-12 text-right text-sm font-bold" style={{ color }}>
          {percentage}
        </div>
      )}
    </div>
  );
};

export default RatingBar;
