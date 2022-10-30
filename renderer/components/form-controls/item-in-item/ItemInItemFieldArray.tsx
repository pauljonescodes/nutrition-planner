import { FieldArray, FormikProps } from "formik";
import { ItemInferredType, yupItemSchema } from "../../../data/yup/item";
import { ItemInItemField } from "./ItemInItemField";

interface ItemInItemFieldArrayProps {
  formikProps: FormikProps<Partial<ItemInferredType>>;
}

export function ItemInItemFieldArray(props: ItemInItemFieldArrayProps) {
  return (
    <FieldArray name={yupItemSchema.fields.subitems.spec.meta["key"]}>
      {(fieldArrayHelpers) => (
        <ItemInItemField
          formikProps={props.formikProps}
          fieldArrayHelpers={fieldArrayHelpers}
        />
      )}
    </FieldArray>
  );
}
