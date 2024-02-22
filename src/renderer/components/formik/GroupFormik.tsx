import { Formik } from 'formik';
import { RefObject } from 'react';
import { dataid } from '../../utilities/dataid';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../../data/interfaces/ItemTypeEnum';
import { yupItemSchema } from '../../data/yup/YupItemSchema';

import GroupForm from '../form/GroupForm';

export interface GroupFormikProps {
  item: ItemInterface | null;
  onSubmit: (item: ItemInterface) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function GroupFormik(props: GroupFormikProps) {
  const { item, onSubmit, firstInputFieldRef } = props;

  const thisItemId = item?.id ?? dataid();

  return (
    <Formik<ItemInterface>
      initialValues={{
        ...yupItemSchema.getDefault(),
        id: thisItemId,
        type: ItemTypeEnum.group,
        name: item?.name,
        date: item?.date ?? new Date().toISOString(),
        priceCents: 0,
        count: item?.count,
        massGrams: 0,
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
      }}
      validationSchema={yupItemSchema}
      onSubmit={(values, helpers) => {
        onSubmit(values);
        helpers.resetForm();
      }}
      validateOnChange={false}
      validateOnBlur={false}
      // eslint-disable-next-line react/no-unstable-nested-components
      component={(formikProps) => {
        return (
          <GroupForm
            formikProps={formikProps}
            firstInputFieldRef={firstInputFieldRef}
          />
        );
      }}
    />
  );
}
