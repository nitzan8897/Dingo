import { renderHook, act, waitFor } from '@testing-library/react';
import { useLawyers } from '../use-lawyers';
import { lawyerService } from '@/services/lawyer-service';
import { Lawyer } from '@dingo/types';

// Mock the lawyer service
jest.mock('@/services/lawyer-service', () => ({
  lawyerService: {
    fetchLawyers: jest.fn(),
  },
}));

describe('useLawyers', () => {
  const mockCity = {
    id: 'city-1',
    nameEn: 'Tel Aviv',
    nameHe: 'תל אביב',
    slug: 'tel-aviv',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockLawyers: Lawyer[] = [
    {
      id: '1',
      fullNameEn: 'John Doe',
      fullNameHe: 'ג\'ון דו',
      cityId: 'city-1',
      city: mockCity,
      specialties: ['CRIMINAL'],
      yearsOfExperience: 5,
      ratingVector: {
        professionalism: 90,
        availability: 80,
        empathy: 85,
        cost: 70,
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      fullNameEn: 'Jane Smith',
      fullNameHe: 'ג\'יין סמית',
      cityId: 'city-2',
      city: {
        id: 'city-2',
        nameEn: 'Haifa',
        nameHe: 'חיפה',
        slug: 'haifa',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      specialties: ['CIVIL'],
      yearsOfExperience: 10,
      ratingVector: {
        professionalism: 95,
        availability: 90,
        empathy: 92,
        cost: 75,
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (lawyerService.fetchLawyers as jest.Mock).mockResolvedValue(mockLawyers);
  });

  it('should fetch lawyers on mount', async () => {
    const { result } = renderHook(() => useLawyers());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(lawyerService.fetchLawyers).toHaveBeenCalledTimes(1);
    expect(result.current.lawyers).toEqual(mockLawyers);
    expect(result.current.filteredLawyers).toEqual(mockLawyers);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    const mockError = new Error('Failed to fetch');
    (lawyerService.fetchLawyers as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.lawyers).toEqual([]);
  });

  it('should search by English name', async () => {
    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.searchLawyers('John');
    });

    expect(result.current.filteredLawyers).toHaveLength(1);
    expect(result.current.filteredLawyers[0].fullNameEn).toBe('John Doe');
  });

  it('should search by Hebrew name', async () => {
    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.searchLawyers('ג\'יין');
    });

    expect(result.current.filteredLawyers).toHaveLength(1);
    expect(result.current.filteredLawyers[0].fullNameEn).toBe('Jane Smith');
  });

  it('should search by city English name', async () => {
    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.searchLawyers('Haifa');
    });

    expect(result.current.filteredLawyers).toHaveLength(1);
    expect(result.current.filteredLawyers[0].city.nameEn).toBe('Haifa');
  });

  it('should search by city Hebrew name', async () => {
    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.searchLawyers('תל אביב');
    });

    expect(result.current.filteredLawyers).toHaveLength(1);
    expect(result.current.filteredLawyers[0].city.nameHe).toBe('תל אביב');
  });

  it('should search by specialty', async () => {
    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.searchLawyers('CRIMINAL');
    });

    expect(result.current.filteredLawyers).toHaveLength(1);
    expect(result.current.filteredLawyers[0].specialties).toContain('CRIMINAL');
  });

  it('should return all lawyers when search query is empty', async () => {
    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.searchLawyers('');
    });

    expect(result.current.filteredLawyers).toEqual(mockLawyers);
  });

  it('should return empty array when no matches found', async () => {
    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.searchLawyers('NonexistentLawyer');
    });

    expect(result.current.filteredLawyers).toHaveLength(0);
  });

  it('should fetch lawyers with filter params', async () => {
    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const filterParams = { city: 'tel-aviv', specialty: 'CRIMINAL' };

    await act(async () => {
      await result.current.fetchLawyers(filterParams);
    });

    expect(lawyerService.fetchLawyers).toHaveBeenCalledWith(filterParams);
  });
});
