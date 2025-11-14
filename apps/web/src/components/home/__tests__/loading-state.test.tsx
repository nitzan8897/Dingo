import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingState from '../loading-state';

describe('LoadingState', () => {
  it('renders loading message', () => {
    render(<LoadingState message="Loading lawyers..." />);
    expect(screen.getByText('Loading lawyers...')).toBeInTheDocument();
  });

  it('renders spinner element', () => {
    const { container } = render(<LoadingState message="Loading..." />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
