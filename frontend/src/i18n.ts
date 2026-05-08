import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en, fi } from '@helios/shared';

export const defaultNS = 'translation';

export const resources = {
  en: {
    translation: en
  },
  fi: {
    translation: fi
  }
} as const;

i18n
  .use(initReactI18next)
  .init({
    defaultNS,
    resources,

    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
