import { FieldArray, FormikProps } from "formik";
import { ItemInterface } from "../../data/interfaces";
import { ItemTypeEnum } from "../../data/item-type-enum";
import { yupItemSchema } from "../../data/yup-schema";
import { SubitemField } from "./SubitemField";

interface SubitemFieldArrayProps {
  formikProps: FormikProps<ItemInterface>;
  itemTypesIn: Array<ItemTypeEnum>;
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
