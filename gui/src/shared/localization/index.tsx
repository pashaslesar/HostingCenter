import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translation_en from "./translates/en.json";
import translation_cs from "./translates/cs.json";

const DEFAULT_LOACLE = "cs";
const LOCALES = ["cs", "en"];

const getNavigatorLocale = (locales: any) => {
  return navigator.languages.forEach(code => (locales.includes(code)) ? code : undefined)
};

const current_locale = window.localStorage.getItem('locale') || getNavigatorLocale(LOCALES) || DEFAULT_LOACLE;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translation_en },
	  cs: { translation: translation_cs }
  },
  lng: current_locale,
	fallbackLng: LOCALES
});

export default i18n;