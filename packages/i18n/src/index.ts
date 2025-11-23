export { LocaleSchema } from './locale-schema';
export { en } from './locales/en';
export { he } from './locales/he';

export const locales = ['he', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'he';

// Direction for each locale
export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'he' ? 'rtl' : 'ltr';
}

// Dynamically load locale messages - now supports both JSON and TS
export async function getLocaleMessages(locale: Locale): Promise<Record<string, any>> {
  try {
    // Try TypeScript imports first
    const tsMessages = await import(`./locales/${locale}`);
    if (tsMessages && tsMessages[locale]) {
      return tsMessages[locale];
    }
    // Fallback to JSON
    const messages = await import(`../locales/${locale}.json`);
    return messages.default || messages;
  } catch (error) {
    console.warn(`Failed to load messages for locale: ${locale}`);
    return {};
  }
}

// Export helpers
export * from './helpers';