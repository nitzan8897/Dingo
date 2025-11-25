import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import FloatingLawyerIcons from '../floating-lawyer-icons';
import { Lawyer } from '@dingo/types';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
}));

describe('FloatingLawyerIcons', () => {
  const mockPush = jest.fn();
  const mockLawyers: Lawyer[] = [
    {
      id: '1',
      fullNameEn: 'John Doe',
      fullNameHe: 'ג\'ון דו',
      cityId: '1',
      city: { id: '1', nameEn: 'Tel Aviv', nameHe: 'תל אביב' },
      specialties: ['CRIMINAL'],
      yearsOfExperience: 10,
      ratingVector: {
        professionalism: 80,
        availability: 90,
        empathy: 85,
        cost: 75,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      fullNameEn: 'Jane Smith',
      fullNameHe: 'ג\'יין סמית',
      cityId: '2',
      city: { id: '2', nameEn: 'Jerusalem', nameHe: 'ירושלים' },
      specialties: ['CIVIL'],
      yearsOfExperience: 15,
      ratingVector: {
        professionalism: 85,
        availability: 80,
        empathy: 90,
        cost: 70,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render lawyer tooltips with English names when locale is en', () => {
    (useLocale as jest.Mock).mockReturnValue('en');

    const { container } = render(<FloatingLawyerIcons lawyers={mockLawyers} />);

    // Check that English names are in the DOM
    expect(container.textContent).toContain('John Doe');
    expect(container.textContent).toContain('Jane Smith');

    // Check that Hebrew names are NOT used
    expect(container.textContent).not.toContain('ג\'ון דו');
    expect(container.textContent).not.toContain('ג\'יין סמית');
  });

  it('should render lawyer tooltips with Hebrew names when locale is he', () => {
    (useLocale as jest.Mock).mockReturnValue('he');

    const { container } = render(<FloatingLawyerIcons lawyers={mockLawyers} />);

    // Check that Hebrew names are in the DOM
    expect(container.textContent).toContain('ג\'ון דו');
    expect(container.textContent).toContain('ג\'יין סמית');

    // Check that English names are NOT used
    expect(container.textContent).not.toContain('John Doe');
    expect(container.textContent).not.toContain('Jane Smith');
  });

  it('should render correct number of lawyer icons', () => {
    (useLocale as jest.Mock).mockReturnValue('en');

    const { container } = render(<FloatingLawyerIcons lawyers={mockLawyers} />);

    // Find all floating icon elements
    const icons = container.querySelectorAll('.floating-icon');
    expect(icons).toHaveLength(2);
  });

  it('should have tooltip text that is not empty', () => {
    (useLocale as jest.Mock).mockReturnValue('en');

    const { container } = render(<FloatingLawyerIcons lawyers={mockLawyers} />);

    // Find all tooltip divs (they have z-[999] class)
    const tooltips = container.querySelectorAll('.z-\\[999\\]');

    tooltips.forEach((tooltip) => {
      // Each tooltip should have non-empty text content
      expect(tooltip.textContent).toBeTruthy();
      expect(tooltip.textContent!.trim().length).toBeGreaterThan(0);
    });
  });

  it('should use correct field names from Lawyer type', () => {
    (useLocale as jest.Mock).mockReturnValue('en');

    const { container } = render(<FloatingLawyerIcons lawyers={mockLawyers} />);

    // Verify that the component accesses fullNameEn/fullNameHe, not fullName
    mockLawyers.forEach((lawyer) => {
      expect(container.textContent).toContain(lawyer.fullNameEn);
    });
  });
});
