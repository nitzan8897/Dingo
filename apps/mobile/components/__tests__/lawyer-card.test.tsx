import React from 'react';
import { render, screen } from '@testing-library/react-native';
import LawyerCard from '../lawyer-card';
import { Lawyer } from '@dingo/types';

const mockLawyer: Lawyer = {
  id: '1',
  fullNameEn: 'John Doe',
  fullNameHe: 'ג\'ון דו',
  city: 'Tel Aviv',
  specialties: ['CRIMINAL', 'CIVIL'],
  yearsOfExperience: 10,
  ratingVector: {
    professionalism: 85,
    availability: 90,
    empathy: 75,
    cost: 60,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('LawyerCard', () => {
  it('renders lawyer name in Hebrew by default', () => {
    render(<LawyerCard lawyer={mockLawyer} />);
    // Default language is Hebrew, so it should show Hebrew name
    expect(screen.getByText('ג\'ון דו')).toBeTruthy();
  });

  it('renders lawyer city', () => {
    render(<LawyerCard lawyer={mockLawyer} />);
    expect(screen.getByText('Tel Aviv')).toBeTruthy();
  });

  it('renders years of experience', () => {
    render(<LawyerCard lawyer={mockLawyer} />);
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('renders specialties', () => {
    render(<LawyerCard lawyer={mockLawyer} />);
    expect(screen.getByText('CRIMINAL')).toBeTruthy();
    expect(screen.getByText('CIVIL')).toBeTruthy();
  });

  it('displays overall rating', () => {
    render(<LawyerCard lawyer={mockLawyer} />);
    // Overall rating should be calculated from ratingVector
    const overallRating = Math.round((85 + 90 + 75 + 60) / 4);
    expect(screen.getByText(overallRating.toString())).toBeTruthy();
  });

  it('displays all rating bars', () => {
    render(<LawyerCard lawyer={mockLawyer} />);
    // Check for rating values
    expect(screen.getByText('85')).toBeTruthy(); // professionalism
    expect(screen.getByText('90')).toBeTruthy(); // availability
    expect(screen.getByText('75')).toBeTruthy(); // empathy
    expect(screen.getByText('60')).toBeTruthy(); // cost
  });
});
