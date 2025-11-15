import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { useLawyers } from '@/hooks/use-lawyers';
import LawyerCard from '@/components/lawyer-card';
import { styles } from './index.styles';

export default function Index() {
  const { t, i18n } = useTranslation();
  const { lawyers, loading, fetchLawyers } = useLawyers();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  const filteredLawyers = useMemo(() => {
    if (!searchQuery.trim()) {
      return lawyers;
    }

    return lawyers.filter(
      (lawyer) => {
        // Search in both English and Hebrew names
        const nameMatch =
          lawyer.fullNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lawyer.fullNameHe.toLowerCase().includes(searchQuery.toLowerCase());

        return nameMatch ||
          lawyer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lawyer.specialties.some((s) =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          );
      }
    );
  }, [lawyers, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>🦴 {t('home.title')}</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>{t('home.loadingLawyers')}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredLawyers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <LawyerCard lawyer={item} />}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>{t('home.noLawyersFound')}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
