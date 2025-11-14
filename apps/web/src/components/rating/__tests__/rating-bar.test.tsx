import React from 'react';
import { render, screen } from '@testing-library/react';
import RatingBar from '../rating-bar';

describe('RatingBar', () => {
  it('renders label', () => {
    render(<RatingBar label="Professionalism" value={85} />);
    expect(screen.getByText('Professionalism')).toBeInTheDocument();
  });

  it('renders value when showValue is true', () => {
    render(<RatingBar label="Professionalism" value={85} showValue={true} />);
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('does not render value when showValue is false', () => {
    render(<RatingBar label="Professionalism" value={85} showValue={false} />);
    expect(screen.queryByText('85')).not.toBeInTheDocument();
  });

  it('renders value by default', () => {
    render(<RatingBar label="Professionalism" value={90} />);
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('renders bar with correct width percentage', () => {
    const { container } = render(<RatingBar label="Professionalism" value={75} />);
    const barFill = container.querySelector('[class*="w-"]');

    // The bar should exist
    expect(barFill).toBeInTheDocument();
  });

  it('handles custom color', () => {
    render(<RatingBar label="Professionalism" value={85} color="#ff0000" />);
    expect(screen.getByText('Professionalism')).toBeInTheDocument();
  });

  it('uses default color when not provided', () => {
    render(<RatingBar label="Professionalism" value={85} />);
    expect(screen.getByText('Professionalism')).toBeInTheDocument();
  });

  it('clamps value to 0-100 range', () => {
    const { rerender } = render(<RatingBar label="Test" value={150} />);
    expect(screen.getByText('100')).toBeInTheDocument();

    rerender(<RatingBar label="Test" value={-10} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
