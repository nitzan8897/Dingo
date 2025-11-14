import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    onSearch: jest.fn(),
    onFilterSpecialties: jest.fn(),
    onFilterCity: jest.fn(),
    selectedSpecialties: [] as string[],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Search input', () => {
    it('renders search input with placeholder', () => {
      render(<SearchBar {...defaultProps} />);
      const input = screen.getByPlaceholderText('search.placeholder');
      expect(input).toBeInTheDocument();
    });

    it('calls onSearch when user types', async () => {
      const user = userEvent.setup();
      render(<SearchBar {...defaultProps} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      await user.type(input, 'John Doe');

      expect(defaultProps.onSearch).toHaveBeenCalledTimes(8); // Called for each character
      expect(defaultProps.onSearch).toHaveBeenLastCalledWith('John Doe');
    });

    it('updates input value when typing', async () => {
      const user = userEvent.setup();
      render(<SearchBar {...defaultProps} />);
      const input = screen.getByPlaceholderText('search.placeholder') as HTMLInputElement;

      await user.type(input, 'Test query');

      expect(input.value).toBe('Test query');
    });

    it('handles empty search query', async () => {
      const user = userEvent.setup();
      render(<SearchBar {...defaultProps} />);
      const input = screen.getByPlaceholderText('search.placeholder') as HTMLInputElement;

      await user.type(input, 'Test');
      await user.clear(input);

      expect(input.value).toBe('');
      expect(defaultProps.onSearch).toHaveBeenLastCalledWith('');
    });
  });

  describe('Specialty filter integration', () => {
    it('renders SpecialtyDropdown when onFilterSpecialties is provided', () => {
      render(<SearchBar {...defaultProps} />);
      // SpecialtyDropdown button should be present
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('does not render SpecialtyDropdown when onFilterSpecialties is not provided', () => {
      const propsWithoutSpecialtyFilter = {
        onSearch: jest.fn(),
        onFilterCity: jest.fn(),
      };
      render(<SearchBar {...propsWithoutSpecialtyFilter} />);

      // Only city input should be present, no dropdown button
      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBe(0);
    });

    it('passes selectedSpecialties to SpecialtyDropdown', () => {
      const selectedSpecialties = ['CRIMINAL', 'CIVIL'];
      render(<SearchBar {...defaultProps} selectedSpecialties={selectedSpecialties} />);

      // Dropdown should show count of selected specialties
      expect(screen.getByText('2 search.specialties')).toBeInTheDocument();
    });

    it('calls onFilterSpecialties when specialties change', async () => {
      render(<SearchBar {...defaultProps} />);

      // Open dropdown and select a specialty
      const dropdownButton = screen.getByRole('button');
      fireEvent.click(dropdownButton);

      const specialty = await screen.findByText('specialties.CRIMINAL');
      fireEvent.click(specialty);

      expect(defaultProps.onFilterSpecialties).toHaveBeenCalledWith(['CRIMINAL']);
    });
  });

  describe('City filter', () => {
    it('renders city input when onFilterCity is provided', () => {
      render(<SearchBar {...defaultProps} />);
      const cityInput = screen.getByPlaceholderText('search.filterByCity');
      expect(cityInput).toBeInTheDocument();
    });

    it('does not render city input when onFilterCity is not provided', () => {
      const propsWithoutCityFilter = {
        onSearch: jest.fn(),
        onFilterSpecialties: jest.fn(),
        selectedSpecialties: [],
      };
      render(<SearchBar {...propsWithoutCityFilter} />);

      const cityInput = screen.queryByPlaceholderText('search.filterByCity');
      expect(cityInput).not.toBeInTheDocument();
    });

    it('calls onFilterCity when user types in city input', async () => {
      const user = userEvent.setup();
      render(<SearchBar {...defaultProps} />);
      const cityInput = screen.getByPlaceholderText('search.filterByCity');

      await user.type(cityInput, 'New York');

      expect(defaultProps.onFilterCity).toHaveBeenCalledTimes(8); // Called for each character
      expect(defaultProps.onFilterCity).toHaveBeenLastCalledWith('New York');
    });
  });

  describe('Layout', () => {
    it('renders all filter elements', () => {
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('search.placeholder');
      const dropdownButton = screen.getByRole('button');
      const cityInput = screen.getByPlaceholderText('search.filterByCity');

      // Verify all elements exist in document
      expect(searchInput).toBeInTheDocument();
      expect(dropdownButton).toBeInTheDocument();
      expect(cityInput).toBeInTheDocument();
    });
  });

  describe('Integration with all filters', () => {
    it('handles all filter types together', async () => {
      const user = userEvent.setup();
      render(<SearchBar {...defaultProps} />);

      // Search
      const searchInput = screen.getByPlaceholderText('search.placeholder');
      await user.type(searchInput, 'lawyer');
      expect(defaultProps.onSearch).toHaveBeenCalledWith('lawyer');

      // Specialty
      const dropdownButton = screen.getByRole('button');
      fireEvent.click(dropdownButton);
      const specialty = await screen.findByText('specialties.CRIMINAL');
      fireEvent.click(specialty);
      expect(defaultProps.onFilterSpecialties).toHaveBeenCalledWith(['CRIMINAL']);

      // City
      const cityInput = screen.getByPlaceholderText('search.filterByCity');
      await user.type(cityInput, 'NYC');
      expect(defaultProps.onFilterCity).toHaveBeenCalledWith('NYC');
    });

    it('maintains state when interacting with different filters', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<SearchBar {...defaultProps} />);

      // Type in search
      const searchInput = screen.getByPlaceholderText('search.placeholder') as HTMLInputElement;
      await user.type(searchInput, 'test');
      expect(searchInput.value).toBe('test');

      // Update with selected specialty
      rerender(
        <SearchBar
          {...defaultProps}
          selectedSpecialties={['CRIMINAL']}
        />
      );

      // Search input should still have its value
      expect(searchInput.value).toBe('test');
      // Dropdown should show selection
      expect(screen.getByText('1 search.specialties')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles rapid typing in search input', async () => {
      const user = userEvent.setup();
      render(<SearchBar {...defaultProps} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      await user.type(input, 'abcdefghijklmnop', { delay: 1 });

      expect(defaultProps.onSearch).toHaveBeenLastCalledWith('abcdefghijklmnop');
    });

    it('handles special characters in search', async () => {
      const user = userEvent.setup();
      render(<SearchBar {...defaultProps} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      await user.type(input, 'O\'Brien & Co.');

      expect(defaultProps.onSearch).toHaveBeenCalledWith('O\'Brien & Co.');
    });

    it('handles empty selectedSpecialties array', () => {
      render(<SearchBar {...defaultProps} selectedSpecialties={[]} />);
      expect(screen.getByText('search.chooseSpecialties')).toBeInTheDocument();
    });
  });
});
