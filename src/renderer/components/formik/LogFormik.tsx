import { Formik } from "formik";
import { RefObject, useState } from "react";
import { dataid } from "../../utilities/dataid";
import { ItemInterface } from "../../data/interfaces/ItemInterface";
import { ItemTypeEnum } from "../../data/interfaces/ItemTypeEnum";
import { yupItemSchema } from "../../data/yup/YupItemSchema";
import LogForm from "../form/LogForm";

export interface LogFormProps {
  item: ItemInterface | null;
  onSubmit: (item: ItemInterface) => void;
  onDelete?: (item: ItemInterface | null) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function LogFormik(props: LogFormProps) {
  const isEditing = props.item?.id != null;
  const thisItemId = props.item?.id ?? dataid();

  const initialLogValue = {
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
  }

  const [initialValuesState] = useState<ItemInterface>(initialLogValue);

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
            onPaste={onPaste}
            firstInputFieldRef={props.firstInputFieldRef}
            onDelete={props.onDelete}
            isEditing={isEditing}
            onChangeType={(isLog) => {
              if (isLog) {
                formikProps.setFieldValue("name", "log");
              } else {
                formikProps.setFieldValue("name", "");
              }
            }}
          />
        );
      }}
    />
  );
}
