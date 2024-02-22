import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  SpaceProps,
} from '@chakra-ui/react';
import { FormikProps } from 'formik';
import { RefObject } from 'react';

interface ValidatedFormikControlProps<T> {
  formikProps: FormikProps<T>;
  placeholder: string;
  name: string;
  value?: string; // formikProps.values.name as string | undefined
  error?: string; // formikProps.errors.name
  spaceProps?: SpaceProps;
  inputFieldRef?: RefObject<HTMLInputElement>;
  formLabelText?: string;
  helperText?: string;
  isRequired?: boolean;
  onPaste?: (text: string) => void;
}

export function ValidatedFormikControl<T>(
  props: ValidatedFormikControlProps<T>,
) {
  const {
    formikProps,
    placeholder,
    name,
    value,
    error,
    spaceProps,
    inputFieldRef,
    formLabelText,
    helperText,
    isRequired,
    onPaste,
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
      <FormLabel>{formLabelText ?? placeholder}</FormLabel>
      <Input
        ref={inputFieldRef}
        onChange={formikProps.handleChange}
        onBlur={formikProps.handleBlur}
        placeholder={placeholder}
        name={name}
        value={value ?? ''}
        isInvalid={!!error}
        onPaste={(e) => {
          if (onPaste) {
            onPaste(e.clipboardData.getData('Text'));
          }
        }}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
