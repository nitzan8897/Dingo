import { renderHook, act } from '@testing-library/react';
import { useLawyerSearch } from '../use-lawyer-search';
import { Lawyer } from '@dingo/types';

describe('useLawyerSearch', () => {
  const mockLawyers: Lawyer[] = [
    {
      id: '1',
      fullNameEn: 'John Doe',
      fullNameHe: 'ג\'ון דו',
      cityId: 'city-1',
      city: {
        id: 'city-1',
        nameEn: 'Tel Aviv',
        nameHe: 'תל אביב',
        slug: 'tel-aviv',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      specialties: ['CRIMINAL'],
      yearsOfExperience: 10,
      ratingVector: {
        professionalism: 85,
        availability: 90,
        empathy: 75,
        cost: 70,
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      fullNameEn: 'Jane Smith',
      fullNameHe: 'ג\'יין סמית\'',
      cityId: 'city-2',
      city: {
        id: 'city-2',
        nameEn: 'Jerusalem',
        nameHe: 'ירושלים',
        slug: 'jerusalem',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      specialties: ['CIVIL', 'FAMILY'],
      yearsOfExperience: 5,
      ratingVector: {
        professionalism: 90,
        availability: 80,
        empathy: 85,
        cost: 60,
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  it('should return all lawyers when search query is empty', () => {
    const { result } = renderHook(() => useLawyerSearch(mockLawyers));

    expect(result.current.filteredLawyers).toEqual(mockLawyers);
  });

  it('should filter by English name', () => {
    const { result } = renderHook(() => useLawyerSearch(mockLawyers));

    act(() => {
      result.current.setSearchQuery('John');
    });

    expect(result.current.filteredLawyers).toHaveLength(1);
    expect(result.current.filteredLawyers[0].fullNameEn).toBe('John Doe');
  });

  it('should filter by Hebrew name', () => {
    const { result } = renderHook(() => useLawyerSearch(mockLawyers));

    act(() => {
      result.current.setSearchQuery('ג\'יין');
    });

    expect(result.current.filteredLawyers).toHaveLength(1);
    expect(result.current.filteredLawyers[0].fullNameEn).toBe('Jane Smith');
  });

  it('should filter by specialty', () => {
    const { result } = renderHook(() => useLawyerSearch(mockLawyers));

    act(() => {
      result.current.setSearchQuery('CRIMINAL');
    });

    expect(result.current.filteredLawyers).toHaveLength(1);
    expect(result.current.filteredLawyers[0].specialties).toContain('CRIMINAL');
  });

  it('should be case insensitive', () => {
    const { result } = renderHook(() => useLawyerSearch(mockLawyers));

    act(() => {
      result.current.setSearchQuery('john');
    });

    expect(result.current.filteredLawyers).toHaveLength(1);
    expect(result.current.filteredLawyers[0].fullNameEn).toBe('John Doe');
  });

  it('should return empty array when no matches found', () => {
    const { result } = renderHook(() => useLawyerSearch(mockLawyers));

    act(() => {
      result.current.setSearchQuery('NonExistent');
    });

    expect(result.current.filteredLawyers).toHaveLength(0);
  });

  it('should update search query', () => {
    const { result } = renderHook(() => useLawyerSearch(mockLawyers));

    expect(result.current.searchQuery).toBe('');

    act(() => {
      result.current.setSearchQuery('Test');
    });

    expect(result.current.searchQuery).toBe('Test');
  });

  it('should handle partial matches', () => {
    const { result } = renderHook(() => useLawyerSearch(mockLawyers));

    act(() => {
      result.current.setSearchQuery('Doe');
    });

    expect(result.current.filteredLawyers).toHaveLength(1);
    expect(result.current.filteredLawyers[0].fullNameEn).toBe('John Doe');
  });
});
