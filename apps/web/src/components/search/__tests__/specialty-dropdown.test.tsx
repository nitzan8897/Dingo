import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpecialtyDropdown from '../specialty-dropdown';
import { LawyerSpecialty } from '@dingo/types';

describe('SpecialtyDropdown', () => {
  const defaultProps = {
    selectedSpecialties: [] as string[],
    onSpecialtiesChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Dropdown button', () => {
    it('renders with default placeholder text when no specialties selected', () => {
      render(<SpecialtyDropdown {...defaultProps} />);
      expect(screen.getByText('search.chooseSpecialties')).toBeInTheDocument();
    });

    it('shows count when specialties are selected', () => {
      render(<SpecialtyDropdown {...defaultProps} selectedSpecialties={['CRIMINAL', 'CIVIL']} />);
      expect(screen.getByText('2 search.specialties')).toBeInTheDocument();
    });

    it('opens dropdown when clicked', async () => {
      render(<SpecialtyDropdown {...defaultProps} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('search.searchSpecialties')).toBeInTheDocument();
      });
    });

    it('closes dropdown when clicked again', async () => {
      render(<SpecialtyDropdown {...defaultProps} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByPlaceholderText('search.searchSpecialties')).toBeInTheDocument();
      });

      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('search.searchSpecialties')).not.toBeInTheDocument();
      });
    });
  });

  describe('Search functionality', () => {
    it('renders search input when dropdown is open', async () => {
      render(<SpecialtyDropdown {...defaultProps} />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('search.searchSpecialties')).toBeInTheDocument();
      });
    });

    it('filters specialties based on search query', async () => {
      const user = userEvent.setup();
      render(<SpecialtyDropdown {...defaultProps} />);

      fireEvent.click(screen.getByRole('button'));

      const searchInput = await screen.findByPlaceholderText('search.searchSpecialties');
      await user.type(searchInput, 'criminal');

      // Should show filtered results
      await waitFor(() => {
        const allSpecialties = Object.values(LawyerSpecialty);
        expect(screen.queryAllByRole('generic').length).toBeLessThan(allSpecialties.length);
      });
    });

    it('shows no results message when search yields no matches', async () => {
      const user = userEvent.setup();
      render(<SpecialtyDropdown {...defaultProps} />);

      fireEvent.click(screen.getByRole('button'));

      const searchInput = await screen.findByPlaceholderText('search.searchSpecialties');
      await user.type(searchInput, 'nonexistent');

      await waitFor(() => {
        expect(screen.getByText('common.noResults')).toBeInTheDocument();
      });
    });
  });

  describe('Specialty selection', () => {
    it('renders all specialties as FilterTags when dropdown is open', async () => {
      render(<SpecialtyDropdown {...defaultProps} />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const allSpecialties = Object.values(LawyerSpecialty);
        allSpecialties.forEach((specialty) => {
          expect(screen.getByText(`specialties.${specialty}`)).toBeInTheDocument();
        });
      });
    });

    it('calls onSpecialtiesChange when a specialty is clicked', async () => {
      render(<SpecialtyDropdown {...defaultProps} />);
      fireEvent.click(screen.getByRole('button'));

      const firstSpecialty = await screen.findByText('specialties.CRIMINAL');
      fireEvent.click(firstSpecialty);

      expect(defaultProps.onSpecialtiesChange).toHaveBeenCalledWith(['CRIMINAL']);
    });

    it('adds specialty to selection when clicked', async () => {
      const { rerender } = render(<SpecialtyDropdown {...defaultProps} />);
      fireEvent.click(screen.getByRole('button'));

      const criminalSpecialty = await screen.findByText('specialties.CRIMINAL');
      fireEvent.click(criminalSpecialty);

      expect(defaultProps.onSpecialtiesChange).toHaveBeenCalledWith(['CRIMINAL']);

      // Simulate parent component updating the prop
      rerender(
        <SpecialtyDropdown
          {...defaultProps}
          selectedSpecialties={['CRIMINAL']}
        />
      );

      expect(screen.getByText('1 search.specialties')).toBeInTheDocument();
    });

    it('removes specialty from selection when clicked again', async () => {
      render(<SpecialtyDropdown {...defaultProps} selectedSpecialties={['CRIMINAL']} />);
      fireEvent.click(screen.getByRole('button'));

      const criminalSpecialty = await screen.findByText('specialties.CRIMINAL');
      fireEvent.click(criminalSpecialty);

      expect(defaultProps.onSpecialtiesChange).toHaveBeenCalledWith([]);
    });

    it('handles multiple specialty selections', async () => {
      const { rerender } = render(<SpecialtyDropdown {...defaultProps} />);
      fireEvent.click(screen.getByRole('button'));

      const criminalSpecialty = await screen.findByText('specialties.CRIMINAL');
      fireEvent.click(criminalSpecialty);

      expect(defaultProps.onSpecialtiesChange).toHaveBeenCalledWith(['CRIMINAL']);

      rerender(
        <SpecialtyDropdown
          {...defaultProps}
          selectedSpecialties={['CRIMINAL']}
        />
      );

      const civilSpecialty = screen.getByText('specialties.CIVIL');
      fireEvent.click(civilSpecialty);

      expect(defaultProps.onSpecialtiesChange).toHaveBeenCalledWith(['CRIMINAL', 'CIVIL']);
    });
  });

  describe('Clear All functionality', () => {
    it('does not show Clear All button when no specialties selected', async () => {
      render(<SpecialtyDropdown {...defaultProps} />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.queryByText('search.clearAll')).not.toBeInTheDocument();
      });
    });

    it('shows Clear All button when specialties are selected', async () => {
      render(<SpecialtyDropdown {...defaultProps} selectedSpecialties={['CRIMINAL']} />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('search.clearAll')).toBeInTheDocument();
      });
    });

    it('clears all selections when Clear All is clicked', async () => {
      render(<SpecialtyDropdown {...defaultProps} selectedSpecialties={['CRIMINAL', 'CIVIL']} />);
      fireEvent.click(screen.getByRole('button'));

      const clearAllButton = await screen.findByText('search.clearAll');
      fireEvent.click(clearAllButton);

      expect(defaultProps.onSpecialtiesChange).toHaveBeenCalledWith([]);
    });

    it('Clear All button has X icon', async () => {
      const { container } = render(<SpecialtyDropdown {...defaultProps} selectedSpecialties={['CRIMINAL']} />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const clearAllButton = screen.getByText('search.clearAll').closest('button');
        const icon = clearAllButton?.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe('Click outside to close', () => {
    it('closes dropdown when clicking outside', async () => {
      render(
        <div>
          <div data-testid="outside">Outside element</div>
          <SpecialtyDropdown {...defaultProps} />
        </div>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('search.searchSpecialties')).toBeInTheDocument();
      });

      const outsideElement = screen.getByTestId('outside');
      fireEvent.mouseDown(outsideElement);

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('search.searchSpecialties')).not.toBeInTheDocument();
      });
    });

    it('does not close when clicking inside dropdown', async () => {
      render(<SpecialtyDropdown {...defaultProps} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const searchInput = await screen.findByPlaceholderText('search.searchSpecialties');
      fireEvent.mouseDown(searchInput);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('search.searchSpecialties')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('button has proper type attribute', () => {
      render(<SpecialtyDropdown {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('maintains focus management when dropdown opens', async () => {
      render(<SpecialtyDropdown {...defaultProps} />);
      const button = screen.getByRole('button');

      button.focus();
      expect(button).toHaveFocus();

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('search.searchSpecialties')).toBeInTheDocument();
      });
    });
  });
});
