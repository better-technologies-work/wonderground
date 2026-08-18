import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./locales/es/translation";
import en from "./locales/en/translation";
import it from "./locales/it/translation";
import fr from "./locales/fr/translation";
import de from "./locales/de/translation";
import pt from "./locales/pt/translation";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      it: { translation: it },
      fr: { translation: fr },
      de: { translation: de },
      pt: { translation: pt },
    },
    fallbackLng: "es",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "wg-lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
