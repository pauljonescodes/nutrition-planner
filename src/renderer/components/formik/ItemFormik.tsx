import { Formik } from "formik";
import { RefObject, useState } from "react";
import { dataid } from "../../utilities/dataid";
import { ItemInterface } from "../../data/interfaces/ItemInterface";
import { ItemTypeEnum } from "../../data/interfaces/ItemTypeEnum";
import { yupItemSchema } from "../../data/yup/YupItemSchema";
import ItemForm from "../form/ItemForm";

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
          const regExps = [
            /(?:\()(?<massGrams>\d*\.?\d*)(?:g\))/gi,
            /(?:servings.*)(?<count>\d*\.?\d*)/gi,
            /(?<count>\d*\.?\d*)(?:.*servings)/gi,
            /(?:Calories\s*)(?<energyKilocalories>\d*\.?\d*)/gi,
            /(?:Total Fat\s*)(?<fatGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Saturated Fat\s*)(?<saturatedFatGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Trans Fat\s*)(?<transFatGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Cholesterol\s*)(?<cholesterolMilligrams>\d*\.?\d*)(?:mg)/gi,
            /(?:Sodium\s*)(?<sodiumMilligrams>\d*\.?\d*)(?:mg)/gi,
            /(?:Total Carbohydrate\s*)(?<carbohydrateGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Dietary Fiber\s*)(?<fiberGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Sugars\s*)(?<sugarGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Protein\s*)(?<proteinGrams>\d*\.?\d*)(?:g)/gi,
          ];

          const numberedGroups: { [key: string]: number } = {};
          for (const regExp of regExps) {
            const regExpMatchArray = regExp.exec(text);
            const matchedGroup = regExpMatchArray?.groups ?? {};
            Object.keys(matchedGroup).forEach(function (key) {
              numberedGroups[key] = +matchedGroup[key];
            });
          }

          setInitialValuesState({
            ...initialValuesState,
            ...formikProps.values,
            ...numberedGroups,
          });
          formikProps.resetForm({
            values: {
              ...initialValuesState,
              ...formikProps.values,
              ...numberedGroups,
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
