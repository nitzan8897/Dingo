import { renderHook, waitFor, act } from '@testing-library/react';
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
  const mockLawyers: Lawyer[] = [
    {
      id: '1',
      fullNameEn: 'John Doe',
      fullNameHe: 'ג\'ון דו',
      city: 'Tel Aviv',
      specialties: ['CIVIL'],
      yearsOfExperience: 10,
      ratingVector: { professionalism: 0.8, availability: 0.7, empathy: 0.9, cost: 0.6 },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      fullNameEn: 'Jane Smith',
      fullNameHe: 'ג\'יין סמית',
      city: 'Pending Verification',
      specialties: ['CRIMINAL'],
      yearsOfExperience: 5,
      ratingVector: { professionalism: 0.7, availability: 0.8, empathy: 0.8, cost: 0.5 },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      fullNameEn: 'Bob Johnson',
      fullNameHe: 'בוב ג\'ונסון',
      city: 'Jerusalem',
      specialties: ['FAMILY'],
      yearsOfExperience: 15,
      ratingVector: { professionalism: 0.9, availability: 0.6, empathy: 0.9, cost: 0.4 },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should filter out lawyers with "Pending Verification" city', async () => {
    (lawyerService.fetchLawyers as jest.Mock).mockResolvedValue(mockLawyers);

    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should only have 2 lawyers (excluding the one with "Pending Verification")
    expect(result.current.lawyers).toHaveLength(2);
    expect(result.current.filteredLawyers).toHaveLength(2);

    // Verify the pending lawyer is not included
    const pendingLawyer = result.current.lawyers.find(l => l.city === 'Pending Verification');
    expect(pendingLawyer).toBeUndefined();

    // Verify the other lawyers are included
    expect(result.current.lawyers.find(l => l.id === '1')).toBeDefined();
    expect(result.current.lawyers.find(l => l.id === '3')).toBeDefined();
  });

  it('should include all lawyers when none have "Pending Verification" city', async () => {
    const verifiedLawyers = mockLawyers.filter(l => l.city !== 'Pending Verification');
    (lawyerService.fetchLawyers as jest.Mock).mockResolvedValue(verifiedLawyers);

    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lawyers).toHaveLength(2);
    expect(result.current.filteredLawyers).toHaveLength(2);
  });

  it('should return empty array when all lawyers have "Pending Verification" city', async () => {
    const pendingLawyers = mockLawyers.map(l => ({ ...l, city: 'Pending Verification' }));
    (lawyerService.fetchLawyers as jest.Mock).mockResolvedValue(pendingLawyers);

    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lawyers).toHaveLength(0);
    expect(result.current.filteredLawyers).toHaveLength(0);
  });

  it('should not include pending verification lawyers in initial list', async () => {
    (lawyerService.fetchLawyers as jest.Mock).mockResolvedValue(mockLawyers);

    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have 2 verified lawyers (Jane with "Pending Verification" is filtered out)
    expect(result.current.lawyers).toHaveLength(2);
    expect(result.current.filteredLawyers).toHaveLength(2);

    // Verify only verified lawyers are included
    const lawyerCities = result.current.lawyers.map(l => l.city);
    expect(lawyerCities).not.toContain('Pending Verification');
    expect(lawyerCities).toContain('Tel Aviv');
    expect(lawyerCities).toContain('Jerusalem');
  });
});
