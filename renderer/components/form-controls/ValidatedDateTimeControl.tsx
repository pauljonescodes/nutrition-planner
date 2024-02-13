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

interface ValidatedDatetimeControlProps<T> {
  formikProps: FormikProps<T>;
  name: string;
  placeholder?: string;
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
      <FormLabel>{props.formLabelText ?? props.placeholder}</FormLabel>
      <Datetime
        inputProps={{
          ref: props.inputFieldRef,
          onChange: props.formikProps.handleChange,
          onBlur: props.formikProps.handleBlur,
          placeholder: props.placeholder,
          name: props.name,
          onPaste: (e) => {
            if (props.onPaste) {
              props.onPaste(e.clipboardData.getData("Text"));
            }
          },
        }}
        closeOnSelect
        onChange={(value: string | moment.Moment) => {
          props.formikProps.setFieldValue(props.name, value);
        }}
        //
        value={props.value ?? ""}
      />
      {props.error && <FormErrorMessage>{props.error}</FormErrorMessage>}
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  );
}
