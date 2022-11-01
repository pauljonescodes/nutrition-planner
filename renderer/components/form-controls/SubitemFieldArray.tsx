import { FieldArray, FormikProps } from "formik";
import { ItemTypeEnum } from "../../data/ItemTypeEnum";
import { NutritionInfo } from "../../data/nutrition-info";
import { ItemInferredType, yupItemSchema } from "../../data/yup/item";
import { SubitemField } from "./SubitemField";

interface SubitemFieldArrayProps {
  formikProps: FormikProps<Partial<ItemInferredType>>;
  itemTypesIn: Array<ItemTypeEnum>;
  calculatedNutritionInfoMap: Map<string, NutritionInfo> | null;
  calculatedPriceInCentsMap: Map<string, number> | null;
  queriedSubitemNameMap: Map<string, string> | null;
}

export function SubitemFieldArray(props: SubitemFieldArrayProps) {
  return (
    <FieldArray name={yupItemSchema.fields.subitems.spec.meta["key"]}>
      {(fieldArrayHelpers) => (
        <SubitemField {...props} fieldArrayHelpers={fieldArrayHelpers} />
      )}
    </FieldArray>
  );
}
