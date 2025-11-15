import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CostRating from '../cost-rating';

describe('CostRating', () => {
  it('renders label correctly', () => {
    render(<CostRating label="Cost" value={60} />);
    expect(screen.getByText('Cost')).toBeTruthy();
  });

  it('displays value when showValue is true', () => {
    render(<CostRating label="Cost" value={80} showValue={true} />);
    expect(screen.getByText('80')).toBeTruthy();
  });

  it('hides value when showValue is false', () => {
    render(<CostRating label="Cost" value={80} showValue={false} />);
    expect(screen.queryByText('80')).toBeNull();
  });

  it('renders 5 dollar signs', () => {
    render(<CostRating label="Cost" value={50} />);
    const dollarSigns = screen.getAllByText('$');
    expect(dollarSigns).toHaveLength(5);
  });

  it('clamps value to 0-100 range', () => {
    const { rerender } = render(<CostRating label="Cost" value={150} />);
    expect(screen.getByText('100')).toBeTruthy();

    rerender(<CostRating label="Cost" value={-10} />);
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('calculates correct number of filled dollar signs', () => {
    // 100% should show 5 filled dollars
    render(<CostRating label="Cost" value={100} />);
    expect(screen.getAllByText('$')).toHaveLength(5);
  });
});
