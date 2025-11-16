import React from 'react';
import { render, screen } from '@testing-library/react';
import LawyerCard from '../lawyer-card';
import { Lawyer } from '@dingo/types';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('LawyerCard', () => {
  const mockLawyer: Lawyer = {
    id: 'abc-123',
    fullNameEn: 'John Doe',
    fullNameHe: 'ג\'ון דו',
    city: 'Tel Aviv',
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
  };

  it('should render as a clickable link', () => {
    render(<LawyerCard lawyer={mockLawyer} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('should link to lawyer profile page with correct href', () => {
    render(<LawyerCard lawyer={mockLawyer} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('/lawyers/abc-123'));
  });

  it('should display lawyer information inside the link', () => {
    render(<LawyerCard lawyer={mockLawyer} />);

    // Verify content is inside the clickable area
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Tel Aviv');
    expect(link).toHaveTextContent('10');
  });
});
