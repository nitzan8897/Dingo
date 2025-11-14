'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Lawyer } from '@dingo/types';
import SearchBar from '@/components/search/search-bar';
import EmptyState from '@/components/home/empty-state';
import LawyersGrid from '@/components/home/lawyers-grid';
import { useSpecialtyFilter } from '@/hooks/use-specialty-filter';
import { lawyerService } from '@/services/lawyer-service';

interface HomeClientProps {
  initialLawyers: Lawyer[];
}

/**
 * Client Component for interactive home page features
 * Handles search, filtering, and specialty clicks
 * Receives server-rendered lawyer data as props
 */
const HomeClient = ({ initialLawyers }: HomeClientProps) =>{
  const t = useTranslations();
  const [lawyers, setLawyers] = useState<Lawyer[]>(initialLawyers);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const { selectedSpecialties, addSpecialty, setSpecialties } = useSpecialtyFilter();

  // Client-side filtering for instant search results
  const filteredLawyers = useMemo(() => {
    let filtered = lawyers;

    // Apply search query filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (lawyer) =>
          lawyer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lawyer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lawyer.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  }, [lawyers, searchQuery]);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
  };

  const handleFilterSpecialties = async (specialties: string[]): Promise<void> => {
    setSpecialties(specialties);
    const data = await lawyerService.fetchLawyers({ specialties, city: cityFilter || undefined });
    setLawyers(data);
  };

  const handleFilterCity = async (city: string): Promise<void> => {
    setCityFilter(city);
    const data = await lawyerService.fetchLawyers({
      specialties: selectedSpecialties,
      city: city || undefined,
    });
    setLawyers(data);
  };

  const handleSpecialtyClick = async (specialty: string): Promise<void> => {
    addSpecialty(specialty);
    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties
      : [...selectedSpecialties, specialty];
    const data = await lawyerService.fetchLawyers({ specialties: newSpecialties });
    setLawyers(data);
  };

  return (
    <>
      <SearchBar
        onSearch={handleSearch}
        onFilterSpecialties={handleFilterSpecialties}
        onFilterCity={handleFilterCity}
        selectedSpecialties={selectedSpecialties}
      />

      <LawyersGrid lawyers={filteredLawyers} onSpecialtyClick={handleSpecialtyClick} />

      {filteredLawyers.length === 0 && (
        <EmptyState message={t('home.noLawyersFound')} />
      )}
    </>
  );
}

export default HomeClient;