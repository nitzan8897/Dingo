import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpecialtyDropdownPanel from '../specialty-dropdown-panel';

describe('SpecialtyDropdownPanel', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: jest.fn(),
    filteredSpecialties: ['CRIMINAL', 'CIVIL', 'FAMILY'],
    selectedSpecialties: [] as string[],
    onSpecialtyToggle: jest.fn(),
    onClearAll: jest.fn(),
    getSpecialtyLabel: (specialty: string) => `Label: ${specialty}`,
    searchPlaceholder: 'Search specialties',
    noResultsText: 'No results found',
    clearAllText: 'Clear All',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Search input', () => {
    it('renders search input with placeholder', () => {
      render(<SpecialtyDropdownPanel {...defaultProps} />);
      expect(screen.getByPlaceholderText('Search specialties')).toBeInTheDocument();
    });

    it('calls onSearchChange when typing', async () => {
      const user = userEvent.setup();
      render(<SpecialtyDropdownPanel {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search specialties');

      await user.type(input, 'criminal');

      expect(defaultProps.onSearchChange).toHaveBeenCalled();
    });

    it('displays current search query', () => {
      render(<SpecialtyDropdownPanel {...defaultProps} searchQuery="test" />);
      const input = screen.getByPlaceholderText('Search specialties') as HTMLInputElement;
      expect(input.value).toBe('test');
    });
  });

  describe('Specialty tags', () => {
    it('renders all filtered specialties', () => {
      render(<SpecialtyDropdownPanel {...defaultProps} />);
      expect(screen.getByText('Label: CRIMINAL')).toBeInTheDocument();
      expect(screen.getByText('Label: CIVIL')).toBeInTheDocument();
      expect(screen.getByText('Label: FAMILY')).toBeInTheDocument();
    });

    it('calls onSpecialtyToggle when specialty is clicked', () => {
      render(<SpecialtyDropdownPanel {...defaultProps} />);
      const tag = screen.getByText('Label: CRIMINAL');
      fireEvent.click(tag);
      expect(defaultProps.onSpecialtyToggle).toHaveBeenCalledWith('CRIMINAL');
    });

    it('shows no results message when filteredSpecialties is empty', () => {
      render(<SpecialtyDropdownPanel {...defaultProps} filteredSpecialties={[]} />);
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  describe('Clear All button', () => {
    it('does not show when no specialties selected', () => {
      render(<SpecialtyDropdownPanel {...defaultProps} />);
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('shows when specialties are selected', () => {
      render(<SpecialtyDropdownPanel {...defaultProps} selectedSpecialties={['CRIMINAL']} />);
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('calls onClearAll when clicked', () => {
      render(<SpecialtyDropdownPanel {...defaultProps} selectedSpecialties={['CRIMINAL']} />);
      const clearButton = screen.getByText('Clear All');
      fireEvent.click(clearButton);
      expect(defaultProps.onClearAll).toHaveBeenCalledTimes(1);
    });

    it('has X icon', () => {
      const { container } = render(
        <SpecialtyDropdownPanel {...defaultProps} selectedSpecialties={['CRIMINAL']} />
      );
      const clearButton = screen.getByText('Clear All').closest('button');
      const icon = clearButton?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });
});
