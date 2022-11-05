import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  SpaceProps,
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import { RefObject } from "react";
import Datetime from "react-datetime";
import { BaseSchema } from "yup";

interface ValidatedDatetimeControlProps<T> {
  formikProps: FormikProps<T>;
  yupSchemaField: BaseSchema;
  value?: Date; // props.formikProps.values.name as string | undefined
  error?: string; // props.formikProps.errors.name
  spaceProps?: SpaceProps;
  inputFieldRef?: RefObject<HTMLInputElement>;
  formLabelText?: string;
  helperText?: string;
  isRequired?: boolean;
  onPaste?: (text: string) => void;
}

export function ValidatedDatetimeControl<T>(
  props: ValidatedDatetimeControlProps<T>
) {
  return (
    <FormControl
      {...props.spaceProps}
      isInvalid={props.error !== undefined}
      isRequired={
        props.isRequired
        // props.yupSchemaField.describe().tests[0].name === "required"
      }
    >
      <FormLabel>
        {props.formLabelText ?? props.yupSchemaField.spec.label}
      </FormLabel>
      <Datetime
        inputProps={{
          ref: props.inputFieldRef,
          onChange: props.formikProps.handleChange,
          onBlur: props.formikProps.handleBlur,
          placeholder: props.yupSchemaField.spec.meta["placeholder"],
          name: props.yupSchemaField.spec.meta["key"], // not sure about this
          onPaste: (e) => {
            if (props.onPaste) {
              props.onPaste(e.clipboardData.getData("Text"));
            }
          },
        }}
        closeOnSelect
        onChange={(value: string | moment.Moment) => {
          props.formikProps.setFieldValue(
            props.yupSchemaField.spec.meta["key"],
            value
          );
        }}
        //
        value={props.value ?? ""}
      />
      {props.error && <FormErrorMessage>{props.error}</FormErrorMessage>}
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  );
}
