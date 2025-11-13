'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Lawyer } from '@dingo/types';
import LawyerCard from '@/components/LawyerCard';
import SearchBar from '@/components/SearchBar';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const t = useTranslations();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async (params?: { specialty?: string; city?: string }) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';
      const queryParams = new URLSearchParams();

      if (params?.specialty) queryParams.append('specialty', params.specialty);
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

  const handleFilterSpecialty = (specialty: string) => {
    fetchLawyers({ specialty });
  };

  const handleFilterCity = (city: string) => {
    fetchLawyers({ city });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('home.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('home.subtitle')}
          </p>
        </header>

        <SearchBar
          onSearch={handleSearch}
          onFilterSpecialty={handleFilterSpecialty}
          onFilterCity={handleFilterCity}
        />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">{t('home.loadingLawyers')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} />
            ))}
          </div>
        )}

        {!loading && filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{t('home.noLawyersFound')}</p>
          </div>
        )}
      </div>
    </main>
  );
}