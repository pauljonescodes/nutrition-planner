import { FieldArray, FormikProps } from "formik";
import { Item } from "../../data/model/Item";
import { yupItemInItemSchema } from "../../data/model/ItemInItem";
import { ItemInItemField } from "./Field";

interface ItemInItemFieldArrayProps {
  thisItemId: string;
  formikProps: FormikProps<Item>;
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
