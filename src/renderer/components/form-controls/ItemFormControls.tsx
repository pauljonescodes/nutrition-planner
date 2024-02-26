import { FormikProps } from 'formik';
import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { useCurrencyLocalStorage } from '../../utilities/useLocalStorageKey';
import { ValidatedFormikControl } from './ValidatedFormikControl';
import { ValidatedFormikNumberControl } from './ValidatedFormikNumberControl';

export default function ItemFormControls(props: {
  formikProps: FormikProps<ItemInterface>;
  onPaste: (text: string) => Promise<void>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
}) {
  const { formikProps, onPaste, firstInputFieldRef } = props;

  const { t } = useTranslation();

  const [currencyLocalStorage] = useCurrencyLocalStorage();
  const currencyDenominator = currencyLocalStorage === 'JPY' ? 1 : 100;

  return (
    <>
      <ValidatedFormikControl
        isRequired
        value={formikProps.values.name}
        error={formikProps.errors.name}
        name="name"
        placeholder={t('name')}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
        inputFieldRef={firstInputFieldRef}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={
          formikProps.values.priceCents
            ? formikProps.values.priceCents / currencyDenominator
            : undefined
        }
        error={formikProps.errors.priceCents}
        name="priceCents"
        placeholder={t('price')}
        transform={(value) => value * 100}
        format={(value) => (value ?? 0) / currencyDenominator}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.count}
        error={formikProps.errors.count}
        name="count"
        placeholder={t('servings')}
        helperText={t('servingsHelperText')}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
        onPaste={onPaste}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.massGrams}
        error={formikProps.errors.massGrams}
        name="massGrams"
        placeholder={`${t('mass')} (${t('massG')})`}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.energyKilocalories}
        error={formikProps.errors.energyKilocalories}
        name="energyKilocalories"
        placeholder={`${t('energy')} (${t('kcal')})`}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.fatGrams}
        error={formikProps.errors.fatGrams}
        name="fatGrams"
        placeholder={`${t('fat')} (${t('massG')})`}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.saturatedFatGrams}
        error={formikProps.errors.saturatedFatGrams}
        name="saturatedFatGrams"
        placeholder={`${t('saturatedFat')} (${t('massG')})`}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.transFatGrams}
        error={formikProps.errors.transFatGrams}
        name="transFatGrams"
        placeholder={`${t('transFat')} (${t('massG')})`}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.cholesterolMilligrams}
        error={formikProps.errors.cholesterolMilligrams}
        name="cholesterolMilligrams"
        placeholder={`${t('cholesterol')} (${t('mgMilligrams')})`}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.sodiumMilligrams}
        error={formikProps.errors.sodiumMilligrams}
        name="sodiumMilligrams"
        placeholder={`${t('sodium')} (${t('mgMilligrams')})`}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.carbohydrateGrams}
        error={formikProps.errors.carbohydrateGrams}
        name="carbohydrateGrams"
        placeholder={`${t('carbohydrate')} (${t('massG')})`}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.fiberGrams}
        error={formikProps.errors.fiberGrams}
        name="fiberGrams"
        placeholder={`${t('fiber')} (${t('massG')})`}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.sugarGrams}
        error={formikProps.errors.sugarGrams}
        name="sugarGrams"
        placeholder={`${t('sugar')} (${t('massG')})`}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.proteinGrams}
        error={formikProps.errors.proteinGrams}
        name="proteinGrams"
        placeholder={`${t('protein')} (${t('massG')})`}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
    </>
  );
}
