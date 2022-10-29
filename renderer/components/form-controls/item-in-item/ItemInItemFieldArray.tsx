import { FieldArray, FormikProps } from "formik";
import { ItemType } from "../../../data/yup/item";
import { yupItemInItemSchema } from "../../../data/yup/item-in-item";
import { ItemInItemField } from "./ItemInItemField";

interface ItemInItemFieldArrayProps {
  thisItemId: string;
  formikProps: FormikProps<ItemType>;
}

export function ItemInItemFieldArray(props: ItemInItemFieldArrayProps) {
  return (
    <FieldArray name={yupItemInItemSchema.spec.meta["key"]}>
      {(fieldArrayHelpers) => (
        <ItemInItemField
          thisItemId={props.thisItemId}
          formikProps={props.formikProps}
          fieldArrayHelpers={fieldArrayHelpers}
        />
      )}
    </FieldArray>
  );
}
