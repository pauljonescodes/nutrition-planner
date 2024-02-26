import { useColorMode } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from 'usehooks-ts';
import { useLanguageLocalStorage } from './utilities/useLocalStorageKey';

export function Configuration() {
  const { isDarkMode } = useDarkMode();
  const { setColorMode } = useColorMode();
  const { i18n } = useTranslation();
  const [languageLocalStorage] = useLanguageLocalStorage();

  useEffect(() => {
    setColorMode(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, setColorMode]);

  useEffect(() => {
    i18n.changeLanguage(languageLocalStorage);
  }, [languageLocalStorage, i18n]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}
