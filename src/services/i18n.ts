import { createInstance } from 'i18next';

import englishTranslations from '../i18n/language.en.json';

export function loadInternationalisation() {
  const i18n = createInstance();
  i18n
    .init({
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
    })
    .catch((e: unknown) => {
      console.log('unable to load expected translations: ', e);
    });
  i18n.addResourceBundle('en', 'ttrpg', englishTranslations);
  return i18n;
}
