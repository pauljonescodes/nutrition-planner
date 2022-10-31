import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput,
  NumberInputField,
  SpaceProps,
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import { ChangeEvent } from "react";
import { BaseSchema } from "yup";

interface ValidatedFormikNumberControlProps<T> {
  formikProps: FormikProps<T>;
  yupSchemaField: BaseSchema;
  value?: number; // props.formikProps.values.name as string | undefined
  error?: string; // props.formikProps.errors.name
  spaceProps?: SpaceProps;
  transform?: (value: number) => number;
  onPaste?: (text: string) => void;
  format?: (value: number | undefined) => number;
}

export function ValidatedFormikNumberControl<T>(
  props: ValidatedFormikNumberControlProps<T>
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
          formNoValidate
          name={props.yupSchemaField.spec.meta["key"]}
          value={props.format ? props.format(props.value) : props.value}
          onPaste={(e) => {
            e.preventDefault();
            if (props.onPaste) {
              props.onPaste(e.clipboardData.getData("Text"));
            }
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (props.transform) {
              const valueFloat = parseFloat(e.currentTarget.value);
              props.formikProps.setFieldValue(
                props.yupSchemaField.spec.meta["key"],
                props.transform(valueFloat)
              );
            } else {
              props.formikProps.handleChange(e);
            }
          }}
          onBlur={props.formikProps.handleBlur}
          placeholder={props.yupSchemaField.spec.meta["placeholder"]}
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
