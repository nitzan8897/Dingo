import React from 'react';
import { render, screen } from '@testing-library/react';
import HomeHeader from '../home-header';

describe('HomeHeader', () => {
  it('renders title and subtitle', () => {
    render(<HomeHeader title="Find Lawyers" subtitle="Search for legal professionals" />);

    expect(screen.getByText('Find Lawyers')).toBeInTheDocument();
    expect(screen.getByText('Search for legal professionals')).toBeInTheDocument();
  });

  it('renders logo image', () => {
    render(<HomeHeader title="Find Lawyers" subtitle="Search" />);

    const logo = screen.getByAltText('Dingo Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('dingo-logo.png'));
  });

  it('renders as header element', () => {
    const { container } = render(<HomeHeader title="Test" subtitle="Test" />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
