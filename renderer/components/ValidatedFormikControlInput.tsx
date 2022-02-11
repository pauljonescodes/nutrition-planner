import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import { BaseSchema } from "yup";

interface ValidatedFormikControlProps<T> {
  formikProps: FormikProps<T>;
  yupSchemaField: BaseSchema;
  value?: string; // props.formikProps.values.name as string | undefined
  error?: string; // props.formikProps.errors.name
}

export function ValidatedFormikControlInput<T>(
  props: ValidatedFormikControlProps<T>
) {
  return (
    <FormControl>
      <FormLabel>{props.yupSchemaField.spec.label}</FormLabel>
      <Input
        onChange={props.formikProps.handleChange}
        onBlur={props.formikProps.handleBlur}
        placeholder={props.yupSchemaField.spec.label}
        name={props.yupSchemaField.spec.meta["key"]} // not sure about this
        value={props.value}
        isInvalid={props.error ? true : false}
      />
      {props.error && <FormErrorMessage>{props.error}</FormErrorMessage>}
    </FormControl>
  );
}
