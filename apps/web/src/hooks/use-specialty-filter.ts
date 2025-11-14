import { useState, useCallback } from 'react';

/**
 * Custom hook for managing specialty filter state
 * Follows Single Responsibility Principle - only handles specialty filter logic
 */
export function useSpecialtyFilter() {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  /**
   * Add a specialty to the selected list if not already present
   * @param specialty - Specialty to add
   */
  const addSpecialty = useCallback((specialty: string) => {
    setSelectedSpecialties((prev) => {
      if (prev.includes(specialty)) {
        return prev;
      }
      return [...prev, specialty];
    });
  }, []);

  /**
   * Remove a specialty from the selected list
   * @param specialty - Specialty to remove
   */
  const removeSpecialty = useCallback((specialty: string) => {
    setSelectedSpecialties((prev) => prev.filter((s) => s !== specialty));
  }, []);

  /**
   * Toggle a specialty (add if not present, remove if present)
   * @param specialty - Specialty to toggle
   */
  const toggleSpecialty = useCallback((specialty: string) => {
    setSelectedSpecialties((prev) => {
      if (prev.includes(specialty)) {
        return prev.filter((s) => s !== specialty);
      }
      return [...prev, specialty];
    });
  }, []);

  /**
   * Clear all selected specialties
   */
  const clearSpecialties = useCallback(() => {
    setSelectedSpecialties([]);
  }, []);

  /**
   * Set specialties to a specific list
   * @param specialties - Array of specialties to set
   */
  const setSpecialties = useCallback((specialties: string[]) => {
    setSelectedSpecialties(specialties);
  }, []);

  return {
    selectedSpecialties,
    addSpecialty,
    removeSpecialty,
    toggleSpecialty,
    clearSpecialties,
    setSpecialties,
  };
}
