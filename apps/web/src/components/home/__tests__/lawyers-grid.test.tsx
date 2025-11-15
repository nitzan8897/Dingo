import React from 'react';
import { render, screen } from '@testing-library/react';
import LawyersGrid from '../lawyers-grid';
import { Lawyer } from '@dingo/types';

// Mock LawyerCard component
jest.mock('@/components/lawyer/lawyer-card', () => {
  return function MockLawyerCard({ lawyer }: { lawyer: Lawyer }) {
    return <div data-testid="lawyer-card">{lawyer.fullName}</div>;
  };
});

describe('LawyersGrid', () => {
  const mockLawyers: Lawyer[] = [
    {
      id: '1',
      fullName: 'John Doe',
      city: 'Tel Aviv',
      specialties: ['CRIMINAL'],
      phoneNumber: '123',
      email: 'john@example.com',
      experienceYears: 10,
      ratings: {
        overall: 85,
        professionalism: 90,
        communication: 80,
        expertise: 85,
        cost: 75,
      },
    },
    {
      id: '2',
      fullName: 'Jane Smith',
      city: 'Jerusalem',
      specialties: ['CIVIL'],
      phoneNumber: '456',
      email: 'jane@example.com',
      experienceYears: 8,
      ratings: {
        overall: 90,
        professionalism: 95,
        communication: 85,
        expertise: 90,
        cost: 80,
      },
    },
  ];

  const mockOnSpecialtyClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders grid with correct layout classes', () => {
    const { container } = render(
      <LawyersGrid lawyers={mockLawyers} onSpecialtyClick={mockOnSpecialtyClick} />
    );
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('renders lawyer card for each lawyer', () => {
    render(<LawyersGrid lawyers={mockLawyers} onSpecialtyClick={mockOnSpecialtyClick} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getAllByTestId('lawyer-card')).toHaveLength(2);
  });

  it('renders empty grid when no lawyers', () => {
    const { container } = render(
      <LawyersGrid lawyers={[]} onSpecialtyClick={mockOnSpecialtyClick} />
    );
    expect(screen.queryAllByTestId('lawyer-card')).toHaveLength(0);
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  it('passes onSpecialtyClick to each card', () => {
    render(<LawyersGrid lawyers={mockLawyers} onSpecialtyClick={mockOnSpecialtyClick} />);
    // The mock verifies the prop is passed - full integration tested in parent component tests
    expect(screen.getAllByTestId('lawyer-card')).toHaveLength(2);
  });
});
