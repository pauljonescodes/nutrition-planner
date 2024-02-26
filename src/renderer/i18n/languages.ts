const languages = ['ar', 'cmn', 'en', 'es', 'fr', 'hi'];

const languageNames = {
  ar: 'العربية', // Arabic
  cmn: '普通话', // Mandarin Chinese
  en: 'English', // English
  es: 'Español', // Spanish
  fr: 'Français', // French
  hi: 'हिन्दी', // Hindi
};

const getDefaultLanguage = () => {
  const language = navigator.language.split('-')[0];
  return languages.includes(language) ? language : 'en';
};

export { getDefaultLanguage, languageNames, languages };
