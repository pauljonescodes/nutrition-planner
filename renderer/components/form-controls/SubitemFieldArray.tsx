import { FieldArray, FormikProps } from "formik";
import { ItemInferredType, yupItemSchema } from "../../data/yup/item";
import { SubitemField } from "./SubitemField";

interface SubitemFieldArrayProps {
  formikProps: FormikProps<Partial<ItemInferredType>>;
}

export function SubitemFieldArray(props: SubitemFieldArrayProps) {
  return (
    <FieldArray name={yupItemSchema.fields.subitems.spec.meta["key"]}>
      {(fieldArrayHelpers) => (
        <SubitemField
          formikProps={props.formikProps}
          fieldArrayHelpers={fieldArrayHelpers}
        />
      )}
    </FieldArray>
  );
}
