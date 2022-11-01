import { Formik } from "formik";
import { RefObject, useState } from "react";
import { dataid } from "../../data/dataid";
import { ItemTypeEnum } from "../../data/ItemTypeEnum";
import { ItemInferredType, yupItemSchema } from "../../data/yup/item";
import PlanForm from "../form/PlanForm";

export interface PlanFormProps {
  item: Partial<ItemInferredType> | null;
  onSubmit: (item: Partial<ItemInferredType>) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function PlanFormik(props: PlanFormProps) {
  const thisItemId = props.item?.id ?? dataid();

  const [initialValuesState] = useState<Partial<ItemInferredType>>({
    ...yupItemSchema.getDefault(),
    id: thisItemId,
    type: ItemTypeEnum.plan,
    name: props.item?.name,
    massGrams: 0,
    count: 0,
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
    <Formik<Partial<ItemInferredType>>
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
