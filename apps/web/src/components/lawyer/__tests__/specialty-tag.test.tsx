import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SpecialtyTag from '../specialty-tag';

describe('SpecialtyTag', () => {
  it('renders specialty name', () => {
    render(<SpecialtyTag specialty="Criminal Law" />);
    expect(screen.getByText('Criminal Law')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<SpecialtyTag specialty="Criminal Law" onClick={onClick} />);

    const tag = screen.getByText('Criminal Law');
    fireEvent.click(tag);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not have cursor pointer when onClick is not provided', () => {
    const { container } = render(<SpecialtyTag specialty="Criminal Law" />);
    const tag = container.firstChild as HTMLElement;

    expect(tag).not.toHaveClass('cursor-pointer');
  });

  it('has cursor pointer when onClick is provided', () => {
    const onClick = jest.fn();
    const { container } = render(<SpecialtyTag specialty="Criminal Law" onClick={onClick} />);
    const tag = container.firstChild as HTMLElement;

    expect(tag).toHaveClass('cursor-pointer');
  });
});
