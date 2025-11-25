import { render, screen } from '@testing-library/react';
import LawyerProfilePage from '../page';
import { lawyerService } from '@/services/lawyer-service';
import { caseService } from '@/services/case-service';
import { Lawyer } from '@dingo/types';

// Mock dependencies
jest.mock('@/services/lawyer-service');
jest.mock('@/services/case-service');
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => '/en/lawyers/1'),
}));
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(() =>
    Promise.resolve((key: string) => {
      const translations: Record<string, string> = {
        'lawyer.yearsOfExperience': 'years of experience',
        'lawyer.specialties': 'Specialties',
        'lawyer.ratings': 'Ratings',
        'lawyer.about': 'About',
        'specialties.CRIMINAL': 'Criminal Law',
        'specialties.CIVIL': 'Civil Law',
        'ratings.professionalism': 'Professionalism',
        'ratings.availability': 'Availability',
        'ratings.empathy': 'Empathy',
        'ratings.cost': 'Cost',
      };
      return translations[key] || key;
    })
  ),
}));

describe('LawyerProfilePage', () => {
  const mockLawyer: Lawyer = {
    id: '1',
    fullNameEn: 'John Doe',
    fullNameHe: 'ג\'ון דו',
    bioEn: 'Experienced criminal lawyer',
    bioHe: 'עורך דין פלילי מנוסה',
    cityId: 'city-1',
    city: {
      id: 'city-1',
      nameEn: 'Tel Aviv',
      nameHe: 'תל אביב',
      slug: 'tel-aviv',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    specialties: ['CRIMINAL', 'CIVIL'],
    yearsOfExperience: 10,
    ratingVector: {
      professionalism: 85,
      availability: 90,
      empathy: 75,
      cost: 70,
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (lawyerService.fetchLawyerById as jest.Mock).mockResolvedValue(mockLawyer);
    (caseService.fetchCases as jest.Mock).mockResolvedValue([]);
  });

  it('should display lawyer name in English locale', async () => {
    const params = Promise.resolve({ id: '1', locale: 'en' });
    const page = await LawyerProfilePage({ params });

    render(page);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should display lawyer name in Hebrew locale', async () => {
    const params = Promise.resolve({ id: '1', locale: 'he' });
    const page = await LawyerProfilePage({ params });

    render(page);

    expect(screen.getByText('ג\'ון דו')).toBeInTheDocument();
  });

  it('should display avatar with initials', async () => {
    const params = Promise.resolve({ id: '1', locale: 'en' });
    const page = await LawyerProfilePage({ params });

    render(page);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should display bio in English locale', async () => {
    const params = Promise.resolve({ id: '1', locale: 'en' });
    const page = await LawyerProfilePage({ params });

    render(page);

    expect(screen.getByText('Experienced criminal lawyer')).toBeInTheDocument();
  });

  it('should display bio in Hebrew locale', async () => {
    const params = Promise.resolve({ id: '1', locale: 'he' });
    const page = await LawyerProfilePage({ params });

    render(page);

    expect(screen.getByText('עורך דין פלילי מנוסה')).toBeInTheDocument();
  });

  it('should not display bio section if bio is not provided', async () => {
    const lawyerWithoutBio = { ...mockLawyer, bioEn: undefined, bioHe: undefined };
    (lawyerService.fetchLawyerById as jest.Mock).mockResolvedValue(lawyerWithoutBio);

    const params = Promise.resolve({ id: '1', locale: 'en' });
    const page = await LawyerProfilePage({ params });

    render(page);

    expect(screen.queryByText('About')).not.toBeInTheDocument();
  });

  it('should display city name in English locale', async () => {
    const params = Promise.resolve({ id: '1', locale: 'en' });
    const page = await LawyerProfilePage({ params });

    render(page);

    expect(screen.getByText(/Tel Aviv/)).toBeInTheDocument();
  });

  it('should display city name in Hebrew locale', async () => {
    const params = Promise.resolve({ id: '1', locale: 'he' });
    const page = await LawyerProfilePage({ params });

    render(page);

    expect(screen.getByText(/תל אביב/)).toBeInTheDocument();
  });

  it('should display years of experience', async () => {
    const params = Promise.resolve({ id: '1', locale: 'en' });
    const page = await LawyerProfilePage({ params });

    render(page);

    expect(screen.getByText(/10.*years of experience/)).toBeInTheDocument();
  });

  it('should display specialties', async () => {
    const params = Promise.resolve({ id: '1', locale: 'en' });
    const page = await LawyerProfilePage({ params });

    render(page);

    expect(screen.getByText('Criminal Law')).toBeInTheDocument();
    expect(screen.getByText('Civil Law')).toBeInTheDocument();
  });

  it('should display ratings', async () => {
    const params = Promise.resolve({ id: '1', locale: 'en' });
    const page = await LawyerProfilePage({ params });

    render(page);

    expect(screen.getByText('Professionalism')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
    expect(screen.getByText('Empathy')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });
});
