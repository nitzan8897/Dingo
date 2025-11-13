'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { locales, type Locale } from '@dingo/i18n';

/**
 * LanguageSwitcher component
 * Allows users to switch between supported languages
 */
const LanguageSwitcher: React.FC = () => {
  const t = useTranslations('language');
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = params.locale as Locale;

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Replace the locale in the pathname
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-2" dir="ltr">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLanguage(locale)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            locale === currentLocale
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          aria-label={`Switch to ${t(locale)}`}
        >
          {t(locale)}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;