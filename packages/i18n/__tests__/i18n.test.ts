import { describe, it, expect } from 'vitest';
import { getTranslations, type Locale } from '../src/index';

describe('i18n utilities', () => {
  it('should export getTranslations function', () => {
    expect(getTranslations).toBeDefined();
    expect(typeof getTranslations).toBe('function');
  });

  it('should return translations for Hebrew locale', () => {
    const translations = getTranslations('he');
    expect(translations).toBeDefined();
    expect(typeof translations).toBe('object');
  });

  it('should return translations for English locale', () => {
    const translations = getTranslations('en');
    expect(translations).toBeDefined();
    expect(typeof translations).toBe('object');
  });

  it('should have Locale type with he and en', () => {
    const heLocale: Locale = 'he';
    const enLocale: Locale = 'en';
    expect(heLocale).toBe('he');
    expect(enLocale).toBe('en');
  });
});