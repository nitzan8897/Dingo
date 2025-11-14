'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { locales, type Locale } from '@dingo/i18n';
import LanguageSwitcherButton from './language-switcher-button';
import LanguageDropdown from './language-dropdown';

/**
 * LanguageSwitcher component
 * Allows users to switch between supported languages via a dropdown menu
 */
const LanguageSwitcher: React.FC = () => {
  const t = useTranslations('language');
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = params.locale as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const switchLanguage = (newLocale: Locale): void => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    // Replace the locale in the pathname
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef} dir="ltr">
      <LanguageSwitcherButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        ariaLabel={t('switchLanguage')}
      />

      {isOpen && (
        <LanguageDropdown
          locales={locales}
          currentLocale={currentLocale}
          onLanguageSelect={switchLanguage}
          getLocaleName={(locale) => t(locale)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;