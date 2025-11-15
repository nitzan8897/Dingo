'use client';

import React from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { locales, type Locale } from '@dingo/i18n';
import { Globe } from 'lucide-react';
import { Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

/**
 * LanguageSwitcher component
 * Allows users to switch between supported languages via a dropdown menu
 * Now using shadcn/ui DropdownMenu for better accessibility and UX
 */
const LanguageSwitcher: React.FC = () => {
  const t = useTranslations('language');
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = params.locale as Locale;

  const switchLanguage = (newLocale: Locale): void => {
    if (newLocale === currentLocale) {
      return;
    }

    // Replace the locale in the pathname
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div dir="ltr">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('switchLanguage')}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => switchLanguage(locale)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>{t(locale)}</span>
              {currentLocale === locale && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSwitcher;