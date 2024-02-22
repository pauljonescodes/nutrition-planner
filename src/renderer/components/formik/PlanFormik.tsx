import { Formik } from 'formik';
import { RefObject, useState } from 'react';
import { dataid } from '../../utilities/dataid';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../../data/interfaces/ItemTypeEnum';
import { yupItemSchema } from '../../data/yup/YupItemSchema';
import PlanForm from '../form/PlanForm';

export interface PlanFormProps {
  item: ItemInterface | null;
  onSubmit: (item: ItemInterface) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function PlanFormik(props: PlanFormProps) {
  const { item, onSubmit, firstInputFieldRef } = props;

  const thisItemId = item?.id ?? dataid();

  const [initialValuesState] = useState<ItemInterface>({
    ...yupItemSchema.getDefault(),
    id: thisItemId,
    type: ItemTypeEnum.plan,
    name: item?.name,
    date: item?.date ?? new Date().toISOString(),
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
  });

  return (
    <Formik<ItemInterface>
      enableReinitialize
      initialValues={{
        ...initialValuesState,
      }}
      validationSchema={yupItemSchema}
      onSubmit={(values, helpers) => {
        onSubmit({
          ...values,
        });
        helpers.resetForm();
      }}
      validateOnChange={false}
      validateOnBlur={false}
      // eslint-disable-next-line react/no-unstable-nested-components
      component={(formikProps) => {
        return (
          <PlanForm
            formikProps={formikProps}
            firstInputFieldRef={firstInputFieldRef}
          />
        );
      }}
    />
  );
}
