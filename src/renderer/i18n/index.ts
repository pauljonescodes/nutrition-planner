import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LocalStorageKeysEnum } from "../constants"
import resources from "./resources";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", 
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;