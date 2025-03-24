import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationDe from "./locales/de/translation.json";
import translationEn from "./locales/en/translation.json";
import translationFr from "./locales/fr/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: translationDe },
    en: { translation: translationEn },
    fr: { translation: translationFr }
  },
  lng: "de",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;