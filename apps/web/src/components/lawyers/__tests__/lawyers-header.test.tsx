import React from 'react';
import { render, screen } from '@testing-library/react';
import LawyersHeader from '../lawyers-header';

describe('LawyersHeader', () => {
  it('renders title and subtitle', () => {
    render(<LawyersHeader title="Find Lawyers" subtitle="Search for legal professionals" />);

    expect(screen.getByText('Find Lawyers')).toBeInTheDocument();
    expect(screen.getByText('Search for legal professionals')).toBeInTheDocument();
  });

  it('renders logo image', () => {
    render(<LawyersHeader title="Find Lawyers" subtitle="Search" />);

    const logo = screen.getByAltText('Dingo Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('dingo-logo.png'));
  });

  it('renders as header element', () => {
    const { container } = render(<LawyersHeader title="Test" subtitle="Test" />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
