import React from 'react';

interface CostRatingProps {
  label: string;
  value: number; // 0-100
  color?: string;
  showValue?: boolean;
}

/**
 * CostRating component - Web implementation
 * Displays cost rating as dollar signs (5-point scale)
 */
const CostRating: React.FC<CostRatingProps> = ({
  label,
  value,
  color = '#f59e0b',
  showValue = true,
}) => {
  const percentage = Math.min(100, Math.max(0, value));

  // Calculate number of dollar signs (out of 5)
  const dollarCount = Math.round((percentage / 100) * 5);

  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-sm text-gray-700 font-medium">{label}</div>
      <div className="flex-1 flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className="text-2xl transition-colors duration-300"
            style={{ color: index < dollarCount ? color : '#d1d5db' }}
          >
            $
          </span>
        ))}
      </div>
      {showValue && (
        <div className="w-12 text-right text-sm font-bold" style={{ color }}>
          {percentage}
        </div>
      )}
    </div>
  );
};

export default CostRating;
