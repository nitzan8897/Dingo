import { getDirection, type Locale, locales, defaultLocale, getLocaleMessages } from '../index';

describe('i18n utilities', () => {
  it('should export locales array', () => {
    expect(locales).toBeDefined();
    expect(Array.isArray(locales)).toBe(true);
    expect(locales).toContain('he');
    expect(locales).toContain('en');
  });

  it('should export defaultLocale', () => {
    expect(defaultLocale).toBe('he');
  });

  it('should get correct direction for locales', () => {
    expect(getDirection('he')).toBe('rtl');
    expect(getDirection('en')).toBe('ltr');
  });

  it('should have Locale type with he and en', () => {
    const heLocale: Locale = 'he';
    const enLocale: Locale = 'en';
    expect(heLocale).toBe('he');
    expect(enLocale).toBe('en');
  });

  describe('getLocaleMessages', () => {
    it('should dynamically load Hebrew messages', async () => {
      const messages = await getLocaleMessages('he');
      expect(messages).toBeDefined();
      expect(typeof messages).toBe('object');
      expect(messages.common).toBeDefined();
      expect(messages.common.appName).toBe('דינגו');
    });

    it('should dynamically load English messages', async () => {
      const messages = await getLocaleMessages('en');
      expect(messages).toBeDefined();
      expect(typeof messages).toBe('object');
      expect(messages.common).toBeDefined();
      expect(messages.common.appName).toBe('Dingo');
    });

    it('should return empty object for invalid locale', async () => {
      const messages = await getLocaleMessages('invalid' as Locale);
      expect(messages).toEqual({});
    });
  });
});