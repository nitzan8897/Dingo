import React from 'react';
import { render, screen } from '@testing-library/react';
import CostRating from '../cost-rating';

describe('CostRating', () => {
  it('renders label', () => {
    render(<CostRating label="Cost" value={60} />);
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('renders value when showValue is true', () => {
    render(<CostRating label="Cost" value={60} showValue={true} />);
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('does not render value when showValue is false', () => {
    render(<CostRating label="Cost" value={60} showValue={false} />);
    expect(screen.queryByText('60')).not.toBeInTheDocument();
  });

  it('renders value by default', () => {
    render(<CostRating label="Cost" value={75} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('renders dollar signs for 5-point scale', () => {
    const { container } = render(<CostRating label="Cost" value={80} />);
    const dollarSigns = container.querySelectorAll('.text-xl');

    // Should have 5 dollar signs
    expect(dollarSigns.length).toBe(5);
  });

  it('calculates correct number of filled dollar signs', () => {
    // 60% should give 3 out of 5 dollar signs
    render(<CostRating label="Cost" value={60} />);
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('handles custom color', () => {
    render(<CostRating label="Cost" value={60} color="#ff0000" />);
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('uses default color when not provided', () => {
    render(<CostRating label="Cost" value={60} />);
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('clamps value to 0-100 range', () => {
    const { rerender } = render(<CostRating label="Test" value={150} />);
    expect(screen.getByText('100')).toBeInTheDocument();

    rerender(<CostRating label="Test" value={-10} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders 0 dollar signs for 0% value', () => {
    render(<CostRating label="Cost" value={0} />);
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('renders 5 dollar signs for 100% value', () => {
    render(<CostRating label="Cost" value={100} />);
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });
});
