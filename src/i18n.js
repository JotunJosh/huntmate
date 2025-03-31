// 🌐 i18n (Internationalisierung) Setup für React
// i18n (internationalization) setup for React

import i18n from "i18next"; // 🎛️ Hauptbibliothek für Sprachverwaltung
import { initReactI18next } from "react-i18next"; // 🔁 Integration mit React

// 📥 Sprachdateien importieren
// Import language translation files
import translationDe from "./locales/de/translation.json";
import translationEn from "./locales/en/translation.json";
import translationFr from "./locales/fr/translation.json";

// 🔧 Initialisierung von i18n mit den Übersetzungen
// Initialize i18n with the loaded translation resources
i18n
  .use(initReactI18next) // 🔗 Bindet i18n an React
  .init({
    // 🌍 Unterstützte Sprachen und deren Übersetzungen
    // Supported languages and their resources
    resources: {
      de: { translation: translationDe },
      en: { translation: translationEn },
      fr: { translation: translationFr },
    },

    // 🌐 Standardsprache (z. B. beim ersten Laden der App)
    // Default language when app loads
    lng: "en",

    // 🆘 Fallback-Sprache, falls eine Übersetzung fehlt
    // Fallback language if translation key is missing
    fallbackLng: "de",

    // 🔒 Keine HTML-Escape nötig (React ist sicher bzgl. XSS)
    // No HTML escaping needed – React is safe by default
    interpolation: {
      escapeValue: false,
    },
  });

// 📤 Bereitstellen der i18n-Instanz für den Import
// Export i18n instance for use throughout the app
export default i18n;
