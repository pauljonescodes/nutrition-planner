import { Formik } from "formik";
import { RefObject } from "react";
import { dataid } from "../../data/dataid";
import { ItemTypeEnum } from "../../data/ItemTypeEnum";
import { ItemInferredType, yupItemSchema } from "../../data/yup/item";
import RecipeForm from "../form/RecipeForm";

export interface RecipeFormProps {
  item: Partial<ItemInferredType> | null;
  onSubmit: (item: Partial<ItemInferredType>) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function RecipeFormik(props: RecipeFormProps) {
  const thisItemId = props.item?.id ?? dataid();

  return (
    <Formik<Partial<ItemInferredType>>
      initialValues={{
        ...yupItemSchema.getDefault(),
        id: thisItemId,
        type: ItemTypeEnum.recipe,
        name: props.item?.name,
        priceCents: 0,
        massGrams: 0,
        count: props.item?.count,
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
          <RecipeForm
            formikProps={formikProps}
            firstInputFieldRef={props.firstInputFieldRef}
          />
        );
      }}
    />
  );
}
