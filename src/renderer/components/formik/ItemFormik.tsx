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
  const thisItemId = props.item?.id ?? dataid();

  const [initialValuesState, setInitialValuesState] = useState<ItemInterface>({
    id: thisItemId,
    type: ItemTypeEnum.item,
    date: props.item?.date ?? new Date().toISOString(),
    name: props.item?.name,
    priceCents: props.item?.priceCents,
    massGrams: props.item?.massGrams,
    count: props.item?.count,
    energyKilocalories: props.item?.energyKilocalories,
    fatGrams: props.item?.fatGrams,
    saturatedFatGrams: props.item?.saturatedFatGrams,
    transFatGrams: props.item?.transFatGrams,
    cholesterolMilligrams: props.item?.cholesterolMilligrams,
    sodiumMilligrams: props.item?.sodiumMilligrams,
    carbohydrateGrams: props.item?.carbohydrateGrams,
    fiberGrams: props.item?.fiberGrams,
    sugarGrams: props.item?.sugarGrams,
    proteinGrams: props.item?.proteinGrams,
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
        props.onSubmit(values);
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
            firstInputFieldRef={props.firstInputFieldRef}
            formikProps={formikProps}
          />
        );
      }}
    />
  );
}
