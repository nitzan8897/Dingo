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

/**
 * Generic function to get localized field value
 * Supports any object with locale-suffixed fields (e.g., fieldNameEn, fieldNameHe)
 * Defaults to Hebrew for unsupported locales
 *
 * @param obj - The object containing localized fields
 * @param fieldName - The base field name (without locale suffix)
 * @param locale - The current locale
 * @returns The localized field value
 *
 * @example
 * const lawyer = { fullNameEn: 'John Doe', fullNameHe: 'ג\'ון דו' };
 * getLocalizedField(lawyer, 'fullName', 'en') // Returns 'John Doe'
 *
 * const city = { nameEn: 'Tel Aviv', nameHe: 'תל אביב' };
 * getLocalizedField(city, 'name', 'he') // Returns 'תל אביב'
 */
export function getLocalizedField<T extends Record<string, any>>(
  obj: T,
  fieldName: string,
  locale: Locale | string
): string {
  const localeSuffix = locale === 'en' ? 'En' : 'He';
  const fieldKey = `${fieldName}${localeSuffix}` as keyof T;
  return obj[fieldKey] as string;
}
