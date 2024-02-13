import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SpaceProps,
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import { ChangeEvent } from "react";

interface ValidatedFormikNumberControlProps<T> {
  formikProps: FormikProps<T>;
  name: string;
  placeholder?: string;
  value?: number; // props.formikProps.values.name as string | undefined
  error?: string; // props.formikProps.errors.name
  spaceProps?: SpaceProps;
  labelText?: string;
  helperText?: string;
  isRequired?: boolean;
  showStepper?: boolean;
  transform?: (value: number) => number;
  onPaste?: (text: string) => void;
  format?: (value: number | undefined) => number;
}

export function ValidatedFormikNumberControl<T>(
  props: ValidatedFormikNumberControlProps<T>
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
      <FormLabel htmlFor={props.name}>
        {props.labelText ?? props.placeholder}
      </FormLabel>
      <NumberInput
        defaultValue={props.value}
        isInvalid={props.error ? true : false}
      >
        <NumberInputField
          formNoValidate
          name={props.name}
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
                props.name,
                props.transform(valueFloat)
              );
            } else {
              props.formikProps.handleChange(e);
            }
          }}
          onBlur={props.formikProps.handleBlur}
          placeholder={props.placeholder}
        />
        {props.showStepper && (
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        )}
      </NumberInput>
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}

      {props.error !== undefined && (
        <FormErrorMessage>{props.error}</FormErrorMessage>
      )}
    </FormControl>
  );
}
