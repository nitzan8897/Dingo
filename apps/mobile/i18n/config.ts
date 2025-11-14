import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@dingo/i18n/locales/en.json';
import he from '@dingo/i18n/locales/he.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      he: { translation: he },
    },
    lng: 'he', // Default language (Hebrew)
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React Native already escapes values
    },
    compatibilityJSON: 'v3', // For i18next v21+
  });

export default i18n;
