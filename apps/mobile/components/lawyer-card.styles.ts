import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
