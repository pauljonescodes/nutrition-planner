import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';
import { LocalStorageKeysEnum } from '../constants';

const useLanguageChange = () => {
  const { i18n } = useTranslation();
  const [languageLocalStorage] = useLocalStorage(
    LocalStorageKeysEnum.language,
    'en',
  );

  useEffect(() => {
    i18n.changeLanguage(languageLocalStorage);
  }, [languageLocalStorage, i18n]);
};

export default useLanguageChange;
