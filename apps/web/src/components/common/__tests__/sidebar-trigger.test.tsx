import { render, screen, fireEvent } from '@testing-library/react';
import SidebarTrigger from '../sidebar-trigger';

describe('SidebarTrigger', () => {
  it('should render the button with correct aria-label', () => {
    const mockOnClick = jest.fn();
    render(<SidebarTrigger onClick={mockOnClick} aria-label="Open menu" />);

    const button = screen.getByRole('button', { name: 'Open menu' });
    expect(button).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<SidebarTrigger onClick={mockOnClick} aria-label="Open menu" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should have fixed positioning classes', () => {
    const mockOnClick = jest.fn();
    render(<SidebarTrigger onClick={mockOnClick} aria-label="Open menu" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('fixed', 'top-4', 'right-4');
  });
});
