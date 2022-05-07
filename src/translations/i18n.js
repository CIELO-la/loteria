import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ui_en from "./en/ui.json";
import ui_es from "./es/ui.json";

const resources = {
  es: {
    translation: ui_es,
  },
  en: {
    translation: ui_en,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "es", // Default language
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
