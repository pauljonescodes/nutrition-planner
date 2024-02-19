import { FieldArray, FormikProps } from "formik";
import { ItemInterface } from "../../data/interfaces";
import { ItemTypeEnum } from "../../data/item-type-enum";
import { SubitemField } from "./SubitemField";

interface SubitemFieldArrayProps {
  formikProps: FormikProps<ItemInterface>;
  itemTypesIn: Array<ItemTypeEnum>;
  name: string;
}

export function SubitemFieldArray(props: SubitemFieldArrayProps) {
  return (
    <FieldArray name={props.name}>
      {(fieldArrayHelpers) => (
        <SubitemField {...props} fieldArrayHelpers={fieldArrayHelpers} />
      )}
    </FieldArray>
  );
}