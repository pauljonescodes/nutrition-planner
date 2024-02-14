import { Formik } from "formik";
import { RefObject, useState } from "react";
import { dataid } from "../../data/dataid";
import { ItemInterface } from "../../data/interfaces";
import { ItemTypeEnum } from "../../data/item-type-enum";
import { yupItemSchema } from "../../data/yup-schema";
import LogForm from "../form/LogForm";

export interface LogFormProps {
  item: ItemInterface | null;
  onSubmit: (item: ItemInterface) => void;
  onDelete?: (item: ItemInterface | null) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function LogFormik(props: LogFormProps) {
  const thisItemId = props.item?.id ?? dataid();

  const [initialValuesState] = useState<ItemInterface>({
    ...yupItemSchema.getDefault(),
    id: thisItemId,
    type: ItemTypeEnum.log,
    date: props.item?.date ?? new Date().toISOString(),
    name: props.item?.name ?? `log`,
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
          name: values.date,
        });
        helpers.resetForm();
      }}
      validateOnChange={false}
      validateOnBlur={false}
      component={(formikProps) => {
        return (
          <LogForm
            formikProps={formikProps}
            firstInputFieldRef={props.firstInputFieldRef}
            onDelete={props.onDelete}
          />
        );
      }}
    />
  );
}
