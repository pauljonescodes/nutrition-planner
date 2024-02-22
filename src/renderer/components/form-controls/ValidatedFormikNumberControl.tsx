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
} from '@chakra-ui/react';
import { FormikProps } from 'formik';
import { ChangeEvent } from 'react';

interface ValidatedFormikNumberControlProps<T> {
  formikProps: FormikProps<T>;
  name: string;
  placeholder?: string;
  value?: number; // formikProps.values.name as string | undefined
  error?: string; // formikProps.errors.name
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
  props: ValidatedFormikNumberControlProps<T>,
) {
  const {
    formikProps,
    name,
    placeholder,
    value,
    error,
    spaceProps,
    labelText,
    helperText,
    isRequired,
    showStepper,
    transform,
    onPaste,
    format,
  } = props;
  return (
    <FormControl
      {...spaceProps}
      isInvalid={error !== undefined}
      isRequired={
        isRequired
        // yupSchemaField.describe().tests[0].name === "required"
      }
    >
      <FormLabel htmlFor={name}>{labelText ?? placeholder}</FormLabel>
      <NumberInput defaultValue={value} isInvalid={!!error}>
        <NumberInputField
          formNoValidate
          name={name}
          value={format ? format(value) : value}
          onPaste={(e) => {
            if (onPaste) {
              e.preventDefault();
              onPaste(e.clipboardData.getData('Text'));
            }
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (transform) {
              const valueFloat = parseFloat(e.currentTarget.value);
              formikProps.setFieldValue(name, transform(valueFloat));
            } else {
              formikProps.handleChange(e);
            }
          }}
          onBlur={formikProps.handleBlur}
          placeholder={placeholder}
        />
        {showStepper && (
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        )}
      </NumberInput>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}

      {error !== undefined && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
