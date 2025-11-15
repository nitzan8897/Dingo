import { useState } from 'react';
import { Lawyer } from '@dingo/types';
import { lawyerService } from '@/services/lawyer-service';
import { useSpecialtyFilter } from './use-specialty-filter';

/**
 * Hook for lawyer filtering (specialty and city)
 * Handles server-side filtering with API calls
 */
export function useLawyerFilters(initialLawyers: Lawyer[]) {
  const [lawyers, setLawyers] = useState<Lawyer[]>(initialLawyers);
  const [cityFilter, setCityFilter] = useState('');
  const { selectedSpecialties, addSpecialty, setSpecialties } =
    useSpecialtyFilter();

  const handleFilterSpecialties = async (
    specialties: string[]
  ): Promise<void> => {
    setSpecialties(specialties);
    const data = await lawyerService.fetchLawyers({
      specialties,
      city: cityFilter || undefined,
    });
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
    const data = await lawyerService.fetchLawyers({
      specialties: newSpecialties,
    });
    setLawyers(data);
  };

  return {
    lawyers,
    selectedSpecialties,
    handleFilterSpecialties,
    handleFilterCity,
    handleSpecialtyClick,
  };
}
