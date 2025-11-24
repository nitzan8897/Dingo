import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../empty-state';

describe('EmptyState', () => {
  it('renders empty state message', () => {
    render(<EmptyState message="No lawyers found" />);
    expect(screen.getByText('No lawyers found')).toBeInTheDocument();
  });

  it('renders centered text', () => {
    const { container } = render(<EmptyState message="No results" />);
    const wrapper = container.querySelector('.text-center');
    expect(wrapper).toBeInTheDocument();
  });
});
