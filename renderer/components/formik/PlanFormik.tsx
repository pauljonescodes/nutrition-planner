import { Formik } from "formik";
import { RefObject, useState } from "react";
import { dataid } from "../../data/dataid";
import { ItemInterface } from "../../data/interfaces";
import { ItemTypeEnum } from "../../data/item-type-enum";
import { yupItemSchema } from "../../data/yup-schema";
import PlanForm from "../form/PlanForm";

export interface PlanFormProps {
  item: ItemInterface | null;
  onSubmit: (item: ItemInterface) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function PlanFormik(props: PlanFormProps) {
  const thisItemId = props.item?.id ?? dataid();

  const [initialValuesState] = useState<ItemInterface>({
    ...yupItemSchema.getDefault(),
    id: thisItemId,
    type: ItemTypeEnum.plan,
    name: props.item?.name,
    date: props.item?.date ?? new Date(),
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
    subitems: props.item?.subitems ?? [{ count: 1, itemId: undefined }],
  });

  return (
    <Formik<ItemInterface>
      enableReinitialize
      initialValues={{
        ...initialValuesState,
      }}
      validationSchema={yupItemSchema}
      onSubmit={(values, helpers) => {
        props.onSubmit({
          ...values,
        });
        helpers.resetForm();
      }}
      validateOnChange={false}
      validateOnBlur={false}
      component={(formikProps) => {
        return (
          <PlanForm
            formikProps={formikProps}
            firstInputFieldRef={props.firstInputFieldRef}
          />
        );
      }}
    />
  );
}
