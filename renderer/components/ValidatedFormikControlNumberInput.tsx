import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput,
  NumberInputField,
  SpaceProps,
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import { BaseSchema } from "yup";

interface ValidatedFormikControlNumberInputProps<T> {
  formikProps: FormikProps<T>;
  yupSchemaField: BaseSchema;
  value?: number; // props.formikProps.values.name as string | undefined
  error?: string; // props.formikProps.errors.name
  spaceProps?: SpaceProps;
}

export function ValidatedFormikControlNumberInput<T>(
  props: ValidatedFormikControlNumberInputProps<T>
) {
  return (
    <FormControl {...props.spaceProps} isInvalid={props.error !== undefined}>
      <FormLabel htmlFor={props.yupSchemaField.spec.meta["key"]}>
        {props.yupSchemaField.spec.label}
      </FormLabel>
      <NumberInput
        defaultValue={props.value}
        isInvalid={props.error ? true : false}
      >
        <NumberInputField
          name={props.yupSchemaField.spec.meta["key"]}
          value={props.value}
          onChange={props.formikProps.handleChange}
          onBlur={props.formikProps.handleBlur}
          placeholder={props.yupSchemaField.spec.label}
        />
      </NumberInput>
      {props.error !== undefined && (
        <FormErrorMessage>{props.error}</FormErrorMessage>
      )}
    </FormControl>
  );
}

/*

*/
