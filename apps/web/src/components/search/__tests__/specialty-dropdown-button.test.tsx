import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SpecialtyDropdownButton from '../specialty-dropdown-button';

describe('SpecialtyDropdownButton', () => {
  const defaultProps = {
    isOpen: false,
    selectedCount: 0,
    onClick: jest.fn(),
    chooseText: 'Choose Specialties',
    specialtiesText: 'Specialties',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder text when no specialties selected', () => {
    render(<SpecialtyDropdownButton {...defaultProps} />);
    expect(screen.getByText('Choose Specialties')).toBeInTheDocument();
  });

  it('shows count when specialties are selected', () => {
    render(<SpecialtyDropdownButton {...defaultProps} selectedCount={2} />);
    expect(screen.getByText('2 Specialties')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<SpecialtyDropdownButton {...defaultProps} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('rotates chevron icon when dropdown is open', () => {
    const { container, rerender } = render(<SpecialtyDropdownButton {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toHaveClass('rotate-180');

    rerender(<SpecialtyDropdownButton {...defaultProps} isOpen={true} />);
    expect(svg).toHaveClass('rotate-180');
  });

  it('has proper button type attribute', () => {
    render(<SpecialtyDropdownButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
