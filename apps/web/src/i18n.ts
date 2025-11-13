import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale, he, en } from '@dingo/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'he';
  }

  // Load messages based on locale
  const messages = locale === 'he' ? he : en;

  return {
    locale,
    messages,
  };
});