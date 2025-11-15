import React from 'react';
import { type Locale } from '@dingo/i18n';

interface LanguageDropdownProps {
  locales: readonly Locale[];
  currentLocale: Locale;
  onLanguageSelect: (locale: Locale) => void;
  getLocaleName: (locale: Locale) => string;
}

/**
 * Dropdown menu for language selection
 */
const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  locales,
  currentLocale,
  onLanguageSelect,
  getLocaleName,
}) => {
  return (
    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => onLanguageSelect(locale)}
          className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
            locale === currentLocale
              ? 'bg-primary-600 dark:bg-primary-500 text-white'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label={`Switch to ${getLocaleName(locale)}`}
        >
          {getLocaleName(locale)}
        </button>
      ))}
    </div>
  );
};

export default LanguageDropdown;
