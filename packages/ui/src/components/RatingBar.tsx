import React from 'react';

export interface RatingBarProps {
  label: string;
  value: number; // 0-100
  color?: string;
  showValue?: boolean;
}

/**
 * RatingBar component - displays a horizontal rating bar (FIFA-style)
 * Compatible with both React and React Native
 */
export const RatingBar: React.FC<RatingBarProps> = ({
  label,
  value,
  color = '#10b981',
  showValue = true,
}) => {
  const percentage = Math.min(100, Math.max(0, value));

  return {
    label,
    value: percentage,
    color,
    showValue,
    type: 'RatingBar' as const,
  } as any;
};

// Type for the rating bar data
export type RatingBarData = {
  label: string;
  value: number;
  color: string;
  showValue: boolean;
  type: 'RatingBar';
};
