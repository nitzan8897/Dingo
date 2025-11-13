export const locales = ['he', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'he';

// Direction for each locale
export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'he' ? 'rtl' : 'ltr';
}

// Dynamically load locale messages
export async function getLocaleMessages(locale: Locale): Promise<Record<string, any>> {
  try {
    const messages = await import(`../locales/${locale}.json`);
    return messages.default || messages;
  } catch (error) {
    console.warn(`Failed to load messages for locale: ${locale}`);
    return {};
  }
}