export const locales = ['he', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'he';

// Direction for each locale
export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'he' ? 'rtl' : 'ltr';
}

// Load translations for a given locale
export function getTranslations(locale: Locale): Record<string, any> {
  try {
    return require(`../locales/${locale}.json`);
  } catch (error) {
    console.warn(`Failed to load translations for locale: ${locale}`);
    return {};
  }
}

export { default as he } from '../locales/he.json';
export { default as en } from '../locales/en.json';