import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageDropdown from '../language-dropdown';

describe('LanguageDropdown', () => {
  const mockLocales = ['en', 'he'] as const;
  const mockGetLocaleName = (locale: string) => (locale === 'en' ? 'English' : 'עברית');
  const mockOnLanguageSelect = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all locale options', () => {
    render(
      <LanguageDropdown
        locales={mockLocales}
        currentLocale="en"
        onLanguageSelect={mockOnLanguageSelect}
        getLocaleName={mockGetLocaleName}
      />
    );

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('עברית')).toBeInTheDocument();
  });

  it('highlights current locale', () => {
    render(
      <LanguageDropdown
        locales={mockLocales}
        currentLocale="en"
        onLanguageSelect={mockOnLanguageSelect}
        getLocaleName={mockGetLocaleName}
      />
    );

    const englishButton = screen.getByText('English').closest('button');
    expect(englishButton).toHaveClass('bg-primary-600');
  });

  it('calls onLanguageSelect when locale is clicked', () => {
    render(
      <LanguageDropdown
        locales={mockLocales}
        currentLocale="en"
        onLanguageSelect={mockOnLanguageSelect}
        getLocaleName={mockGetLocaleName}
      />
    );

    const hebrewButton = screen.getByText('עברית');
    fireEvent.click(hebrewButton);

    expect(mockOnLanguageSelect).toHaveBeenCalledWith('he');
  });

  it('renders aria-label for each button', () => {
    render(
      <LanguageDropdown
        locales={mockLocales}
        currentLocale="en"
        onLanguageSelect={mockOnLanguageSelect}
        getLocaleName={mockGetLocaleName}
      />
    );

    expect(screen.getByLabelText('Switch to English')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to עברית')).toBeInTheDocument();
  });
});
