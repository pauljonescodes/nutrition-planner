import { Dispatch, SetStateAction } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { getDefaultCurrency } from '../i18n/currencies';
import { getDefaultLanguage } from '../i18n/languages';

export enum LocalStorageKeysEnum {
  language = 'nutrition-planner-language',
  currency = 'nutrition-planner-currency',
  sex = 'nutrition-planner-sex',
  couchdbUrl = 'nutrition-planner-couchdb-url',
  birthday = 'nustrition-planner-birthday',
  weightKilograms = 'nutrition-planner-weight',
  heightCentimeters = 'nutrition-planner-height',
  goalWeightKilograms = 'nutrition-planner-goal-weight',
  goalDate = 'nutrition-planner-goal-date',
  dietaryFatPercent = 'nutrition-planner-fat-target',
  dietaryCarbohydratePercent = 'nutrition-planner-carbohydrate-target',
  dietaryProteinPercent = 'nutrition-planner-protein-target',
  physicalActivityLevelNumber = 'nutrition-planner-physical-activity-level',
  logViewState = 'nutrition-planner-log-view-state',
}

export const useLanguageLocalStorage = (): [
  string,
  Dispatch<SetStateAction<string>>,
] => {
  const [languageLocalStorage, setLanguageLocalStorage] = useLocalStorage(
    LocalStorageKeysEnum.language,
    getDefaultLanguage(),
  );

  return [languageLocalStorage, setLanguageLocalStorage];
};

export const useCurrencyLocalStorage = (): [
  string,
  Dispatch<SetStateAction<string>>,
] => {
  const [currencyLocalStorage, setCurrencyLocalStorage] = useLocalStorage(
    LocalStorageKeysEnum.currency,
    getDefaultCurrency(),
  );

  return [currencyLocalStorage, setCurrencyLocalStorage];
};
