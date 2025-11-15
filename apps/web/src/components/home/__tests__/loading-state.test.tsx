import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingState from '../loading-state';

describe('LoadingState', () => {
  it('renders loading message', () => {
    render(<LoadingState message="Loading lawyers..." />);
    expect(screen.getByText('Loading lawyers...')).toBeInTheDocument();
  });

  it('renders skeleton placeholders', () => {
    const { container } = render(<LoadingState message="Loading..." />);
    // shadcn/ui Skeleton components use animate-pulse class
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders 6 skeleton card placeholders', () => {
    const { container } = render(<LoadingState message="Loading..." />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    // 6 cards × 3 skeletons each = 18 total skeletons
    expect(skeletons.length).toBe(18);
  });
});
