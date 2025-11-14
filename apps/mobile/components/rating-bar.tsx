import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  barBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  value: {
    width: 32,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default RatingBar;
