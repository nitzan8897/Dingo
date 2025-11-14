import React from 'react';
import { render, screen } from '@testing-library/react';
import LawyerCardHeader from '../lawyer-card-header';

describe('LawyerCardHeader', () => {
  it('renders lawyer full name', () => {
    render(<LawyerCardHeader fullName="John Doe" city="Tel Aviv" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders lawyer city', () => {
    render(<LawyerCardHeader fullName="John Doe" city="Jerusalem" />);
    expect(screen.getByText('Jerusalem')).toBeInTheDocument();
  });

  it('renders name as heading', () => {
    render(<LawyerCardHeader fullName="Jane Smith" city="Haifa" />);
    const heading = screen.getByRole('heading', { name: 'Jane Smith' });
    expect(heading).toBeInTheDocument();
  });
});
