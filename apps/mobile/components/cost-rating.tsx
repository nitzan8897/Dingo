import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './cost-rating.styles';

interface CostRatingProps {
  label: string;
  value: number; // 0-100
  color?: string;
  showValue?: boolean;
}

/**
 * CostRating component - React Native implementation
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
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barContainer}>
        <View style={styles.dollarsContainer}>
          {[...Array(5)].map((_, index) => (
            <Text
              key={index}
              style={[
                styles.dollarSign,
                { color: index < dollarCount ? color : '#d1d5db' },
              ]}
            >
              $
            </Text>
          ))}
        </View>
        {showValue && <Text style={[styles.value, { color }]}>{percentage}</Text>}
      </View>
    </View>
  );
};

export default CostRating;
