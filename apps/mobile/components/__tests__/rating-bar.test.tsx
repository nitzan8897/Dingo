import React from 'react';
import { render, screen } from '@testing-library/react-native';
import RatingBar from '../rating-bar';

describe('RatingBar', () => {
  it('renders label correctly', () => {
    render(<RatingBar label="Professionalism" value={85} />);
    expect(screen.getByText('Professionalism')).toBeTruthy();
  });

  it('displays value when showValue is true', () => {
    render(<RatingBar label="Test" value={75} showValue={true} />);
    expect(screen.getByText('75')).toBeTruthy();
  });

  it('hides value when showValue is false', () => {
    render(<RatingBar label="Test" value={75} showValue={false} />);
    expect(screen.queryByText('75')).toBeNull();
  });

  it('clamps value to 0-100 range', () => {
    const { rerender } = render(<RatingBar label="Test" value={150} />);
    expect(screen.getByText('100')).toBeTruthy();

    rerender(<RatingBar label="Test" value={-10} />);
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('uses default color when not specified', () => {
    render(<RatingBar label="Test" value={50} />);
    expect(screen.getByText('50')).toBeTruthy();
  });

  it('applies custom color', () => {
    render(<RatingBar label="Test" value={50} color="#ff0000" />);
    expect(screen.getByText('50')).toBeTruthy();
  });
});
