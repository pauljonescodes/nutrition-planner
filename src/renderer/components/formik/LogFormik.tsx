import { Formik } from 'formik';
import { RefObject, useState } from 'react';
import moment from 'moment';
import { dataid } from '../../utilities/dataid';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../../data/interfaces/ItemTypeEnum';
import { yupItemSchema } from '../../data/yup/YupItemSchema';
import { parseNutritionDictionary } from '../../utilities/parseNutritionDictionary';
import LogForm from '../form/LogForm';

export interface LogFormProps {
  item: ItemInterface | null;
  onSubmit: (item: ItemInterface) => void;
  onDelete?: (item: ItemInterface | null) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function LogFormik(props: LogFormProps) {
  const { item, onSubmit, onDelete, firstInputFieldRef } = props;

  const isEditing = item?.id != null;
  const thisItemId = item?.id ?? dataid();

  const initialLogValue = {
    ...yupItemSchema.getDefault(),
    id: thisItemId,
    type: ItemTypeEnum.log,
    date: item?.date ?? new Date().toISOString(),
    name: item?.name ?? `log`,
    massGrams: 0,
    count: 1,
    priceCents: 0,
    energyKilocalories: 0,
    fatGrams: 0,
    saturatedFatGrams: 0,
    transFatGrams: 0,
    cholesterolMilligrams: 0,
    sodiumMilligrams: 0,
    carbohydrateGrams: 0,
    fiberGrams: 0,
    sugarGrams: 0,
    proteinGrams: 0,
    subitems: item?.subitems ?? [{ count: 1, itemId: undefined }],
  };

  const [initialValuesState, setInitialValuesState] =
    useState<ItemInterface>(initialLogValue);

  return (
    <Formik<ItemInterface>
      enableReinitialize
      initialValues={{
        ...initialValuesState,
      }}
      validationSchema={yupItemSchema}
      onSubmit={(values, helpers) => {
        const dateString = values.date?.toString() ?? undefined;
        console.log(dateString);
        if (moment(dateString, [moment.ISO_8601], true).isValid()) {
          onSubmit({
            ...values,
          });
          helpers.resetForm();
        } else {
          helpers.setErrors({ date: 'Invalid date' });
          helpers.setSubmitting(false);
        }
      }}
      validateOnChange={false}
      validateOnBlur={false}
      // eslint-disable-next-line react/no-unstable-nested-components
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
          <LogForm
            formikProps={formikProps}
            // eslint-disable-next-line react/jsx-no-bind
            onPaste={onPaste}
            firstInputFieldRef={firstInputFieldRef}
            onDelete={onDelete}
            isEditing={isEditing}
            onChangeType={(isLog) => {
              if (isLog) {
                formikProps.setFieldValue('name', 'log');
              } else {
                formikProps.setFieldValue('name', '');
              }
            }}
          />
        );
      }}
    />
  );
}
