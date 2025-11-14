import React from 'react';
import { render, screen } from '@testing-library/react';
import LawyerCardRatings from '../lawyer-card-ratings';
import { RatingVector } from '@dingo/types';

describe('LawyerCardRatings', () => {
  const mockRatings: RatingVector = {
    professionalism: 85,
    availability: 90,
    empathy: 80,
    cost: 75,
  };

  const mockLabels = {
    professionalism: 'Professionalism',
    availability: 'Availability',
    empathy: 'Empathy',
    cost: 'Cost',
  };

  it('renders all rating labels', () => {
    render(<LawyerCardRatings ratings={mockRatings} labels={mockLabels} />);

    expect(screen.getByText('Professionalism')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
    expect(screen.getByText('Empathy')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('renders all rating values', () => {
    render(<LawyerCardRatings ratings={mockRatings} labels={mockLabels} />);

    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    // Cost rating doesn't show value by default
  });
});
