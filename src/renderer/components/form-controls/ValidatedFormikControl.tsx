import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  SpaceProps,
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import { RefObject } from "react";

interface ValidatedFormikControlProps<T> {
  formikProps: FormikProps<T>;
  placeholder: string;
  name: string;
  value?: string; // props.formikProps.values.name as string | undefined
  error?: string; // props.formikProps.errors.name
  spaceProps?: SpaceProps;
  inputFieldRef?: RefObject<HTMLInputElement>;
  formLabelText?: string;
  helperText?: string;
  isRequired?: boolean;
  onPaste?: (text: string) => void;
}

export function ValidatedFormikControl<T>(
  props: ValidatedFormikControlProps<T>
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
      <Input
        ref={props.inputFieldRef}
        onChange={props.formikProps.handleChange}
        onBlur={props.formikProps.handleBlur}
        placeholder={props.placeholder}
        name={props.name} 
        value={props.value ?? ""}
        isInvalid={props.error ? true : false}
        onPaste={(e) => {
          if (props.onPaste) {
            props.onPaste(e.clipboardData.getData("Text"));
          }
        }}
      />
      {props.error && <FormErrorMessage>{props.error}</FormErrorMessage>}
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  );
}
