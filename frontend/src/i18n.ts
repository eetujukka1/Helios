import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en, fi } from '@helios/shared';

export const defaultNS = 'translation';
export const LANGUAGE_STORAGE_KEY = 'helios-language';
export const supportedLanguages = ['en', 'fi'] as const;
export type AppLanguage = (typeof supportedLanguages)[number];

export const resources = {
  en: {
    translation: en
  },
  fi: {
    translation: fi
  }
} as const;

function isSupportedLanguage(language: string): language is AppLanguage {
  return supportedLanguages.includes(language as AppLanguage);
}

function resolveInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && isSupportedLanguage(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguage = window.navigator.language.split('-')[0];
  if (isSupportedLanguage(browserLanguage)) {
    return browserLanguage;
  }

  return 'en';
}

i18n
  .use(initReactI18next)
  .init({
    defaultNS,
    resources,

    lng: resolveInitialLanguage(),
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,

    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (language) => {
  const normalizedLanguage = language.split('-')[0];
  if (typeof window !== 'undefined' && isSupportedLanguage(normalizedLanguage)) {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
  }
});

export default i18n;
