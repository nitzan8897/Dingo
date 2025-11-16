import React from 'react';
import { render, screen } from '@testing-library/react';
import LawyerCardHeader from '../lawyer-card-header';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

describe('LawyerCardHeader', () => {
  it('renders lawyer full name in English', () => {
    render(
      <LawyerCardHeader
        fullNameEn="John Doe"
        fullNameHe="ג'ון דו"
        cityNameEn="Tel Aviv"
        cityNameHe="תל אביב"
      />
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders lawyer city in English', () => {
    render(
      <LawyerCardHeader
        fullNameEn="John Doe"
        fullNameHe="ג'ון דו"
        cityNameEn="Jerusalem"
        cityNameHe="ירושלים"
      />
    );
    expect(screen.getByText('Jerusalem')).toBeInTheDocument();
  });

  it('renders name as heading', () => {
    render(
      <LawyerCardHeader
        fullNameEn="Jane Smith"
        fullNameHe="ג'יין סמית'"
        cityNameEn="Haifa"
        cityNameHe="חיפה"
      />
    );
    const heading = screen.getByRole('heading', { name: 'Jane Smith' });
    expect(heading).toBeInTheDocument();
  });
});
