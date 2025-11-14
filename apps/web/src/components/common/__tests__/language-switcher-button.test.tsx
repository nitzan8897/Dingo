import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcherButton from '../language-switcher-button';

describe('LanguageSwitcherButton', () => {
  it('renders button with aria-label', () => {
    render(
      <LanguageSwitcherButton isOpen={false} onClick={jest.fn()} ariaLabel="Switch language" />
    );

    const button = screen.getByLabelText('Switch language');
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(
      <LanguageSwitcherButton isOpen={false} onClick={onClick} ariaLabel="Switch language" />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('sets aria-expanded to true when isOpen is true', () => {
    render(
      <LanguageSwitcherButton isOpen={true} onClick={jest.fn()} ariaLabel="Switch language" />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-expanded to false when isOpen is false', () => {
    render(
      <LanguageSwitcherButton isOpen={false} onClick={jest.fn()} ariaLabel="Switch language" />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('has aria-haspopup attribute', () => {
    render(
      <LanguageSwitcherButton isOpen={false} onClick={jest.fn()} ariaLabel="Switch language" />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-haspopup', 'true');
  });

  it('renders globe icon', () => {
    const { container } = render(
      <LanguageSwitcherButton isOpen={false} onClick={jest.fn()} ariaLabel="Switch language" />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
