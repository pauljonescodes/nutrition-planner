import { Formik } from 'formik';
import { RefObject, useState } from 'react';
import { dataid } from '../../utilities/dataid';
import { parseNutritionDictionary } from '../../utilities/parseNutritionDictionary';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../../data/interfaces/ItemTypeEnum';
import { yupItemSchema } from '../../data/yup/YupItemSchema';
import ItemForm from '../form/ItemForm';

export interface ItemFormProps {
  item: ItemInterface | null;
  onSubmit: (item: ItemInterface) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function ItemFormik(props: ItemFormProps) {
  const { item, onSubmit, firstInputFieldRef } = props;
  const thisItemId = item?.id ?? dataid();

  const [initialValuesState, setInitialValuesState] = useState<ItemInterface>({
    id: thisItemId,
    type: ItemTypeEnum.item,
    date: item?.date ?? new Date().toISOString(),
    name: item?.name,
    priceCents: item?.priceCents,
    massGrams: item?.massGrams,
    count: item?.count,
    energyKilocalories: item?.energyKilocalories,
    fatGrams: item?.fatGrams,
    saturatedFatGrams: item?.saturatedFatGrams,
    transFatGrams: item?.transFatGrams,
    cholesterolMilligrams: item?.cholesterolMilligrams,
    sodiumMilligrams: item?.sodiumMilligrams,
    carbohydrateGrams: item?.carbohydrateGrams,
    fiberGrams: item?.fiberGrams,
    sugarGrams: item?.sugarGrams,
    proteinGrams: item?.proteinGrams,
    subitems: [],
  });

  return (
    <Formik<ItemInterface>
      enableReinitialize
      initialValues={{
        ...initialValuesState,
      }}
      validationSchema={yupItemSchema}
      onSubmit={async (values, helpers) => {
        onSubmit(values);
        helpers.resetForm();
      }}
      validateOnChange={false}
      validateOnBlur={false}
      component={(formikProps) => {
        async function onPaste(text: string) {
          const parsedNutritionDictionary: { [key: string]: number } =
            parseNutritionDictionary(text);

          setInitialValuesState({
            ...initialValuesState,
            ...formikProps.values,
            ...parsedNutritionDictionary,
          });
          formikProps.resetForm({
            values: {
              ...initialValuesState,
              ...formikProps.values,
              ...parsedNutritionDictionary,
            },
          });
        }

        return (
          <ItemForm
            onPaste={onPaste}
            firstInputFieldRef={firstInputFieldRef}
            formikProps={formikProps}
          />
        );
      }}
    />
  );
}
