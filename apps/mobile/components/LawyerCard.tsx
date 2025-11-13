import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lawyer, calculateOverallRating } from '@dingo/types';
import RatingBar from './RatingBar';
import CostRating from './CostRating';

interface LawyerCardProps {
  lawyer: Lawyer;
}

/**
 * LawyerCard component - React Native implementation
 * Displays lawyer information with FIFA-style ratings
 */
const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer }) => {
  const overallRating = Math.round(calculateOverallRating(lawyer.ratingVector));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.name}>{lawyer.fullName}</Text>
          <Text style={styles.city}>{lawyer.city}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.overallRating}>{overallRating}</Text>
          <Text style={styles.overallLabel}>Overall</Text>
        </View>
      </View>

      <View style={styles.specialtiesContainer}>
        {lawyer.specialties.map((specialty) => (
          <View key={specialty} style={styles.specialtyBadge}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.experience}>
        <Text style={styles.experienceBold}>{lawyer.yearsOfExperience}</Text> years of
        experience
      </Text>

      <View style={styles.ratingsContainer}>
        <RatingBar
          label="Professionalism"
          value={lawyer.ratingVector.professionalism}
          color="#10b981"
        />
        <RatingBar
          label="Availability"
          value={lawyer.ratingVector.availability}
          color="#3b82f6"
        />
        <RatingBar label="Empathy" value={lawyer.ratingVector.empathy} color="#8b5cf6" />
        <CostRating
          label="Cost"
          value={lawyer.ratingVector.cost}
          color="#f59e0b"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  city: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  overallRating: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  overallLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  specialtyBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    color: '#047857',
  },
  experience: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  experienceBold: {
    fontWeight: 'bold',
  },
  ratingsContainer: {
    gap: 8,
  },
});

export default LawyerCard;
