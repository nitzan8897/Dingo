import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dollarsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dollarSign: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  value: {
    width: 32,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default CostRating;
