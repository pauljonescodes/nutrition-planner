import { Formik } from "formik";
import { RefObject } from "react";
import { dataid } from "../../data/dataid";
import { ItemInterface } from "../../data/interfaces";
import { ItemTypeEnum } from "../../data/item-type-enum";
import { yupItemSchema } from "../../data/yup-schema";

import GroupForm from "../form/GroupForm";

export interface GroupFormikProps {
  item: ItemInterface | null;
  onSubmit: (item: ItemInterface) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function GroupFormik(props: GroupFormikProps) {
  const thisItemId = props.item?.id ?? dataid();

  return (
    <Formik<ItemInterface>
      initialValues={{
        ...yupItemSchema.getDefault(),
        id: thisItemId,
        type: ItemTypeEnum.group,
        name: props.item?.name,
        date: props.item?.date ?? new Date().toISOString(),
        priceCents: 0,
        count: props.item?.count,
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
        subitems: props.item?.subitems ?? [{ count: 1, itemId: undefined }],
      }}
      validationSchema={yupItemSchema}
      onSubmit={(values, helpers) => {
        props.onSubmit(values);
        helpers.resetForm();
      }}
      validateOnChange={false}
      validateOnBlur={false}
      component={(formikProps) => {
        return (
          <GroupForm
            formikProps={formikProps}
            firstInputFieldRef={props.firstInputFieldRef}
          />
        );
      }}
    />
  );
}