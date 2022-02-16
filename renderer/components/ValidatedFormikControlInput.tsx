import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SpaceProps,
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import { RefObject } from "react";
import { BaseSchema } from "yup";

interface ValidatedFormikControlProps<T> {
  formikProps: FormikProps<T>;
  yupSchemaField: BaseSchema;
  value?: string; // props.formikProps.values.name as string | undefined
  error?: string; // props.formikProps.errors.name
  spaceProps?: SpaceProps;
  inputFieldRef?: RefObject<HTMLInputElement>;
}

export function ValidatedFormikControlInput<T>(
  props: ValidatedFormikControlProps<T>
) {
  return (
    <FormControl {...props.spaceProps} isInvalid={props.error !== undefined}>
      <FormLabel>{props.yupSchemaField.spec.label}</FormLabel>
      <Input
        ref={props.inputFieldRef}
        onChange={props.formikProps.handleChange}
        onBlur={props.formikProps.handleBlur}
        placeholder={props.yupSchemaField.spec.meta["placeholder"]}
        name={props.yupSchemaField.spec.meta["key"]} // not sure about this
        value={props.value}
        isInvalid={props.error ? true : false}
      />
      {props.error && <FormErrorMessage>{props.error}</FormErrorMessage>}
    </FormControl>
  );
}
