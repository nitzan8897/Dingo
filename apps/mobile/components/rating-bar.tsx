import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './rating-bar.styles';

interface RatingBarProps {
  label: string;
  value: number; // 0-100
  color?: string;
  showValue?: boolean;
}

/**
 * RatingBar component - React Native implementation
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
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              {
                width: `${percentage}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        {showValue && <Text style={[styles.value, { color }]}>{percentage}</Text>}
      </View>
    </View>
  );
};

export default RatingBar;
