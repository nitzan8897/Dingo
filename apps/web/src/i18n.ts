import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale, getLocaleMessages } from '@dingo/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'he';
  }

  // Dynamically load messages for the locale
  const messages = await getLocaleMessages(locale as Locale);

  return {
    locale,
    messages,
  };
});