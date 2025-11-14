'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import LawyerCard from '@/components/lawyer/lawyer-card';
import SearchBar from '@/components/search/search-bar';
import LanguageSwitcher from '@/components/common/language-switcher';
import ThemeToggle from '@/components/common/theme-toggle';
import { useLawyers } from '@/hooks/use-lawyers';
import { useSpecialtyFilter } from '@/hooks/use-specialty-filter';

/**
 * Home Page Component
 * Following SOLID principles:
 * - Single Responsibility: Only handles UI rendering and user interactions
 * - Open/Closed: Open for extension through hooks and services
 * - Dependency Inversion: Depends on abstractions (hooks) not concrete implementations
 */
export default function Home() {
  const t = useTranslations();
  const { filteredLawyers, loading, fetchLawyers, searchLawyers } = useLawyers();
  const { selectedSpecialties, addSpecialty, setSpecialties } = useSpecialtyFilter();

  const handleSearch = (query: string) => {
    searchLawyers(query);
  };

  const handleFilterSpecialties = (specialties: string[]) => {
    setSpecialties(specialties);
    fetchLawyers({ specialties });
  };

  const handleFilterCity = (city: string) => {
    fetchLawyers({ specialties: selectedSpecialties, city });
  };

  const handleSpecialtyClick = (specialty: string) => {
    addSpecialty(specialty);
    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties
      : [...selectedSpecialties, specialty];
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