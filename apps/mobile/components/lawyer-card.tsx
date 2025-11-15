import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Lawyer, calculateOverallRating } from '@dingo/types';
import RatingBar from './rating-bar';
import CostRating from './cost-rating';
import { styles } from './lawyer-card.styles';

interface LawyerCardProps {
  lawyer: Lawyer;
}

/**
 * LawyerCard component - React Native implementation
 * Displays lawyer information with FIFA-style ratings
 * Shows name in current language, defaulting to Hebrew for unsupported locales
 */
const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer }) => {
  const { t, i18n } = useTranslation();
  const overallRating = Math.round(calculateOverallRating(lawyer.ratingVector));

  // Use English only if locale is explicitly 'en', otherwise default to Hebrew
  const displayName = i18n.language === 'en' ? lawyer.fullNameEn : lawyer.fullNameHe;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.city}>{lawyer.city}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.overallRating}>{overallRating}</Text>
          <Text style={styles.overallLabel}>{t('lawyer.overall')}</Text>
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
        <Text style={styles.experienceBold}>{lawyer.yearsOfExperience}</Text>{' '}
        {t('lawyer.yearsOfExperience')}
      </Text>

      <View style={styles.ratingsContainer}>
        <RatingBar
          label={t('ratings.professionalism')}
          value={lawyer.ratingVector.professionalism}
          color="#10b981"
        />
        <RatingBar
          label={t('ratings.availability')}
          value={lawyer.ratingVector.availability}
          color="#3b82f6"
        />
        <RatingBar
          label={t('ratings.empathy')}
          value={lawyer.ratingVector.empathy}
          color="#8b5cf6"
        />
        <CostRating
          label={t('ratings.cost')}
          value={lawyer.ratingVector.cost}
          color="#f59e0b"
        />
      </View>
    </View>
  );
};

export default LawyerCard;
