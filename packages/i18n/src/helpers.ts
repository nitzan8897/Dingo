import { Locale } from './index';

/**
 * Get the appropriate lawyer name based on locale
 * Defaults to Hebrew for unsupported locales
 */
export function getLawyerName(
  fullNameEn: string,
  fullNameHe: string,
  locale: Locale | string
): string {
  return locale === 'en' ? fullNameEn : fullNameHe;
}
