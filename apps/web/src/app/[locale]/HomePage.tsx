'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Lawyer } from '@dingo/types';
import LawyerCard from '@/components/Lawyer/LawyerCard';
import SearchBar from '@/components/Search/SearchBar';
import LanguageSwitcher from '@/components/Common/LanguageSwitcher';
import ThemeToggle from '@/components/Common/ThemeToggle';

export default function Home() {
  const t = useTranslations();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async (params?: { specialties?: string[]; city?: string }) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';
      const queryParams = new URLSearchParams();

      if (params?.specialties && params.specialties.length > 0) {
        queryParams.append('specialties', params.specialties.join(','));
      }
      if (params?.city) queryParams.append('city', params.city);

      const url = `${apiUrl}/lawyers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      setLawyers(data);
      setFilteredLawyers(data);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredLawyers(lawyers);
      return;
    }

    const filtered = lawyers.filter(
      (lawyer) =>
        lawyer.fullName.toLowerCase().includes(query.toLowerCase()) ||
        lawyer.city.toLowerCase().includes(query.toLowerCase()) ||
        lawyer.specialties.some((s) => s.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredLawyers(filtered);
  };

  const handleFilterSpecialties = (specialties: string[]) => {
    setSelectedSpecialties(specialties);
    fetchLawyers({ specialties });
  };

  const handleFilterCity = (city: string) => {
    fetchLawyers({ specialties: selectedSpecialties, city });
  };

  const handleSpecialtyClick = (specialty: string) => {
    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties
      : [...selectedSpecialties, specialty];
    setSelectedSpecialties(newSpecialties);
    fetchLawyers({ specialties: newSpecialties });
  };

  return (
    <main className="min-h-screen p-8 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end gap-3 mb-4">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <Image
              src="/images/dingo-logo.png"
              alt="Dingo Logo"
              width={128}
              height={128}
              className="object-contain"
            />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              {t('home.title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('home.subtitle')}
          </p>
        </header>

        <SearchBar
          onSearch={handleSearch}
          onFilterSpecialties={handleFilterSpecialties}
          onFilterCity={handleFilterCity}
          selectedSpecialties={selectedSpecialties}
        />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{t('home.loadingLawyers')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer.id}
                lawyer={lawyer}
                onSpecialtyClick={handleSpecialtyClick}
              />
            ))}
          </div>
        )}

        {!loading && filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">{t('home.noLawyersFound')}</p>
          </div>
        )}
      </div>
    </main>
  );
}